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

router.get("/", getAlertas);

router.get("/activas", getAlertasActivas);

router.get("/estadisticas", getEstadisticasAlertas);

router.get("/:id", getAlertaById);

router.post("/", createAlerta);

router.patch("/:id/atender", atenderAlerta);

router.patch("/:id/resolver", resolverAlerta);

router.patch("/:id/cancelar", cancelarAlerta);

export default router;
