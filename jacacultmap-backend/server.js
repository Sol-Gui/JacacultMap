const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config({ path: ".env" });
const { connectToDatabase, createUser } = require("./services/database.js");

connectToDatabase(process.env.DATABASE_URL_CLUSTER_0, process.env.DB_NAME).catch(err => console.log("Erro ao conectar ao banco de dados:", err));
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

app.post("/login", (req, res) => {
  createUser(req.body["email"], req.body["password"])
    .then(() => res.send("Usuário criado com sucesso!"))
    .catch(err => res.status(500).send("Erro ao criar usuário: " + err.message));
});

app.post("/upload", (req, res) => {

  // Here you would handle the file upload
  res.send("Arquivo enviado com sucesso!");
});

app.listen(3000, () => console.log("Servidor rodando na porta 3000"));