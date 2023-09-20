//jshint esversion:6
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";

const app = express();

app.set("view engine", "ejs");
app.use(express.urlencoded({ extended: true }));
app.use(express.static("public"));

app.use(
    session({
        secret: process.env.SECRET,
        resave: false,
        saveUninitialized: false
    })
);

app.use(passport.initialize());
app.use(passport.session());

mongoose.connect("mongodb://localhost:27017/userDB");

const userSchema = new mongoose.Schema();
userSchema.plugin(passportLocalMongoose);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.get("/", (req, res) => {
    res.render("home");
});

app.get("/register", (req, res) => {
    res.render("register");
});

app.post("/register", (req, res) => {
    User.register(
        { username: req.body.username },
        req.body.password,
        (err, user) => {
            if (err) {
                console.log(err);
                res.redirect("/register");
            }
            passport.authenticate("local")(req, res, () => {
                res.redirect("/secrets");
            });
        }
    );
});

app.get("/login", (req, res) => {
    res.render("login");
});

app.post("/login", passport.authenticate("local"), (req, res) => {
    const user = new User({
        username: req.body.username,
        password: req.body.password
    });

    req.login(user, (err) => {
        if (err) {
            console.log(err);
            res.redirect("/login");
        } else {
            res.redirect("/secrets");
        }
    });
});

app.get("/secrets", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("secrets");
    } else {
        res.redirect("/login");
    }
});

app.get("/logout", (req, res) => {
    req.logout((err) => {
        if (err) console.log(err);
        res.redirect("/");
    });
});

app.listen(3000, () => {
    console.log("Server started on port 3000");
});
