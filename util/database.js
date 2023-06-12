const Sequelize = require("sequelize");
const sequelize = new Sequelize("groupchat", "root", "sandhya", {
    dialect : "mysql",
    host : "localhost",
});

module.exports = sequelize;