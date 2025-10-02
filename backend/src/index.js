// backend/src/index.js
import express from "express";
import cors from "cors";
import { config, validateEnv } from "./config/environment.js";
import { testConnection } from "./config/database.js";
import routes from "./routes/index.js";

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

// Ruta raiz
app.get("/", (req, res) => {
  res.json({
    message: "API Sistema Transmetro",
    version: "1.0.0",
    endpoints: {
      health: "/api/health",
      buses: "/api/buses/pilotos",
    },
  });
});

// Manejo de rutas no encontradas
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Ruta no encontrada",
  });
});

// Manejo de errores
app.use((err, req, res, next) => {
  console.error("Error:", err);
  res.status(500).json({
    success: false,
    message: "Error interno del servidor",
    error: config.server.env === "development" ? err.message : undefined,
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
