const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const cors = require("cors");
app.use(
  cors({
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  })
);

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

const userRouter = require("./router/userRouter");
const homePageRouter = require("./router/homePageRouter");
const chatRouter = require("./router/chatRouter");

const User = require("./models/userModel");
const Chat = require("./models/chatModel");

User.hasMany(Chat);
Chat.belongsTo(User);

app.use(express.static("public"));

app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/user", userRouter);
app.use("/homePage", homePageRouter);
app.use("/chat",chatRouter);


sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    console.log("server started at port 3000");
  })
  .catch((err) => console.log(err));

