// backend/src/routes/alertaRoutes.js
import express from "express";
import {
  getAlertas,
  getAlertasActivas,
  getAlertaById,
  createAlerta,
  atenderAlerta,
  resolverAlerta,
  cancelarAlerta,
  getEstadisticasAlertas,
} from "../controllers/alertaController.js";

const router = express.Router();

// GET /api/alertas - Obtener todas las alertas (con filtros opcionales)
router.get("/", getAlertas);

// GET /api/alertas/activas - Obtener alertas activas
router.get("/activas", getAlertasActivas);

// GET /api/alertas/estadisticas - Obtener estadísticas de alertas
router.get("/estadisticas", getEstadisticasAlertas);

// GET /api/alertas/:id - Obtener una alerta por ID
router.get("/:id", getAlertaById);

// POST /api/alertas - Crear nueva alerta
router.post("/", createAlerta);

// PUT /api/alertas/:id/atender - Marcar alerta como en atención
router.put("/:id/atender", atenderAlerta);

// PUT /api/alertas/:id/resolver - Resolver alerta
router.put("/:id/resolver", resolverAlerta);

// PUT /api/alertas/:id/cancelar - Cancelar alerta
router.put("/:id/cancelar", cancelarAlerta);

export default router;
