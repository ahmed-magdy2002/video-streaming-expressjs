const express = require("express");
const router = express.Router();
const multer = require("multer");
const path = require("path");

const auth = require("../middleware/authMiddleware");

const {
  uploadVideo,
  getVideo,
  listVideos,
} = require("../controllers/videoController");

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, path.join(__dirname, "../uploads"));
  },

  filename: (req, file, cb) => {
    const unique = Date.now();

    cb(null, unique + path.extname(file.originalname));
  },
});

const upload = multer({ storage });

router.post("/upload", auth, upload.single("video"), uploadVideo);

router.get("/:id", getVideo);
router.get("/", listVideos);

module.exports = router;
