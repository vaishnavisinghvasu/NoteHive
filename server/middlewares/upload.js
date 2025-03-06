const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/");  // Ensure this folder exists
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()}-${file.originalname}`);
    }
});

// Multer upload instance
const upload = multer({ storage });

module.exports = upload;
