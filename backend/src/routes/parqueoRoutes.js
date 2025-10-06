// backend/src/routes/parqueoRoutes.js
import express from "express";
import {
  getParqueos,
  getParqueoById,
  createParqueo,
  updateParqueo,
  deleteParqueo,
} from "../controllers/parqueoController.js";

const router = express.Router();

// GET /api/parqueos - Obtener todos los parqueos
router.get("/", getParqueos);

// GET /api/parqueos/:id - Obtener un parqueo por ID
router.get("/:id", getParqueoById);

// POST /api/parqueos - Crear nuevo parqueo
router.post("/", createParqueo);

// PUT /api/parqueos/:id - Actualizar parqueo
router.put("/:id", updateParqueo);

// DELETE /api/parqueos/:id - Eliminar parqueo
router.delete("/:id", deleteParqueo);

export default router;
