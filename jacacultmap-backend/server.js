import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectToDatabase } from "./services/database.js";
import { clientDetectionMiddleware } from "./utils/clientDetection.js";
import authRoutes from "./routes/authRoute.js";
import defaultRoutes from "./routes/defaultRoute.js";
import statusRoutes from "./routes/statusRoute.js";
import imageRoutes from "./routes/imageRoute.js";
import validateTokenRoutes from "./routes/validateTokenRoute.js";
import eventRoutes from './routes/eventRoute.js'
import userRoutes from './routes/userRoute.js'
import session from "express-session";


// TO DO: Improve connection db <-> vercel (https://www.mongodb.com/pt-br/docs/atlas/reference/partner-integrations/vercel/)

dotenv.config({ path: ".env" });

const app = express();
// Aumentando o limite para 50MB
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ limit: '50mb', extended: true }));

const allowedOrigins = [
  process.env.DEVELOPMENT_URL_FRONTEND,
  "https://jacacultmap-app.vercel.app"
]

app.use(cors({
  origin: function(origin, callback) {
    if (!origin) return callback(null, true);

    const isAllowed = allowedOrigins.some(allowed => {
      if (allowed instanceof RegExp) {
        return allowed.test(origin);
      }
      return allowed === origin;
    });

    if (isAllowed) {
      return callback(null, true);
    }

    console.log('Blocked origin:', origin); // Para debug
    return callback(new Error('Not allowed by CORS'));
  },
  credentials: true,
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

app.use(session({
  secret: process.env.EXPRESS_SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: { 
    secure: false, 
    httpOnly: true,
    maxAge: 1000 * 60 * 30, // 30 minutos
    sameSite: 'lax'
  }
}));

// ✅ Middleware de detecção de cliente (web vs app)
app.use(clientDetectionMiddleware);

app.use(authRoutes);
app.use(defaultRoutes);
app.use(statusRoutes);
app.use(imageRoutes);
app.use(validateTokenRoutes);
app.use(eventRoutes);
app.use(userRoutes);

connectToDatabase();

export default app;