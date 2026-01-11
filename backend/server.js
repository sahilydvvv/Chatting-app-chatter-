import dotenv from "dotenv";
dotenv.config();
import express from "express";
import { connectDB } from "./src/config/db.js";
import authRoute from "./src/routes/auth.route.js";
import cookieParser from "cookie-parser";

const app = express();

const PORT  = process.env.PORT || 5000;

app.use(express.json());// for req.body
app.use(cookieParser());//for cookie parser so that req.cookies is available

app.use("/api/auth",authRoute);

const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error("Server failed to start", error);
    process.exit(1);
  }
};

startServer();