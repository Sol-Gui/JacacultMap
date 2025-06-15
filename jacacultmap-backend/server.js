import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./services/database.js";
import authRoutes from "./routes/authRoute.js";
import defaultRoutes from "./routes/defaultRoute.js";
import statusRoutes from "./routes/statusRoute.js";
import imageRoutes from "./routes/imageRoute.js";
import validateTokenRoute from "./routes/validateTokenRoute.js";


// TO DO: Improve connection db <-> vercel (https://www.mongodb.com/pt-br/docs/atlas/reference/partner-integrations/vercel/)



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
app.use(validateTokenRoute);

connectToDatabase();

export default app;