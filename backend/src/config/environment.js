// backend/src/config/environment.js
import dotenv from "dotenv";

dotenv.config();

export const config = {
  // Base de datos
  database: {
    host: process.env.DB_HOST || "localhost",
    user: process.env.DB_USER || "root",
    password: process.env.DB_PASSWORD || "",
    name: process.env.DB_NAME || "transmetro_db",
    port: parseInt(process.env.DB_PORT) || 3306,
  },

  // Servidor
  server: {
    port: parseInt(process.env.PORT) || 3000,
    env: process.env.NODE_ENV || "development",
  },

  // CORS
  cors: {
    origin: true,
  },
};

// Validar variables requeridas
const requiredEnvVars = ["DB_HOST", "DB_USER", "DB_PASSWORD", "DB_NAME"];

export const validateEnv = () => {
  const missing = requiredEnvVars.filter((varName) => !process.env[varName]);

  if (missing.length > 0) {
    console.error(
      "Faltan las siguientes variables de entorno:",
      missing.join(", ")
    );
    process.exit(1);
  }

  console.log("Variables de entorno validadas correctamente");
};

export default config;
