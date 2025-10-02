// backend/src/controllers/busController.js
import { query } from "../config/database.js";

// Obtener todos los buses con sus pilotos asignados
export const getBusesConPilotos = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.numero_unidad,
        b.placa,
        l.nombre AS linea,
        CONCAT(p.nombre, ' ', p.apellido) AS piloto,
        pb.turno
      FROM bus b
      LEFT JOIN linea l ON b.id_linea = l.id_linea
      LEFT JOIN piloto_bus pb ON b.id_bus = pb.id_bus AND pb.estado = 'activo'
      LEFT JOIN piloto p ON pb.id_piloto = p.id_piloto
      ORDER BY b.numero_unidad
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener buses con pilotos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la informacion de buses",
      error: error.message,
    });
  }
};

export default {
  getBusesConPilotos,
};
