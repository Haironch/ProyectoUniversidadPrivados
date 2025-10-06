// backend/src/controllers/parqueoController.js
import { query } from "../config/database.js";

// Obtener todos los parqueos
export const getParqueos = async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.*,
        COUNT(b.id_bus) as buses_asignados
      FROM parqueo p
      LEFT JOIN bus b ON p.id_parqueo = b.id_parqueo
      GROUP BY p.id_parqueo
      ORDER BY p.nombre
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener parqueos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener parqueos",
      error: error.message,
    });
  }
};

// Obtener un parqueo por ID
export const getParqueoById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        p.*,
        COUNT(b.id_bus) as buses_asignados
      FROM parqueo p
      LEFT JOIN bus b ON p.id_parqueo = b.id_parqueo
      WHERE p.id_parqueo = ?
      GROUP BY p.id_parqueo
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Parqueo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener parqueo:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener parqueo",
      error: error.message,
    });
  }
};

// Crear nuevo parqueo
export const createParqueo = async (req, res) => {
  try {
    const { nombre, direccion, capacidad_total, latitud, longitud, estado } =
      req.body;

    if (!nombre || !direccion || !capacidad_total) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: nombre, direccion, capacidad_total",
      });
    }

    const sql = `
      INSERT INTO parqueo 
      (nombre, direccion, capacidad_total, latitud, longitud, estado)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      nombre,
      direccion,
      capacidad_total,
      latitud || null,
      longitud || null,
      estado || "activo",
    ]);

    res.status(201).json({
      success: true,
      message: "Parqueo creado exitosamente",
      data: { id_parqueo: result.insertId },
    });
  } catch (error) {
    console.error("Error al crear parqueo:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear parqueo",
      error: error.message,
    });
  }
};

// Actualizar parqueo
export const updateParqueo = async (req, res) => {
  try {
    const { id } = req.params;
    const { nombre, direccion, capacidad_total, latitud, longitud, estado } =
      req.body;

    const sql = `
      UPDATE parqueo 
      SET nombre = COALESCE(?, nombre),
          direccion = COALESCE(?, direccion),
          capacidad_total = COALESCE(?, capacidad_total),
          latitud = COALESCE(?, latitud),
          longitud = COALESCE(?, longitud),
          estado = COALESCE(?, estado)
      WHERE id_parqueo = ?
    `;

    const result = await query(sql, [
      nombre,
      direccion,
      capacidad_total,
      latitud,
      longitud,
      estado,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Parqueo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parqueo actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar parqueo:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar parqueo",
      error: error.message,
    });
  }
};

// Eliminar parqueo
export const deleteParqueo = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si hay buses asignados
    const busesAsignados = await query(
      "SELECT COUNT(*) as total FROM bus WHERE id_parqueo = ?",
      [id]
    );

    if (busesAsignados[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el parqueo porque tiene ${busesAsignados[0].total} bus(es) asignado(s)`,
      });
    }

    const sql = "DELETE FROM parqueo WHERE id_parqueo = ?";
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Parqueo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Parqueo eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar parqueo:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar parqueo",
      error: error.message,
    });
  }
};

export default {
  getParqueos,
  getParqueoById,
  createParqueo,
  updateParqueo,
  deleteParqueo,
};
