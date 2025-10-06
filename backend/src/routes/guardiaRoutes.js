// backend/src/routes/guardiaRoutes.js
import express from "express";
import {
  getGuardias,
  getGuardiasByAcceso,
  getGuardiaById,
  createGuardia,
  updateGuardia,
  deleteGuardia,
} from "../controllers/guardiaController.js";

const router = express.Router();

// GET /api/guardias - Obtener todos los guardias
router.get("/", getGuardias);

// GET /api/guardias/acceso/:id_acceso - Obtener guardias de un acceso
router.get("/acceso/:id_acceso", getGuardiasByAcceso);

// GET /api/guardias/:id - Obtener un guardia por ID
router.get("/:id", getGuardiaById);

// POST /api/guardias - Crear nuevo guardia
router.post("/", createGuardia);

// PUT /api/guardias/:id - Actualizar guardia
router.put("/:id", updateGuardia);

// DELETE /api/guardias/:id - Eliminar guardia
router.delete("/:id", deleteGuardia);

export default router;
