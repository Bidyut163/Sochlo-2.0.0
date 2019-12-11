const express = require("express");
const router = express.Router();
const Post = require("../models/post");
const Category = require("../models/category");
const User = require("../models/user");
const middleware = require("../middleware");

router.get("/dashboard", (req, res) => {
  const perPage = 8;
  const pageQuery = parseInt(req.query.page);
  const pageNumber = pageQuery ? pageQuery : 1;

  Post.find({})
    .skip(perPage * pageNumber - perPage)
    .limit(perPage)
    .exec((err, posts) => {
      Post.count().exec((err, count) => {
        err
          ? console.log(err)
          : Category.find({}, (err, categories) => {
              err
                ? console.log(err)
                : User.find({}, (err, users) => {
                    err
                      ? console.log(err)
                      : res.render("admin/dashboard", {
                          posts: posts,
                          categories: categories,
                          users: users,

                          current: pageNumber,
                          pages: Math.ceil(count / perPage)
                        });
                  });
            });
      });
    });
});

router.get("/posts", (req, res) => {
  const perPage = 8;
  const pageQuery = parseInt(req.query.page);
  const pageNumber = pageQuery ? pageQuery : 1;

  Post.find({})
    .skip(perPage * pageNumber - perPage)
    .limit(perPage)
    .exec((err, posts) => {
      Post.count().exec((err, count) => {
        err
          ? console.log(err)
          : Category.find({}, (err, categories) => {
              err
                ? console.log(err)
                : res.render("admin/posts", {
                    posts: posts,
                    categories: categories,
                    current: pageNumber,
                    pages: Math.ceil(count / perPage)
                  });
            });
      });
    });
});

router.get("/categories", middleware.isAdmin, (req, res) => {
  Category.find({}, (err, categories) => {
    err
      ? console.log(err)
      : res.render("admin/categories", { categories: categories });
  });
});

// Create Category
router.post("/categories", middleware.isAdmin, (req, res) => {
  Category.create(req.body.category, (err, category) => {
    if (err) {
      req.flash("error", "something went wrong");
      return res.redirect("back");
    }
    res.redirect("/admin/categories");
  });
});

// DELETE CATEGORY ROUTE
router.delete("/categories/:id", middleware.isAdmin, function(req, res) {
  //destroy category
  Category.findByIdAndRemove(req.params.id, err => {
    if (err) {
      req.flash("error", "something went wrong");
      res.redirect("/admin/categories");
    } else {
      req.flash("success", "succesfully deleted");
      res.redirect("/admin/categories");
    }
  });
  //redirect somewhere
});

// GET USERS
router.get("/users", middleware.isAdmin, (req, res) => {
  User.find({}, (err, users) => {
    err ? console.log(err) : res.render("admin/users", { users: users });
  });
});

// GET PROFILE
router.get("/profile/:id", (req, res) => {
  User.findOne({ _id: req.params.id }, (err, user) => {
    err ? console.log(err) : res.render("admin/profile", { user: user });
  });
});

router.get("/login", (req, res) => {
  res.render("admin/login");
});

router.put("/profile/:id", middleware.isAdmin, (req, res) => {
  const { username, email } = req.body;

  if (req.body.access === "Admin") {
    const isUser = true;
    const isAdmin = true;
  }

  if (req.body.access === "User") {
    isUser = true;
    isAdmin = false;
  }
  User.findByIdAndUpdate(
    { _id: req.params.id },
    { $set: { username, email, isUser, isAdmin } },
    err => {
      err ? console.log(err) : res.redirect("/admin/users");
    }
  );
});

// DELETE USER ROUTE
router.delete("/:id", middleware.isAdmin, (req, res) => {
  User.findByIdAndRemove(req.params.id, err => {
    err ? console.log(err) : res.redirect("/admin/users");
  });
});

module.exports = router;
