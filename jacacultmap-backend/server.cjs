const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectToDatabase } = require("./services/database.js");
const authRoutes = require("./routes/authRoute.js").default;
const defaultRoutes = require("./routes/defaultRoute.js").default;
const statusRoutes = require("./routes/statusRoute.js").default;
const imageRoutes = require("./routes/imageRoute.js").default;


dotenv.config({ path: ".env" });

const app = express();

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(express.json());
app.use(authRoutes);
app.use(defaultRoutes);
app.use(statusRoutes);
app.use(imageRoutes);

connectToDatabase(process.env.DATABASE_URL_CLUSTER_0, process.env.DB_NAME)
  .then(() => {
    console.log("Conectado ao banco de dados");
  })
  .catch(err => {
    console.error("Erro ao conectar ao banco de dados:", err.message);
  });

module.exports = app;