import { query } from "../config/database.js";

export const getReporteLineasCompleto = async (req, res) => {
  try {
    const lineas = await query(`
      SELECT * FROM linea ORDER BY codigo
    `);

    for (let linea of lineas) {
      linea.estaciones = await query(
        `
        SELECT 
          e.*,
          le.orden_secuencia,
          le.distancia_estacion_anterior
        FROM estacion e
        INNER JOIN linea_estacion le ON e.id_estacion = le.id_estacion
        WHERE le.id_linea = ?
        ORDER BY le.orden_secuencia
      `,
        [linea.id_linea]
      );

      linea.buses = await query(
        `
        SELECT * FROM bus
        WHERE id_linea = ?
        ORDER BY numero_unidad
      `,
        [linea.id_linea]
      );
    }

    res.status(200).json({
      success: true,
      data: lineas,
    });
  } catch (error) {
    console.error("Error al obtener reporte:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener reporte",
      error: error.message,
    });
  }
};

export default {
  getReporteLineasCompleto,
};
