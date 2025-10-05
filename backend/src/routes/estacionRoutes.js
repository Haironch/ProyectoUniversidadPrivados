// backend/src/routes/estacionRoutes.js
import express from "express";
import {
  getEstaciones,
  getEstacionById,
  createEstacion,
  updateEstacion,
  deleteEstacion,
} from "../controllers/estacionController.js";

const router = express.Router();

// GET /api/estaciones - Obtener todas las estaciones
router.get("/", getEstaciones);

// GET /api/estaciones/:id - Obtener una estacion por ID
router.get("/:id", getEstacionById);

// POST /api/estaciones - Crear nueva estacion
router.post("/", createEstacion);

// PUT /api/estaciones/:id - Actualizar estacion
router.put("/:id", updateEstacion);

// DELETE /api/estaciones/:id - Eliminar estacion
router.delete("/:id", deleteEstacion);

export default router;
