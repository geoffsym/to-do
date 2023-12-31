//jshint esversion:6
import "dotenv/config";
import express from "express";
import mongoose from "mongoose";
import session from "express-session";
import passport from "passport";
import passportLocalMongoose from "passport-local-mongoose";
import GoogleStrategy from "passport-google-oauth20";
import findOrCreate from "mongoose-findorcreate";

// need this to make it work on Paychex network
import https from "https";
https.globalAgent.options.rejectUnauthorized = false;

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

const userSchema = new mongoose.Schema({
    username: String,
    password: String,
    googleId: String,
    secret: String
});
userSchema.plugin(passportLocalMongoose);
userSchema.plugin(findOrCreate);
const User = mongoose.model("User", userSchema);

passport.use(User.createStrategy());

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id)
        .then(function (foundUser) {
            done(null, foundUser);
        })
        .catch(function (err) {
            done(err, null);
        });
});

passport.use(
    new GoogleStrategy(
        {
            clientID: process.env.CLIENT_ID,
            clientSecret: process.env.CLIENT_SECRET,
            callbackURL: "http://localhost:3000/auth/google/secrets"
        },
        (accessToken, refreshToken, profile, cb) => {
            User.findOrCreate({ googleId: profile.id }, (err, foundUser) => {
                return cb(err, foundUser);
            });
        }
    )
);

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

app.get(
    "/auth/google",
    passport.authenticate("google", { scope: ["profile"] })
);

app.get(
    "/auth/google/secrets",
    passport.authenticate("google", { failureRedirect: "/login" }),
    (req, res) => {
        res.redirect("/secrets");
    }
);

app.get("/secrets", (req, res) => {
    User.find({ secret: { $ne: null } }).then((foundUsers) => {
        if (foundUsers) {
            res.render("secrets", { usersWithSecrets: foundUsers });
        }
    });
});

app.get("/submit", (req, res) => {
    if (req.isAuthenticated()) {
        res.render("submit");
    } else {
        res.redirect("/login");
    }
});

app.post("/submit", (req, res) => {
    User.findById(req.user.id).then((foundUser) => {
        foundUser.secret = req.body.secret;
        foundUser.save().then(res.redirect("/secrets"));
    });
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
