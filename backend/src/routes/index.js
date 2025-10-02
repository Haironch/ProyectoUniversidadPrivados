// backend/src/routes/index.js
import express from "express";
import busRoutes from "./busRoutes.js";

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

export default router;
