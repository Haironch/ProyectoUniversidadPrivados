// backend/src/routes/index.js
import express from "express";
import busRoutes from "./busRoutes.js";
import lineaRoutes from "./lineaRoutes.js";
import municipalidadRoutes from "./municipalidadRoutes.js";
import estacionRoutes from "./estacionRoutes.js";
import lineaEstacionRoutes from "./lineaEstacionRoutes.js";
import parqueoRoutes from "./parqueoRoutes.js";
import pilotoRoutes from "./pilotoRoutes.js";
import accesoRoutes from "./accesoRoutes.js";
import guardiaRoutes from "./guardiaRoutes.js";
import operadorRoutes from "./operadorRoutes.js";
import distanciaRoutes from "./distanciaRoutes.js";
import alertaRoutes from "./alertaRoutes.js";
import authRoutes from "./authRoutes.js";

const router = express.Router();

// Rutas de autenticación
router.use("/auth", authRoutes);

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

// Rutas de linea-estacion
router.use("/linea-estacion", lineaEstacionRoutes);

// Rutas de parqueos
router.use("/parqueos", parqueoRoutes);

// Rutas de pilotos
router.use("/pilotos", pilotoRoutes);

// Rutas de accesos
router.use("/accesos", accesoRoutes);

// Rutas de guardias
router.use("/guardias", guardiaRoutes);

// Rutas de operadores
router.use("/operadores", operadorRoutes);

// Rutas de distancias
router.use("/distancias", distanciaRoutes);

// Rutas de alertas
router.use("/alertas", alertaRoutes);

export default router;
