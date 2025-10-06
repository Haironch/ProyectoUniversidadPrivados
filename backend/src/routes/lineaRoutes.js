// backend/src/routes/lineaRoutes.js
import express from "express";
import {
  getLineas,
  getLineaById,
  createLinea,
  updateLinea,
  deleteLinea,
  getAccesosByLinea,
} from "../controllers/lineaController.js";

const router = express.Router();

// GET /api/lineas - Obtener todas las lineas
router.get("/", getLineas);

// GET /api/lineas/:id/accesos - DEBE IR ANTES DE /:id
router.get("/:id/accesos", getAccesosByLinea);

// GET /api/lineas/:id - Obtener una linea por ID
router.get("/:id", getLineaById);

// POST /api/lineas - Crear nueva linea
router.post("/", createLinea);

// PUT /api/lineas/:id - Actualizar linea
router.put("/:id", updateLinea);

// DELETE /api/lineas/:id - Eliminar linea
router.delete("/:id", deleteLinea);

export default router;
