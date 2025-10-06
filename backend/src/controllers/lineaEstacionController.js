// backend/src/controllers/lineaEstacionController.js
import { query } from "../config/database.js";

// Obtener estaciones de una linea (ordenadas)
export const getEstacionesByLinea = async (req, res) => {
  try {
    const { id_linea } = req.params;

    const sql = `
      SELECT 
        le.*,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo,
        e.direccion as estacion_direccion
      FROM linea_estacion le
      INNER JOIN estacion e ON le.id_estacion = e.id_estacion
      WHERE le.id_linea = ?
      ORDER BY le.orden_secuencia
    `;

    const results = await query(sql, [id_linea]);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener estaciones de linea:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estaciones de linea",
      error: error.message,
    });
  }
};

// Asignar estacion a linea
export const asignarEstacion = async (req, res) => {
  try {
    const { id_linea } = req.params;
    const {
      id_estacion,
      orden_secuencia,
      distancia_estacion_anterior,
      tiempo_estimado_minutos,
      es_estacion_inicial,
      es_estacion_final,
    } = req.body;

    if (!id_estacion || !orden_secuencia) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
      });
    }

    // Verificar si la estacion ya esta asignada a esta linea
    const exists = await query(
      "SELECT * FROM linea_estacion WHERE id_linea = ? AND id_estacion = ?",
      [id_linea, id_estacion]
    );

    if (exists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Esta estacion ya esta asignada a esta linea",
      });
    }

    const sql = `
      INSERT INTO linea_estacion 
      (id_linea, id_estacion, orden_secuencia, distancia_estacion_anterior, 
       tiempo_estimado_minutos, es_estacion_inicial, es_estacion_final)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      id_linea,
      id_estacion,
      orden_secuencia,
      distancia_estacion_anterior || 0,
      tiempo_estimado_minutos || 5,
      es_estacion_inicial || false,
      es_estacion_final || false,
    ]);

    // Actualizar distancia total y numero de estaciones de la linea
    await actualizarInfoLinea(id_linea);

    res.status(201).json({
      success: true,
      message: "Estacion asignada exitosamente",
      data: {
        id_linea_estacion: result.insertId,
      },
    });
  } catch (error) {
    console.error("Error al asignar estacion:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar estacion",
      error: error.message,
    });
  }
};

// Eliminar estacion de linea
export const eliminarEstacionDeLinea = async (req, res) => {
  try {
    const { id_linea_estacion } = req.params;

    // Obtener id_linea antes de eliminar
    const lineaEst = await query(
      "SELECT id_linea FROM linea_estacion WHERE id_linea_estacion = ?",
      [id_linea_estacion]
    );

    if (lineaEst.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Relacion no encontrada",
      });
    }

    const id_linea = lineaEst[0].id_linea;

    const sql = "DELETE FROM linea_estacion WHERE id_linea_estacion = ?";
    await query(sql, [id_linea_estacion]);

    // Actualizar info de la linea
    await actualizarInfoLinea(id_linea);

    res.status(200).json({
      success: true,
      message: "Estacion eliminada de la linea exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar estacion de linea:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar estacion de linea",
      error: error.message,
    });
  }
};

// Actualizar orden de estacion
export const actualizarOrdenEstacion = async (req, res) => {
  try {
    const { id_linea_estacion } = req.params;
    const { orden_secuencia, distancia_estacion_anterior } = req.body;

    const sql = `
      UPDATE linea_estacion 
      SET orden_secuencia = ?, distancia_estacion_anterior = ?
      WHERE id_linea_estacion = ?
    `;

    await query(sql, [
      orden_secuencia,
      distancia_estacion_anterior || 0,
      id_linea_estacion,
    ]);

    // Obtener id_linea para actualizar
    const lineaEst = await query(
      "SELECT id_linea FROM linea_estacion WHERE id_linea_estacion = ?",
      [id_linea_estacion]
    );

    if (lineaEst.length > 0) {
      await actualizarInfoLinea(lineaEst[0].id_linea);
    }

    res.status(200).json({
      success: true,
      message: "Orden actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar orden:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar orden",
      error: error.message,
    });
  }
};

// Funcion auxiliar para actualizar info de linea
const actualizarInfoLinea = async (id_linea) => {
  // Contar estaciones
  const count = await query(
    "SELECT COUNT(*) as total FROM linea_estacion WHERE id_linea = ?",
    [id_linea]
  );

  // Calcular distancia total
  const distance = await query(
    "SELECT SUM(distancia_estacion_anterior) as total FROM linea_estacion WHERE id_linea = ?",
    [id_linea]
  );

  const numEstaciones = count[0].total;
  const distanciaTotal = distance[0].total || 0;

  await query(
    `UPDATE linea 
     SET numero_estaciones = ?, 
         distancia_total = ?,
         min_buses_requeridos = ?,
         max_buses_permitidos = ?
     WHERE id_linea = ?`,
    [numEstaciones, distanciaTotal, numEstaciones, numEstaciones * 2, id_linea]
  );
};

export default {
  getEstacionesByLinea,
  asignarEstacion,
  eliminarEstacionDeLinea,
  actualizarOrdenEstacion,
};
