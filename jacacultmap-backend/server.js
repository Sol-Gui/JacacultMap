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

app.get("/imgs/", (req, res) => {
  // Getter from mongoDB the image reference, the image data
  res.send("Upload endpoint");
});

app.post("/upload", (req, res) => {

  // Here you would handle the file upload
  res.send("Arquivo enviado com sucesso!");
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));