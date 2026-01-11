import express from "express";
const router = express.Router();
import { login, logout, signup, updateProfile,deleteProfile,authenticate } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middlewares/auth.middleware.js";

router.post('/signup',signup);

router.post('/login',login);

router.post('/logout',authMiddleware,logout);

router.patch('/updateProfile',authMiddleware,updateProfile);

router.delete('/deleteProfile',authMiddleware,deleteProfile);

router.get('/me',authMiddleware,authenticate)

export default router;
