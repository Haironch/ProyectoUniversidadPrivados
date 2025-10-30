// backend/src/routes/busRoutes.js
import express from "express";
import {
  getBusesConPilotos,
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  desactivarBus,
  asignarBusALinea,
  cambiarParqueoBus,
  getBusesByLinea,
} from "../controllers/busController.js";

const router = express.Router();

router.get("/pilotos", getBusesConPilotos);

router.get("/linea/:id_linea", getBusesByLinea);

router.get("/", getBuses);

router.get("/:id", getBusById);

router.post("/", createBus);

router.put("/:id", updateBus);

router.put("/:id/asignar-linea", asignarBusALinea);

router.put("/:id/cambiar-parqueo", cambiarParqueoBus);

router.delete("/:id", deleteBus);

router.patch("/:id/desactivar", desactivarBus);

export default router;
