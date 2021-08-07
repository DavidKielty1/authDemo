const express = require("express");
const app = express();
const mongoose = require("mongoose");
const User = require("./models/user");
const ejsMate = require("ejs-mate");
const bcrypt = require("bcrypt");

mongoose
  .connect("mongodb://localhost:27017/authDemo", {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
    useFindAndModify: false,
  })
  .then(() => {
    console.log("MONGO CONNECTION OPEN!!");
  })
  .catch((err) => {
    console.log("OH NO MONGO CONNECTION ERROR");
    console.log(err);
  });

app.set("view engine", "ejs");
app.set("views", "views");
app.engine("ejs", ejsMate);

app.use(express.urlencoded({ extended: true }));

app.get("/", (req, res) => {
  res.send("This is the home page");
});

app.get("/register", (req, res) => {
  res.render("register");
});

app.post("/register", async (req, res) => {
  const { password, username } = req.body;
  const hash = await bcrypt.hash(password, 12);
  const user = new User({
    username,
    password: hash,
  });
  await user.save();
  res.redirect("/login");
});

app.get("/login", (req, res) => {
  res.render("login");
});

app.post("/login", async (req, res) => {
  const { password, username } = req.body;
  const user = await User.findOne({ username });
  const authPass = await bcrypt.compare(password, user.password);
  if (authPass) {
    res.send("yaaay welcome");
  } else {
    res.send("try again");
  }
});

app.get("/secret", (req, res) => {
  res.send("THIS IS SECRET! YOU CANNOT SEE ME UNLESS YOU ARE LOGGED IN");
});

app.listen(3000, () => {
  console.log("App is being serving on port 3000.");
});
