var express = require("express"),
    bodyParser = require("body-parser"),
    mongoose = require("mongoose"),
    passport = require("passport"),
    flash = require("connect-flash"),
    LocalStrategy = require("passport-local"),
    methodOverride = require('method-override');
    Campground = require("./models/campground"),
    Comment = require("./models/comment"),
    User = require("./models/user"),
    app = express();

//requiring routes
var campgroundRoutes = require("./routes/campgrounds"),
    commentRoutes = require("./routes/comments"),
    indexRoutes = require("./routes/index");


mongoose.connect("mongodb://localhost:27017/YelpCamp", { useNewUrlParser: true });

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.set("view engine", "ejs");
app.use(express.static(__dirname + '/public'));
app.use(methodOverride("_method"));
app.use(flash());

app.use(require("express-session")({
    secret: "Everybody lies",
    resave: false,
    saveUninitialized: false
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(function(req, res, next) {
    res.locals.currentUser = req.user;
    res.locals.error = req.flash("error");
    res.locals.success = req.flash("success");
    next();
});

passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/campgrounds",campgroundRoutes);
app.use("/campgrounds/:id/comments", commentRoutes);
app.use(indexRoutes);

app.listen(3000, function () {
    console.log("YelpCampApp is now listening port 3000");
});