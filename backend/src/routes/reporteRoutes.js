import express from "express";
import { getReporteLineasCompleto } from "../controllers/reporteController.js";

const router = express.Router();

router.get("/lineas-completo", getReporteLineasCompleto);

export default router;
