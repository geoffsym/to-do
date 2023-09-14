//jshint esversion:6

import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/todolistDB");

const itemSchema = {
    name: String
};

const Item = mongoose.model("Item", itemSchema);

const app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", async (req, res) => {
    if (!(await Item.exists())) {
        const item1 = new Item({
            name: "Welcome to your to-do list!"
        });
        const item2 = new Item({
            name: "Check items off the list to delete them"
        });
        const item3 = new Item({
            name: "Add your own items below 👇"
        });
        const defaultItems = [item1, item2, item3];

        Item.insertMany(defaultItems)
            .then(console.log("Default items added to DB"))
            .catch((err) => {
                if (err) console.log("Error adding default items to DB");
            });

        res.render("list", { listTitle: "Today", newListItems: defaultItems });
    } else {
        const items = await Item.find();
        res.render("list", { listTitle: "Today", newListItems: items });
    }
});

app.post("/", (req, res) => {
    if (!req.body.itemName) {
        res.redirect("/");
    } else if (req.body.list === "Work") {
        workItems.push(item);
        res.redirect("/work");
    } else {
        const item = new Item({
            name: req.body.itemName
        });
        item.save();
        res.redirect("/");
    }
});

app.get("/work", (req, res) => {
    res.render("list", { listTitle: "Work List", newListItems: workItems });
});

app.get("/about", (req, res) => {
    res.render("about");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
