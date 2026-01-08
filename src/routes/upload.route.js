const express = require("express");
const cloudinary = require("../configs/cloudinary");
const upload = require("../middleware/multer");

const router = express.Router();

router.post("/", upload.single("image"), async (req, res) => {
  try {
    const file = req.file;

    const result = await cloudinary.uploader.upload(
      `data:${file.mimetype};base64,${file.buffer.toString("base64")}`,
      {
        folder: "aaw_uploads",
      }
    );

    res.json({
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
