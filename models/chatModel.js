const Sequelize = require("sequelize");
const sequelize = require("../util/database");
const User = require("./userModel"); // Import the User model

const Chat = sequelize.define("chats", {
  id: {
    type: Sequelize.INTEGER,
    autoIncrement: true,
    allowNull: false,
    primaryKey: true,
  },
  message: {
    type: Sequelize.STRING,
  },
});

Chat.belongsTo(User, { foreignKey: 'userId', targetKey: 'id', as: 'user' });

module.exports = Chat;
