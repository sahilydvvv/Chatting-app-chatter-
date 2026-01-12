import dotenv from "dotenv";
dotenv.config();
import express from "express";
import {createServer} from "http";
import { Server } from "socket.io";
import { connectDB } from "./src/config/db.js";
import authRoute from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import conversationRoute from "./src/routes/conversation.route.js";
import messageRoute from "./src/routes/message.route.js";

const app = express();
const server = createServer(app);

const PORT  = process.env.PORT || 5000;

app.use(express.json());// for req.body
app.use(cookieParser());//for cookie parser so that req.cookies is available
app.use(cors())

app.use("/api/auth",authRoute);
app.use("/api/conversations",conversationRoute);
app.use("/api/messages",messageRoute);
const io = new Server(server, {});


const startServer = async () => {
  try {
    await connectDB();
    initSocketIO(io);
    server.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

startServer();