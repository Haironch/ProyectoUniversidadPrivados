// backend/src/routes/authRoutes.js
import express from "express";
import { login, logout, verifySession } from "../controllers/authController.js";

const router = express.Router();

// POST /api/auth/login - Iniciar sesión
router.post("/login", login);

// POST /api/auth/logout - Cerrar sesión
router.post("/logout", logout);

// GET /api/auth/verify - Verificar sesión activa
router.get("/verify", verifySession);

export default router;
