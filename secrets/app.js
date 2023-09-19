//jshint esversion:6
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import encrypt from "mongoose-encryption";
import bcrypt from "bcrypt";

const saltRounds = 10;

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
    bcrypt.hash(req.body.password, saltRounds, (err, hash) => {
        const newUser = new User({
            email: req.body.username,
            password: hash
        });

        newUser.save().then(() => {
            console.log(`${newUser.email} added as new user`);
            res.render("secrets");
        });
    });
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", (req, res) => {
    User.findOne({ email: req.body.username }).then((foundUser) => {
        if (foundUser) {
            bcrypt.compare(
                req.body.password,
                foundUser.password,
                (err, result) => {
                    if (result === true) res.render("secrets");
                    else res.render("login");
                }
            );
        } else {
            res.render("login");
        }
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
