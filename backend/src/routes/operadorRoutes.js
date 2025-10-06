// backend/src/routes/operadorRoutes.js
import express from "express";
import {
  getOperadores,
  getOperadoresByEstacion,
  getOperadorById,
  createOperador,
  updateOperador,
  deleteOperador,
} from "../controllers/operadorController.js";

const router = express.Router();

// GET /api/operadores - Obtener todos los operadores
router.get("/", getOperadores);

// GET /api/operadores/estacion/:id_estacion - Obtener operadores de una estación
router.get("/estacion/:id_estacion", getOperadoresByEstacion);

// GET /api/operadores/:id - Obtener un operador por ID
router.get("/:id", getOperadorById);

// POST /api/operadores - Crear nuevo operador
router.post("/", createOperador);

// PUT /api/operadores/:id - Actualizar operador
router.put("/:id", updateOperador);

// DELETE /api/operadores/:id - Eliminar operador
router.delete("/:id", deleteOperador);

export default router;
