import { Router } from "express";
import { register, login, getCurrentUser, logout } from "../controllers/auth.controller.js";
import { authMiddleware } from "../middleware/auth.middleware.js";

const authRouter = Router();

// REGISTER
authRouter.post("/register", register);
authRouter.post("/login", login);

// GET CURRENT USER
authRouter.get("/me", authMiddleware, getCurrentUser);

// LOGOUT
authRouter.post("/logout", logout);

export default authRouter;
