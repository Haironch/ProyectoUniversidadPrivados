// backend/src/routes/busRoutes.js
import express from "express";
import { getBusesConPilotos } from "../controllers/busController.js";

const router = express.Router();

// GET /api/buses/pilotos - Obtener todos los buses con sus pilotos
router.get("/pilotos", getBusesConPilotos);

export default router;
