import express from "express";

const app = express();
const port = 3000;
const personal = [];
const work = [];

function ToDoItem(text) {
    this.text = text;
    this.done = false;
}

function addToList(list, text) {
    if (text) {
        let newItem = new ToDoItem(text);
        list.push(newItem);
    }
}

function setItemDone(list, index, isDone) {
    if (isDone) {   
        list[index].done = true;
    } else {
        list[index].done = false;
    }
}


app.use(express.static("public"))
app.use(express.urlencoded( {extended: true }))

app.get("/", (req, res) => {
    res.redirect("/personal")
});


app.get("/personal", (req, res) => {
    res.render("index.ejs", { 
        listType: "personal",
        list: personal
    });
});

app.post("/personal", (req, res) => {
    setItemDone(personal, req.body.index, req.body.done);
    res.redirect("back");
});

app.post("/personal/add", (req, res) => {
    addToList(personal, req.body.itemText);
    res.redirect("back")
});


app.get("/work", (req, res) => {
    res.render("index.ejs", {
        listType: "work",
        list: work
    });
});

app.post("/work", (req, res) => {
    setItemDone(work, req.body.index, req.body.done);
    res.redirect("back");
});

app.post("/work/add", (req, res) => {
    addToList(work, req.body.itemText);
    res.redirect("back")
});


app.listen(port, () => {
    console.log(`Listening on port ${port}`);
});