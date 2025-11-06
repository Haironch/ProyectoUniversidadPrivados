// backend/src/index.js
import express from "express";
import cors from "cors";
import { config, validateEnv } from "./config/environment.js";
import { testConnection } from "./config/database.js";
import routes from "./routes/index.js";
import reporteRoutes from "./routes/reporteRoutes.js";

// Validar variables de entorno
validateEnv();

// Crear aplicacion Express
const app = express();

// Middlewares
app.use(
  cors({
    origin: config.cors.origin,
    credentials: true,
  })
);
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Rutas
app.use("/api", routes);
app.use("/api/reportes", reporteRoutes);

// Ruta raiz
app.get("/", (req, res) => {
  res.json({
    message: "API Sistema Transmetro",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      buses: "/api/buses/pilotos",
      reportes: "/api/reportes/lineas-completo",
    },
  });
});

// Manejo de rutas no encontradas (DEBE IR AL FINAL)
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("Error:", err);
  const statusCode = err.statusCode || 500;
  const message = err.message || "Error interno del servidor";
  res.status(statusCode).json({
    success: false,
    message: message,
    ...(config.server.env === "development" && { stack: err.stack }),
  });
});

// Iniciar servidor
const PORT = config.server.port;

const startServer = async () => {
  try {
    // Probar conexion a la base de datos
    const dbConnected = await testConnection();
    if (!dbConnected) {
      console.error("No se pudo conectar a la base de datos");
      process.exit(1);
    }

    // Iniciar servidor
    app.listen(PORT, () => {
      console.log(`Servidor corriendo en puerto ${PORT}`);
      console.log(`Entorno: ${config.server.env}`);
      console.log(`URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Error al iniciar el servidor:", error);
    process.exit(1);
  }
};

startServer();
