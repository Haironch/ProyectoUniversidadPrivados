// backend/src/routes/municipalidadRoutes.js
import express from "express";
import { getMunicipalidades } from "../controllers/municipalidadController.js";

const router = express.Router();

// GET /api/municipalidades - Obtener todas las municipalidades
router.get("/", getMunicipalidades);

export default router;
