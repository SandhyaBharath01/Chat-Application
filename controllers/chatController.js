const User = require("../models/userModel");
const Chat = require("../models/chatModel");
const Group = require("../models/groupModel");
const fs = require("fs"); 
const AWS = require('aws-sdk');
const multer = require('multer');

AWS.config.update({
  accessKeyId: process.env.YOUR_ACCESS_KEY_ID,
  secretAccessKey: process.env.YOUR_SECRET_ACCESS_KEY,
  region: 'eu-north-1',
});

const io = require("socket.io")(5000, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"],
    allowedHeaders: ["my-custom-header"],
    credentials: true,
  },
});

io.on("connection", (socket) => {
  socket.on("getMessages", async (groupName) => {
    try {
      const group = await Group.findOne({ where: { name: groupName } });
      const messages = await Chat.findAll({
        where: { groupId: group.dataValues.id },
      });
      console.log("Request Made");
      io.emit("messages", messages);
    } catch (error) {
      console.log(error);
    }
  });
});

exports.sendMessage = async (req, res, next) => {
  try {
    const group = await Group.findOne({
      where: { name: req.body.groupName },
    });

    await Chat.create({
      name: req.user.name,
      message: req.body.message,
      userId: req.user.id,
      groupId: group.dataValues.id,
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
      order: [["createdAt", "DESC"]],
      limit: 10, 
      include: [{ model: User, as: "user" }],
    });

    const formattedMessages = messages.map((message) => ({
      name: message.user.name,
      message: message.message,
    }));

    res
      .status(200)
      .json({ message: "Messages Fetching success", messages: formattedMessages });
  } catch (err) {
    console.log(err);
    res.status(500).json({ success: false, message: "Messages fetching error" });
  }
};


// Create a multer storage instance
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    // Specify the directory where uploaded files will be stored
    cb(null, 'uploads');
  },
  filename: (req, file, cb) => {
    // Generate a unique filename for the uploaded file
    cb(null, `${new Date().getTime()}_${file.originalname}`);
  },
});
const upload = multer({ storage });

exports.uploadFile = async (req, res, next) => {
  try {
    // Use the upload middleware to handle file upload
    upload.single('file')(req, res, (err) => {
      if (err) {
        console.log('Error uploading file:', err);
        return res.status(400).json({ message: "Error uploading file" });
      }

      // Access the uploaded file from req.file
      const file = req.file;
      console.log("file", file);

      // Read the file from temporary location
      const fileContent = fs.readFileSync(file.path);

      // Configure AWS credentials
      AWS.config.update({
        accessKeyId: process.env.YOUR_ACCESS_KEY_ID,
        secretAccessKey: process.env.YOUR_SECRET_ACCESS_KEY,
        region: process.env.YOUR_AWS_REGION,
      });

      // Create an S3 instance
      const s3 = new AWS.S3();

      // Set the S3 parameters
      const params = {
        Bucket: 'fullstackexpensetracker',
        Key: `${req.user.id}Expense/${new Date().getTime()}_${file.originalname}`,
        Body: fileContent,
        ACL: "public-read",
      };

      // Upload the file to S3
      s3.upload(params, (err, data) => {
        if (err) {
          console.log('Error uploading file:', err);
          return res.status(400).json({ message: "Error uploading file" });
        } else {
          console.log('File uploaded successfully. File URL:', data.Location);
          return res.status(200).json({ message: "File uploaded successfully", fileUrl: data.Location });
        }
      });
    });
  } catch (error) {
    console.log(error);
    return res.status(400).json({ message: "Error uploading file" });
  }
};



