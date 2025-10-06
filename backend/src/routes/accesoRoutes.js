// backend/src/routes/accesoRoutes.js
import express from "express";
import {
  getAccesos,
  getAccesosByEstacion,
  getAccesoById,
  createAcceso,
  updateAcceso,
  deleteAcceso,
} from "../controllers/accesoController.js";

const router = express.Router();

// GET /api/accesos - Obtener todos los accesos
router.get("/", getAccesos);

// GET /api/accesos/estacion/:id_estacion - Obtener accesos de una estación
router.get("/estacion/:id_estacion", getAccesosByEstacion);

// GET /api/accesos/:id - Obtener un acceso por ID
router.get("/:id", getAccesoById);

// POST /api/accesos - Crear nuevo acceso
router.post("/", createAcceso);

// PUT /api/accesos/:id - Actualizar acceso
router.put("/:id", updateAcceso);

// DELETE /api/accesos/:id - Eliminar acceso
router.delete("/:id", deleteAcceso);

export default router;
