// backend/src/controllers/lineaController.js
import { query } from "../config/database.js";

// Obtener todas las lineas
export const getLineas = async (req, res) => {
  try {
    const sql = `
      SELECT 
        l.*,
        m.nombre as municipalidad_nombre,
        COUNT(DISTINCT le.id_estacion) as total_estaciones,
        COUNT(DISTINCT b.id_bus) as total_buses
      FROM linea l
      LEFT JOIN municipalidad m ON l.id_municipalidad = m.id_municipalidad
      LEFT JOIN linea_estacion le ON l.id_linea = le.id_linea
      LEFT JOIN bus b ON l.id_linea = b.id_linea
      GROUP BY l.id_linea
      ORDER BY l.codigo
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener lineas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener lineas",
      error: error.message,
    });
  }
};

// Obtener una linea por ID
export const getLineaById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        l.*,
        m.nombre as municipalidad_nombre
      FROM linea l
      LEFT JOIN municipalidad m ON l.id_municipalidad = m.id_municipalidad
      WHERE l.id_linea = ?
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(200).json({
        // ✅ 200 OK, solo sin datos
        success: true,
        linea: {
          id_linea: id,
          nombre: "Línea sin datos",
          codigo: "",
        },
        total_accesos: 0,
        total_estaciones: 0,
        data: [],
        message: "Esta línea no tiene accesos registrados",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener linea:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener linea",
      error: error.message,
    });
  }
};

// Crear nueva linea
export const createLinea = async (req, res) => {
  try {
    const { id_municipalidad, nombre, codigo, color, estado } = req.body;

    if (!id_municipalidad || !nombre || !codigo) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
      });
    }

    const sql = `
      INSERT INTO linea (id_municipalidad, nombre, codigo, color, estado)
      VALUES (?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      id_municipalidad,
      nombre,
      codigo,
      color || "Gris",
      estado || "activa",
    ]);

    res.status(201).json({
      success: true,
      message: "Linea creada exitosamente",
      data: {
        id_linea: result.insertId,
        ...req.body,
      },
    });
  } catch (error) {
    console.error("Error al crear linea:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear linea",
      error: error.message,
    });
  }
};

// Actualizar linea
export const updateLinea = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_municipalidad, nombre, codigo, color, estado } = req.body;

    const sql = `
      UPDATE linea 
      SET id_municipalidad = ?, nombre = ?, codigo = ?, color = ?, estado = ?
      WHERE id_linea = ?
    `;

    const result = await query(sql, [
      id_municipalidad,
      nombre,
      codigo,
      color,
      estado,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Linea no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Linea actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar linea:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar linea",
      error: error.message,
    });
  }
};

// Eliminar linea
// Eliminar linea
export const deleteLinea = async (req, res) => {
  try {
    const { id } = req.params;

    const buses = await query(
      "SELECT COUNT(*) as count FROM bus WHERE id_linea = ?",
      [id]
    );

    if (buses[0].count > 0) {
      return res.status(400).json({
        success: false,
        message: "Esta linea esta asignada a un bus y no puede ser eliminada.",
      });
    }

    const estaciones = await query(
      "SELECT COUNT(*) as count FROM linea_estacion WHERE id_linea = ?",
      [id]
    );

    if (estaciones[0].count > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Esta linea tiene estaciones asignadas y no puede ser eliminada.",
      });
    }

    const sql = `DELETE FROM linea WHERE id_linea = ?`;
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Linea no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Linea eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar linea:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar linea",
      error: error.message,
    });
  }
};

// Obtener todos los accesos de una línea (Punto 8)
export const getAccesosByLinea = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
  SELECT 
    l.id_linea,
    l.nombre as linea_nombre,
    l.codigo as linea_codigo,
    e.id_estacion,
    e.nombre as estacion_nombre,
    e.codigo as estacion_codigo,
    le.orden_secuencia,
    a.id_acceso,
    a.nombre as acceso_nombre,
    a.tipo as acceso_tipo,
    a.esta_activo,
    a.hora_apertura,
    a.hora_cierre,
    COUNT(g.id_guardia) as guardias_asignados
  FROM linea l
  INNER JOIN linea_estacion le ON l.id_linea = le.id_linea
  INNER JOIN estacion e ON le.id_estacion = e.id_estacion
  INNER JOIN acceso a ON e.id_estacion = a.id_estacion
  LEFT JOIN guardia g ON a.id_acceso = g.id_acceso
  WHERE l.id_linea = ?
  GROUP BY l.id_linea, l.nombre, l.codigo, e.id_estacion, e.nombre, 
           e.codigo, le.orden_secuencia, a.id_acceso, a.nombre, 
           a.tipo, a.esta_activo, a.hora_apertura, a.hora_cierre
  ORDER BY le.orden_secuencia, a.tipo, a.nombre
`;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron accesos para esta línea",
      });
    }

    // Agrupar por estación
    const accesosPorEstacion = {};
    results.forEach((acceso) => {
      if (!accesosPorEstacion[acceso.id_estacion]) {
        accesosPorEstacion[acceso.id_estacion] = {
          id_estacion: acceso.id_estacion,
          estacion_nombre: acceso.estacion_nombre,
          estacion_codigo: acceso.estacion_codigo,
          orden_secuencia: acceso.orden_secuencia,
          accesos: [],
        };
      }
      accesosPorEstacion[acceso.id_estacion].accesos.push({
        id_acceso: acceso.id_acceso,
        nombre: acceso.acceso_nombre,
        tipo: acceso.acceso_tipo,
        esta_activo: acceso.esta_activo,
        hora_apertura: acceso.hora_apertura,
        hora_cierre: acceso.hora_cierre,
        guardias_asignados: acceso.guardias_asignados,
      });
    });

    res.status(200).json({
      success: true,
      linea: {
        id_linea: results[0].id_linea,
        nombre: results[0].linea_nombre,
        codigo: results[0].linea_codigo,
      },
      total_accesos: results.length,
      total_estaciones: Object.keys(accesosPorEstacion).length,
      data: Object.values(accesosPorEstacion),
    });
  } catch (error) {
    console.error("Error al obtener accesos de línea:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener accesos de línea",
      error: error.message,
    });
  }
};

export default {
  getLineas,
  getLineaById,
  createLinea,
  updateLinea,
  deleteLinea,
  getAccesosByLinea,
};
