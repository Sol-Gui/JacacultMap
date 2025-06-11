import express from 'express';
const router = express.Router();

router.get('/', (req, res) => {
  res.json({ message: 'Welcome to the default route!' });
});

router.get("/", (req, res) => {
  res.json({ message: "Lepo 1!" });
});

router.get("/test", (req, res) => {
  res.json({ message: "Lepo 2!" });
  console.log("teste");
});

export default router;