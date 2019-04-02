var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require ("../middleware");


//INDEX show all campgrounds
router.get("/", function (req, res) {

    Campground.find({}, function (err, campgrounds) {
        if (err) {
            console.log(err);
        } else {
            res.render("campgrounds/index", { campgrounds: campgrounds });
        }
    });
});


//CREATE adds a new campground to DB
router.post("/", middleware.isLoggedIn, function (req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var image = req.body.image;
    var description = req.body.description;
    var author = {
        id: req.user._id,
        username: req.user.username
    }
    var newCampground = { name: name, price: price, image: image, description: description, author: author };
    Campground.create(newCampground, function (err, newlyCreated) {
        if (err) {
            console.log(err);
        } else {
            res.redirect("/campgrounds");
        }
    });
});


//NEW shows form to create a new campground
router.get("/new", middleware.isLoggedIn, function (req, res) {
    res.render("campgrounds/new");
});


//SHOW shows a particular campground by it's id
router.get("/:id", function (req, res) {
    Campground.findById(req.params.id).populate("comments").exec(function (err, foundCampground) {
        if (err) {
            req.flash("error", err.message);
        } else {
            res.render("campgrounds/show", { campground: foundCampground });
        }
    });
});

//EDIT Campground route

router.get("/:id/edit", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findById(req.params.id, function (err, foundCampground) {
        if (err) {
            req.flash("error", err.message);
        }
        res.render("campgrounds/edit", { campground: foundCampground });
    });
});

//UPDATE Campground route

router.put("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findByIdAndUpdate(req.params.id, req.body.campground, function (err, updatedCampground) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            req.flash("success", "Successfully edited campground!");
            res.redirect("/campgrounds/" + req.params.id);
        }
    });
});

//Delete Campground route

router.delete("/:id", middleware.checkCampgroundOwnership, function (req, res) {
    Campground.findOneAndDelete(req.params.id, function (err) {
        if (err) {
            console.log(err);
            res.redirect("/campgrounds");
        } else {
            res.redirect("/campgrounds");
        }
    });
});

module.exports = router;