const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const path = require("path");
const compressor = require("compression");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const User = require("./models/user");
const multer = require("multer");
const errorUtil = require("./util/errormessage").getErrorMessage;
dotenv.config();

const port = process.env.PORT || 8080;

const store = new MongoDbStore({
  uri: process.env.MONGO_URL,
  collection: "sessions",
});

app.set("view engine", "ejs");
app.set("views", "views");

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, new Date().getTime() + "-" + file.originalname);
  },
});

const fileFilter = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "images/webp"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};

const homeRoutes = require("./routes/home");
const signUpRoutes = require("./routes/auth");
const postRoutes = require("./routes/post");
const errorController = require("./controllers/error");
const accountRoutes = require("./routes/account");
const adminRoutes = require("./routes/admin.routes");
const categories = require("./models/categories");
app.use(compressor());

app.use(bodyParser.urlencoded({ extended: false }));
app.use(
  multer({ storage: fileStorage, fileFilter: fileFilter }).single("image")
);
app.use(express.static(path.join(__dirname, "public")));
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

app.use(
  session({
    secret: "my secret",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);
app.use(flash());

app.use((req, res, next) => {
  if (!req.session.user) {
    return next();
  }
  User.findById(req.session.user._id)
    .then((user) => {
      if (!user) {
        return next();
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      next(new Error(err));
    });
});
app.use((req, res, next) => {
  res.locals.isAuthenticated = req.session.userLoggedIn;
  res.locals.user = req.user;
  res.locals.successMessage = errorUtil(req.flash("success"));
  res.locals.errorMessage = errorUtil(req.flash("error"));
  categories
    .find()
    .then((cates) => {
      if (!cates) {
        return next();
      }
      res.locals.categories = cates;
    })
    .catch((err) => console.log(err));
  next();
});

app.use(homeRoutes);
app.use(signUpRoutes);
app.use(postRoutes);
app.use(accountRoutes);
app.use(adminRoutes);
app.use(errorController.getErrorPage);

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("database connected");
    app.listen(port, () => {
      console.log(`server is running at port ${port}`);
    });
  })
  .catch((err) => console.log(err));
