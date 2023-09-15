//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import _ from "lodash";

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const listSchema = {
    title: String,
    items: [itemSchema]
};

const List = mongoose.model("List", listSchema);

const item1 = new Item({
    name: "Welcome to your new list!"
});
const item2 = new Item({
    name: "Delete an item by checking it off"
});
const item3 = new Item({
    name: "Add your own items below 👇"
});
const defaultItems = [item1, item2, item3];

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    Item.find().then((items) => {
        if (items.length > 0) {
            res.render("list", {
                listTitle: "Today",
                newListItems: items
            });
        } else {
            console.log("Adding default items to root list");
            Item.insertMany(defaultItems).then(res.redirect("/"));
        }
    });
});

app.get("/:listTitle", (req, res) => {
    const customListTitle = _.capitalize(req.params.listTitle);

    List.findOne({ title: customListTitle }).then((list) => {
        if (list) {
            res.render("list", {
                listTitle: customListTitle,
                newListItems: list.items
            });
        } else {
            let newList = new List({
                title: customListTitle,
                items: defaultItems
            });
            console.log(`Saving new list: ${customListTitle}`);
            newList.save().then(res.redirect(`/${customListTitle}`));
        }
    });
});

app.post("/", (req, res) => {
    let newItem = new Item({
        name: req.body.itemName
    });
    if (req.body.listTitle === "Today") {
        if (!newItem.name) {
            res.redirect("/");
        } else {
            newItem.save().then(res.redirect("/"));
        }
    } else {
        if (!newItem.name) {
            res.redirect(`/${req.body.listTitle}`);
        } else {
            List.findOneAndUpdate(
                { title: req.body.listTitle },
                { $push: { items: newItem } }
            ).then(res.redirect(`/${req.body.listTitle}`));
        }
    }
});

app.post("/delete", (req, res) => {
    if (req.body.listTitle === "Today") {
        Item.findByIdAndDelete(req.body.item_id).then(res.redirect("/"));
    } else {
        List.findOneAndUpdate(
            { title: req.body.listTitle },
            { $pull: { items: { _id: req.body.item_id } } }
        ).then(res.redirect(`/${req.body.listTitle}`));
    }
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
