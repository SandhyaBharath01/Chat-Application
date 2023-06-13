const path = require("path");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const sequelize = require("../util/database");

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

const postUserSignup = async (req, res, next) => {
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
  
      const user = await User.findOne({ where: { email: email } });
      if (!user) {
        return res.status(404).json({ message: "User does not exist" });
      }
  
      const passwordMatch = await bcrypt.compare(password, user.password);
      if (!passwordMatch) {
        return res.status(401).json({ message: "Password incorrect" });
      }
  
      const token = generateAccessToken(user.id, user.email);
      res.status(200).json({ message: "Login successful", token: token });
      res.sendFile(path.join(__dirname, "../", "public", "views", "homePage.html")); // Send the homePage.html
    } catch (error) {
      console.log(error);
      return res.status(500).json({ message: "Internal Server Error" });
    }
  };
  
  

module.exports = {
    postUserSignup,
    getLoginPage,
    postUserLogin
};