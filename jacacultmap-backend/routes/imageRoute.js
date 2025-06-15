import express from "express";
const router = express.Router();

router.get("/imgs/", (req, res) => {
  res.json({ message: "Upload endpoint" });
});

router.post("/upload", (req, res) => {
  res.json({ message: "Arquivo enviado com sucesso!" });
});

export default router;