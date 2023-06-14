const express = require("express");
const userController = require("../controllers/userController");
const router = express.Router();
const userAuthentication = require("../middleware/auth");

router.use(express.static("public"));

router.get("/", userController.getLoginPage);

router.post("/signUp", userController.postUserSignup);
router.post("/login", userController.postUserLogin);




module.exports = router;