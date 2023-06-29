const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

function generateAccessToken(id, email) {
  return jwt.sign({ userId: id, email: email }, process.env.TOKEN);
}

const getLoginPage = async (req, res, next) => {
  try {
    res.sendFile(path.join(__dirname, "../", "public", "views", "login.html"));
  } catch (error) {
    console.log(error);
  }
};

const postUserSignUp = async (req, res, next) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;
    const phonenumber = req.body.phonenumber;

    const user = await User.findOne({ where: { email: email } });
    if (user) {
      return res
        .status(409)
        .send(
          `<script>alert('This email is already taken. Please Login.'); window.location.href='/'</script>`
        );
    }

    bcrypt.hash(password, 10, async (err, hash) => {
      await User.create({
        name: name,
        email: email,
        password: hash,
        phonenumber: phonenumber,
      });
    });

    return res
      .status(200)
      .send(
        `<script>alert('User Created Successfully!'); window.location.href='/'</script>`
      );
  } catch (error) {
    console.log(error);
    return res.status(500).send("Internal Server Error");
  }
};

const postUserLogin = async (req, res, next) => {
  try {
    const email = req.body.loginEmail;
    const password = req.body.loginPassword;

    await User.findOne({ where: { email: email } }).then((user) => {
      if (user) {
        bcrypt.compare(password, user.password, (err, result) => {
          if (err) {
            return res
              .status(500)
              .json({ success: false, message: "Something went Wrong!" });
          }
          if (result == true) {
            return res.status(200).json({
              success: true,
              message: "Login Successfull!",
              token: generateAccessToken(user.id, user.email),
            });
          } else {
            return res.status(401).json({
              success: false,
              message: "Password Incorrect!",
            });
          }
        });
      } else {
        return res.status(404).json({
          success: false,
          message: "User doesn't Exists!",
        });
      }
    });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getLoginPage,
  postUserSignUp,
  postUserLogin,
};