// backend/src/routes/pilotoRoutes.js
import express from "express";
import {
  getPilotos,
  getPilotoById,
  createPiloto,
  updatePiloto,
  deletePiloto,
  agregarHistorialEducativo,
  eliminarHistorialEducativo,
} from "../controllers/pilotoController.js";

const router = express.Router();

// GET /api/pilotos - Obtener todos los pilotos
router.get("/", getPilotos);

// GET /api/pilotos/:id - Obtener un piloto por ID
router.get("/:id", getPilotoById);

// POST /api/pilotos - Crear nuevo piloto
router.post("/", createPiloto);

// PUT /api/pilotos/:id - Actualizar piloto
router.put("/:id", updatePiloto);

// DELETE /api/pilotos/:id - Eliminar piloto
router.delete("/:id", deletePiloto);

// POST /api/pilotos/:id/historial - Agregar registro educativo
router.post("/:id/historial", agregarHistorialEducativo);

// DELETE /api/pilotos/historial/:id_historial - Eliminar registro educativo
router.delete("/historial/:id_historial", eliminarHistorialEducativo);

export default router;
