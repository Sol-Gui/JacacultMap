import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./services/database.js";
import authRoutes from "./routes/authRoute.js";
import defaultRoutes from "./routes/defaultRoute.js";
import statusRoutes from "./routes/statusRoute.js";
import imageRoutes from "./routes/imageRoute.js";
import validateTokenRoute from "./routes/validateTokenRoute.js";
import session from "express-session";


// TO DO: Improve connection db <-> vercel (https://www.mongodb.com/pt-br/docs/atlas/reference/partner-integrations/vercel/)

dotenv.config({ path: ".env" });

const app = express();
app.use(express.json());

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { secure: false }
}));

app.use(cors({
  origin: "*",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
})); // Permite todas as origens (APENAS PARA DESENVOLVIMENTO)

app.use(authRoutes);
app.use(defaultRoutes);
app.use(statusRoutes);
app.use(imageRoutes);
app.use(validateTokenRoute);

connectToDatabase();

//export default app;

app.listen(3000, () => {
  console.log('Rodando em http://localhost:3000');
});