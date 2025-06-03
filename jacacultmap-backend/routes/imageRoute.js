const express = require("express");
const router = express.Router();


router.get("/imgs/", (req, res) => {
  // Getter from mongoDB the image reference, the image data
  res.json({ message: "Upload endpoint" });
});

router.post("/upload", (req, res) => {

  // Here you would handle the file upload
  res.json({ message: "Arquivo enviado com sucesso!" });
});

module.exports = router;