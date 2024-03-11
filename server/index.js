
import { fileURLToPath } from 'url';
import path, { dirname } from 'path';
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const __filename = fileURLToPath(import.meta.url);

const __dirname = dirname(__filename);

dotenv.config();
const port = process.env.PORT || 2626;

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import wordPairsRoutes from "./routes/wordPairCardRouter.js"

const app = express();
connectDB();
app.use(errorMiddleware);

const allowedOrigins = [process.env.CLIENT_ORIGIN];
// const allowedOrigins = [process.env.HOST_ORIGIN];

const corsOptions = {
  origin: (origin, callback) => {
    if (allowedOrigins.indexOf(origin) !== -1 || !origin) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  credentials: true,
  optionsSuccessStatus: 200,
};

app.use(cors(corsOptions));
app.use(express.json());
app.use(cookieParser());
// app.use(express.static('public'))
app.use(express.static(path.join(__dirname, 'public')));


app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/word-pairs", wordPairsRoutes)


app.listen(port, () => {
  console.log(`Server running on port: ${port}`);
});
