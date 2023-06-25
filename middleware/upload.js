const multer = require('multer');

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

// Create a multer upload instance
const upload = multer({ storage });

// Use the multer upload middleware in your route
router.post('/upload', upload.single('file'), chatController.uploadFile);
