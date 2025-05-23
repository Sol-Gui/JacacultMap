const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Lepo 1!");
});

app.get("/test", (req, res) => {
  res.send("Lepo 2!");
  console.log("teste");
});

app.get("/status", (req, res) => {
  res.json({ status: "ok" });
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));