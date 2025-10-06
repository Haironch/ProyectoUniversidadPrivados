// backend/src/routes/busRoutes.js
import express from "express";
import {
  getBusesConPilotos,
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  asignarBusALinea,
  cambiarParqueoBus,
  getBusesByLinea,
} from "../controllers/busController.js";

const router = express.Router();

// GET /api/buses/pilotos - Obtener todos los buses con sus pilotos
router.get("/pilotos", getBusesConPilotos);

// GET /api/buses/linea/:id_linea - Obtener buses de una línea específica
router.get("/linea/:id_linea", getBusesByLinea);

// GET /api/buses - Obtener todos los buses
router.get("/", getBuses);

// GET /api/buses/:id - Obtener un bus por ID
router.get("/:id", getBusById);

// POST /api/buses - Crear nuevo bus
router.post("/", createBus);

// PUT /api/buses/:id - Actualizar bus
router.put("/:id", updateBus);

// PUT /api/buses/:id/asignar-linea - Asignar bus a línea
router.put("/:id/asignar-linea", asignarBusALinea);

// PUT /api/buses/:id/cambiar-parqueo - Cambiar parqueo del bus
router.put("/:id/cambiar-parqueo", cambiarParqueoBus);

// DELETE /api/buses/:id - Eliminar bus
router.delete("/:id", deleteBus);

export default router;
