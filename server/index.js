import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware.js";

dotenv.config();
const port = process.env.PORT || 6262;

import connectDB from "./config/db.js";
import userRoutes from "./routes/userRoutes.js";
import uploadRoutes from "./routes/uploadRoutes.js";
import wordPairsRoutes from "./routes/wordPairCardRouter.js"
import contactRoutes from './routes/contactRouter.js'
// import { app, server } from "./socket/socket.js";

const app = express();


app.use(
  cors({
    origin: [process.env.CLIENT_ORIGIN],
    // origin: [process.env.HOST_ORIGIN, "http://192.168.178.23:5173"],
    // origin: ["http://192.168.178.23:5173"],
    credentials: true,
  })
);

app.use(express.json());
app.use(cookieParser());
app.use(express.static('public'))



app.use("/api/users", userRoutes);
app.use("/api/upload", uploadRoutes);
app.use("/api/word-pairs", wordPairsRoutes)
app.use("/api/contact", contactRoutes)

app.use(errorMiddleware);





// Обработка случаев, когда сервер возвращает HTML вместо JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && 'body' in err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next();
});

app.listen(port, () => {
  connectDB();
  console.log(`Server running on port: ${port}`);
});

