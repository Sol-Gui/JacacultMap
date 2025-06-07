const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const { connectToDatabase } = require("./services/database.js");
const authRoutes = require("./routes/authRoute.js");
const defaultRoutes = require("./routes/defaultRoute.js");
const statusRoutes = require("./routes/statusRoute.js");
const imageRoutes = require("./routes/imageRoute.js");


dotenv.config({ path: ".env" });

const app = express();

app.use(cors());
app.use(express.json());
app.use(authRoutes);
app.use(defaultRoutes);
app.use(statusRoutes);
app.use(imageRoutes);


connectToDatabase(process.env.DATABASE_URL_CLUSTER_0, process.env.DB_NAME)
  .then(() => 
    app.listen(3000, () => {
      console.log("Servidor aberto na porta 3000");
    })
  ).catch(err => {
    console.error("Erro ao conectar ao banco de dados:", err.message);
    process.exit(1);
  });