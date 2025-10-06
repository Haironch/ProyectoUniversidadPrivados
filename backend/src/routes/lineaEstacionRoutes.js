// backend/src/routes/lineaEstacionRoutes.js
import express from "express";
import {
  getEstacionesByLinea,
  asignarEstacion,
  actualizarOrdenEstacion,
  eliminarEstacionDeLinea,
} from "../controllers/lineaEstacionController.js";

const router = express.Router();

// GET /api/lineas/:id_linea/estaciones - Obtener estaciones de una línea
router.get("/:id_linea/estaciones", getEstacionesByLinea);

// POST /api/lineas/:id_linea/estaciones - Asignar estación a línea
router.post("/:id_linea/estaciones", asignarEstacion);

// PUT /api/linea-estacion/:id - Actualizar orden de estación
router.put("/:id", actualizarOrdenEstacion);

// DELETE /api/linea-estacion/:id - Eliminar estación de línea
router.delete("/:id", eliminarEstacionDeLinea);

export default router;
