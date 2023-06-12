const express = require("express");
const app = express();

const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");


const cors = require("cors");
app.use(cors());

const dotenv = require("dotenv");
dotenv.config();

const sequelize = require("./util/database");

const userRouter = require("./router/userRouter");

const User = require("./models/userModel");

app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());

app.use("/", userRouter);
app.use("/user", userRouter);

sequelize
  .sync()
  .then((result) => {
    app.listen(process.env.PORT || 3000);
    console.log("server started at port 3000");
  })
  .catch((err) => console.log(err));


