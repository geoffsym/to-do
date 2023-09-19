//jshint esversion:6
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import sha256 from "crypto-js/sha256.js";

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema({
    email: String,
    password: String
});
userSchema.plugin(encrypt, {
    secret: process.env.SECRET,
    encryptedFields: ["password"]
});
const User = mongoose.model("User", userSchema);

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    const newUser = new User({
        email: req.body.username,
        password: sha256(req.body.password)
    });

    newUser.save().then(() => {
        console.log(`${newUser.email} added as new user`);
        res.render("secrets");
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    User.findOne({ email: req.body.username }).then((foundUser) => {
        if (foundUser.password === sha256(req.body.password)) {
            res.render("secrets");
        } else {
            res.render("home");
        }
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
