// backend/src/routes/distanciaRoutes.js
import express from "express";
import {
  getDistanciaLinea,
  getDistanciasEstacionesLinea,
  getDistanciaEntreEstaciones,
  getMatrizDistancias,
} from "../controllers/distanciaController.js";

const router = express.Router();

// GET /api/distancias/linea/:id_linea - Distancia total de una línea
router.get("/linea/:id_linea", getDistanciaLinea);

// GET /api/distancias/linea/:id_linea/estaciones - Distancias entre estaciones de una línea
router.get("/linea/:id_linea/estaciones", getDistanciasEstacionesLinea);

// GET /api/distancias/linea/:id_linea/matriz - Matriz de todas las distancias
router.get("/linea/:id_linea/matriz", getMatrizDistancias);

// GET /api/distancias/linea/:id_linea/entre/:id_estacion_origen/:id_estacion_destino - Distancia entre 2 estaciones
router.get(
  "/linea/:id_linea/entre/:id_estacion_origen/:id_estacion_destino",
  getDistanciaEntreEstaciones
);

export default router;
