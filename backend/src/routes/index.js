// backend/src/routes/index.js
import express from "express";
import busRoutes from "./busRoutes.js";
import lineaRoutes from "./lineaRoutes.js";
import municipalidadRoutes from "./municipalidadRoutes.js";
import estacionRoutes from "./estacionRoutes.js";

const router = express.Router();

// Ruta de prueba
router.get("/health", (req, res) => {
  res.status(200).json({
    success: true,
    message: "API Transmetro funcionando correctamente",
    timestamp: new Date().toISOString(),
  });
});

// Rutas de buses
router.use("/buses", busRoutes);

// Rutas de lineas
router.use("/lineas", lineaRoutes);

// Rutas de municipalidades
router.use("/municipalidades", municipalidadRoutes);

// Rutas de estaciones
router.use("/estaciones", estacionRoutes);

export default router;
