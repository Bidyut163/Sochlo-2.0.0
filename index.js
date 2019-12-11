const bodyParser = require("body-parser");
const methodOverride = require("method-override");
const expressSanitizer = require("express-sanitizer");
const mongoose = require("mongoose");
const passport = require("passport");
const localStrategy = require("passport-local");
const User = require("./models/user");
const middleware = require("./middleware");
const flash = require("connect-flash");
const express = require("express");
const app = express();

const postRoutes = require("./routes/posts");
const indexRoutes = require("./routes/index");
const adminRoutes = require("./routes/admin");

// APP CONFIG
const url = process.env.DATABASEURL || "mongodb://localhost/sochlo";
mongoose.connect(url, { useMongoClient: true }, () => {
  console.log("MongoDB Connected");
});

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(expressSanitizer());
app.use(methodOverride("_method"));
app.use(flash());

app.use(
  require("express-session")({
    secret: "I am the funniest person alive!",
    resave: false,
    saveUninitialized: false
  })
);
app.use(passport.initialize());
app.use(passport.session());
passport.use(new localStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.locals.moment = require("moment");
//Current user config
app.use(function(req, res, next) {
  res.locals.currentUser = req.user;
  res.locals.error = req.flash("error");
  res.locals.success = req.flash("success");
  next();
});

// RESTFUL ROUTES
app.use("/admin", middleware.isLoggedIn, middleware.isUser, adminRoutes);
app.use("/posts", postRoutes);
app.use("/", indexRoutes);

const port = process.env.PORT || 5000;

app.listen(port, process.env.IP, function() {
  console.log("SERVER IS RUNNING AT PORT", port);
});
