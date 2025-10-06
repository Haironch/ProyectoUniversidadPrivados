// backend/src/controllers/accesoController.js
import { query } from "../config/database.js";

// Obtener todos los accesos
export const getAccesos = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.*,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo,
        COUNT(g.id_guardia) as guardias_asignados
      FROM acceso a
      INNER JOIN estacion e ON a.id_estacion = e.id_estacion
      LEFT JOIN guardia g ON a.id_acceso = g.id_acceso
      GROUP BY a.id_acceso
      ORDER BY e.nombre, a.nombre
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener accesos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener accesos",
      error: error.message,
    });
  }
};

// Obtener accesos de una estación
export const getAccesosByEstacion = async (req, res) => {
  try {
    const { id_estacion } = req.params;

    const sql = `
      SELECT 
        a.*,
        COUNT(g.id_guardia) as guardias_asignados
      FROM acceso a
      LEFT JOIN guardia g ON a.id_acceso = g.id_acceso
      WHERE a.id_estacion = ?
      GROUP BY a.id_acceso
      ORDER BY a.tipo, a.nombre
    `;

    const results = await query(sql, [id_estacion]);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener accesos de la estación:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener accesos de la estación",
      error: error.message,
    });
  }
};

// Obtener un acceso por ID
export const getAccesoById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        a.*,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo,
        COUNT(g.id_guardia) as guardias_asignados
      FROM acceso a
      INNER JOIN estacion e ON a.id_estacion = e.id_estacion
      LEFT JOIN guardia g ON a.id_acceso = g.id_acceso
      WHERE a.id_acceso = ?
      GROUP BY a.id_acceso
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Acceso no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener acceso:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener acceso",
      error: error.message,
    });
  }
};

// Crear nuevo acceso
export const createAcceso = async (req, res) => {
  try {
    const {
      id_estacion,
      nombre,
      tipo,
      esta_activo,
      hora_apertura,
      hora_cierre,
    } = req.body;

    // Validaciones obligatorias
    if (!id_estacion || !nombre) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: id_estacion, nombre",
      });
    }

    // Verificar que la estación existe
    const estacionExists = await query(
      "SELECT id_estacion FROM estacion WHERE id_estacion = ?",
      [id_estacion]
    );

    if (estacionExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La estación especificada no existe",
      });
    }

    const sql = `
      INSERT INTO acceso 
      (id_estacion, nombre, tipo, esta_activo, hora_apertura, hora_cierre)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      id_estacion,
      nombre,
      tipo || "principal",
      esta_activo !== undefined ? esta_activo : true,
      hora_apertura || "05:00:00",
      hora_cierre || "22:00:00",
    ]);

    res.status(201).json({
      success: true,
      message: "Acceso creado exitosamente",
      data: { id_acceso: result.insertId },
    });
  } catch (error) {
    console.error("Error al crear acceso:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear acceso",
      error: error.message,
    });
  }
};

// Actualizar acceso
export const updateAcceso = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_estacion,
      nombre,
      tipo,
      esta_activo,
      hora_apertura,
      hora_cierre,
    } = req.body;

    // Verificar que el acceso existe
    const accesoExists = await query(
      "SELECT id_acceso FROM acceso WHERE id_acceso = ?",
      [id]
    );

    if (accesoExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Acceso no encontrado",
      });
    }

    // Si se cambia la estación, verificar que existe
    if (id_estacion !== undefined) {
      const estacionExists = await query(
        "SELECT id_estacion FROM estacion WHERE id_estacion = ?",
        [id_estacion]
      );

      if (estacionExists.length === 0) {
        return res.status(400).json({
          success: false,
          message: "La estación especificada no existe",
        });
      }
    }

    const sql = `
      UPDATE acceso 
      SET id_estacion = COALESCE(?, id_estacion),
          nombre = COALESCE(?, nombre),
          tipo = COALESCE(?, tipo),
          esta_activo = COALESCE(?, esta_activo),
          hora_apertura = COALESCE(?, hora_apertura),
          hora_cierre = COALESCE(?, hora_cierre)
      WHERE id_acceso = ?
    `;

    await query(sql, [
      id_estacion,
      nombre,
      tipo,
      esta_activo,
      hora_apertura,
      hora_cierre,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Acceso actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar acceso:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar acceso",
      error: error.message,
    });
  }
};

// Eliminar acceso
export const deleteAcceso = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si tiene guardias asignados
    const guardias = await query(
      "SELECT COUNT(*) as total FROM guardia WHERE id_acceso = ?",
      [id]
    );

    if (guardias[0].total > 0) {
      return res.status(400).json({
        success: false,
        message: `No se puede eliminar el acceso porque tiene ${guardias[0].total} guardia(s) asignado(s)`,
      });
    }

    const sql = "DELETE FROM acceso WHERE id_acceso = ?";
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Acceso no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Acceso eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar acceso:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar acceso",
      error: error.message,
    });
  }
};

export default {
  getAccesos,
  getAccesosByEstacion,
  getAccesoById,
  createAcceso,
  updateAcceso,
  deleteAcceso,
};
