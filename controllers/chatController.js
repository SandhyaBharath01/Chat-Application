const path = require("path");
const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const sequelize = require("../util/database");

exports.sendMessage = async (req, res, next) => {
  try {
    await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
    });
    return res.status(200).json({ message: "Success!" });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error" });
  }
};

exports.getMessages = async (req, res, next) => {
  try {
    const user = req.user;
    const messages = await Chat.findAll({
      where: { userId: user.id },
      include: [{ model: User, as: 'user' }]
    });
    

    const formattedMessages = messages.map((message) => ({
      name: message.user.name,
      message: message.message
    }));
    

    res.status(200).json({ message: "Messages Fetching success", messages: formattedMessages });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Messages fetching error" });
  }
};

