//jshint esversion:6
import express from "express";
import mongoose from "mongoose";

mongoose.connect("mongodb://localhost:27017/userDB")

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
