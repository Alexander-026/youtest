import express from "express";
import dotenv from "dotenv";
dotenv.config();
import { app, server } from "./socket/socket.js";
import cookieParser from "cookie-parser";
import errorMiddleware from "./middlewares/errorMiddleware.js";

const port = process.env.PORT || 6262;
import connectDB from "./config/db.js";
import userRoutes from "./routes/user.routes.js";
import uploadRoutes from "./routes/upload.routes.js";
import wordPairsRoutes from "./routes/wordPairCard.routes.js";
import contactRoutes from "./routes/contact.routes.js";
import messageRoutes from "./routes/message.routes.js"


app.use(express.json());
app.use(cookieParser());
app.use(express.static("public"));

app.use("/api/users", userRoutes);
app.use("/api/messages", messageRoutes)
app.use("/api/upload", uploadRoutes);
app.use("/api/word-pairs", wordPairsRoutes);
app.use("/api/contact", contactRoutes);

app.use(errorMiddleware);

// Обработка случаев, когда сервер возвращает HTML вместо JSON
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({ error: "Invalid JSON" });
  }
  next();
});

server.listen(port, async () => {
  await connectDB();
  console.log(`Server running on port: ${port}`);
});
