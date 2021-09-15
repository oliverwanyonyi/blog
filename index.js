const express = require("express");
const fs = require("fs");
const app = express();
const bodyParser = require("body-parser");
const session = require("express-session");
const MongoDbStore = require("connect-mongodb-session")(session);
const path = require("path");
const helmet = require("helmet");
const compressor = require("compression");
const dotenv = require("dotenv");
const flash = require("connect-flash");
const mongoose = require("mongoose");
const User = require("./models/user");
const multer = require("multer");
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

app.use(helmet());
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
  res.locals.isAuthenticated = req.session.userLoggedIn;
  next();
});

app.use(homeRoutes);
app.use(signUpRoutes);
app.use(postRoutes);
app.use(accountRoutes);
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
