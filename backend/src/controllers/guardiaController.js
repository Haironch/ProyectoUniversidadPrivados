// backend/src/controllers/guardiaController.js
import { query } from "../config/database.js";

// Obtener todos los guardias
export const getGuardias = async (req, res) => {
  try {
    const sql = `
      SELECT 
        g.*,
        a.nombre as acceso_nombre,
        a.tipo as acceso_tipo,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo
      FROM guardia g
      INNER JOIN acceso a ON g.id_acceso = a.id_acceso
      INNER JOIN estacion e ON a.id_estacion = e.id_estacion
      ORDER BY e.nombre, a.nombre, g.nombre
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener guardias:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener guardias",
      error: error.message,
    });
  }
};

// Obtener guardias por acceso
export const getGuardiasByAcceso = async (req, res) => {
  try {
    const { id_acceso } = req.params;

    const sql = `
      SELECT g.* 
      FROM guardia g
      WHERE g.id_acceso = ?
      ORDER BY g.nombre, g.apellido
    `;

    const results = await query(sql, [id_acceso]);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener guardias del acceso:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener guardias del acceso",
      error: error.message,
    });
  }
};

// Obtener un guardia por ID
export const getGuardiaById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        g.*,
        a.nombre as acceso_nombre,
        e.nombre as estacion_nombre
      FROM guardia g
      INNER JOIN acceso a ON g.id_acceso = a.id_acceso
      INNER JOIN estacion e ON a.id_estacion = e.id_estacion
      WHERE g.id_guardia = ?
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Guardia no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener guardia:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener guardia",
      error: error.message,
    });
  }
};

// Crear nuevo guardia
export const createGuardia = async (req, res) => {
  try {
    const {
      id_acceso,
      nombre,
      apellido,
      dpi,
      telefono,
      direccion,
      fecha_contratacion,
      turno,
      estado,
    } = req.body;

    // Validaciones obligatorias
    if (!id_acceso || !nombre || !apellido || !dpi || !fecha_contratacion) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos requeridos: id_acceso, nombre, apellido, dpi, fecha_contratacion",
      });
    }

    // Verificar que el acceso existe
    const accesoExists = await query(
      "SELECT id_acceso FROM acceso WHERE id_acceso = ?",
      [id_acceso]
    );

    if (accesoExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El acceso especificado no existe",
      });
    }

    // Verificar que DPI no esté duplicado
    const dpiExists = await query(
      "SELECT id_guardia FROM guardia WHERE dpi = ?",
      [dpi]
    );

    if (dpiExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un guardia con ese DPI",
      });
    }

    const sql = `
      INSERT INTO guardia 
      (id_acceso, nombre, apellido, dpi, telefono, direccion, 
       fecha_contratacion, turno, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      id_acceso,
      nombre,
      apellido,
      dpi,
      telefono || null,
      direccion || null,
      fecha_contratacion,
      turno || "rotativo",
      estado || "activo",
    ]);

    res.status(201).json({
      success: true,
      message: "Guardia creado exitosamente",
      data: { id_guardia: result.insertId },
    });
  } catch (error) {
    console.error("Error al crear guardia:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear guardia",
      error: error.message,
    });
  }
};

// Actualizar guardia
export const updateGuardia = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_acceso,
      nombre,
      apellido,
      dpi,
      telefono,
      direccion,
      fecha_contratacion,
      turno,
      estado,
    } = req.body;

    // Verificar que el guardia existe
    const guardiaExists = await query(
      "SELECT id_guardia FROM guardia WHERE id_guardia = ?",
      [id]
    );

    if (guardiaExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Guardia no encontrado",
      });
    }

    // Si se cambia el acceso, verificar que existe
    if (id_acceso !== undefined) {
      const accesoExists = await query(
        "SELECT id_acceso FROM acceso WHERE id_acceso = ?",
        [id_acceso]
      );

      if (accesoExists.length === 0) {
        return res.status(400).json({
          success: false,
          message: "El acceso especificado no existe",
        });
      }
    }

    // Si se cambia el DPI, verificar que no esté duplicado
    if (dpi) {
      const dpiDuplicado = await query(
        "SELECT id_guardia FROM guardia WHERE dpi = ? AND id_guardia != ?",
        [dpi, id]
      );

      if (dpiDuplicado.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro guardia con ese DPI",
        });
      }
    }

    const sql = `
      UPDATE guardia 
      SET id_acceso = COALESCE(?, id_acceso),
          nombre = COALESCE(?, nombre),
          apellido = COALESCE(?, apellido),
          dpi = COALESCE(?, dpi),
          telefono = COALESCE(?, telefono),
          direccion = COALESCE(?, direccion),
          fecha_contratacion = COALESCE(?, fecha_contratacion),
          turno = COALESCE(?, turno),
          estado = COALESCE(?, estado)
      WHERE id_guardia = ?
    `;

    await query(sql, [
      id_acceso,
      nombre,
      apellido,
      dpi,
      telefono,
      direccion,
      fecha_contratacion,
      turno,
      estado,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Guardia actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar guardia:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar guardia",
      error: error.message,
    });
  }
};

// Eliminar guardia
export const deleteGuardia = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM guardia WHERE id_guardia = ?";
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Guardia no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Guardia eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar guardia:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar guardia",
      error: error.message,
    });
  }
};

export default {
  getGuardias,
  getGuardiasByAcceso,
  getGuardiaById,
  createGuardia,
  updateGuardia,
  deleteGuardia,
};
