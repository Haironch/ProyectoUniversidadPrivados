// backend/src/config/database.js
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

// Configuracion del pool de conexiones
const pool = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT || 3306,
  waitForConnections: true,
  connectionLimit: 10,
  queueLimit: 0,
  enableKeepAlive: true,
  keepAliveInitialDelay: 0,
});

// Funcion para probar la conexion
export const testConnection = async () => {
  try {
    const connection = await pool.getConnection();
    console.log("Conexion a la base de datos exitosa");
    connection.release();
    return true;
  } catch (error) {
    console.error("Error de conexion a la base de datos:", error.message);
    return false;
  }
};

// Funcion helper para ejecutar queries
export const query = async (sql, params = []) => {
  try {
    const [results] = await pool.execute(sql, params);
    return results;
  } catch (error) {
    console.error("Error ejecutando query:", error.message);
    throw error;
  }
};

export default pool;
