// backend/src/controllers/operadorController.js
import { query } from "../config/database.js";

// Obtener todos los operadores
export const getOperadores = async (req, res) => {
  try {
    const sql = `
      SELECT 
        o.*,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo
      FROM operador o
      INNER JOIN estacion e ON o.id_estacion = e.id_estacion
      ORDER BY e.nombre, o.nombre
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener operadores:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener operadores",
      error: error.message,
    });
  }
};

// Obtener operadores por estación
export const getOperadoresByEstacion = async (req, res) => {
  try {
    const { id_estacion } = req.params;

    const sql = `
      SELECT o.* 
      FROM operador o
      WHERE o.id_estacion = ?
      ORDER BY o.nombre, o.apellido
    `;

    const results = await query(sql, [id_estacion]);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener operadores de la estación:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener operadores de la estación",
      error: error.message,
    });
  }
};

// Obtener un operador por ID
export const getOperadorById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        o.*,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo
      FROM operador o
      INNER JOIN estacion e ON o.id_estacion = e.id_estacion
      WHERE o.id_operador = ?
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Operador no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener operador:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener operador",
      error: error.message,
    });
  }
};

// Crear nuevo operador
export const createOperador = async (req, res) => {
  try {
    const {
      id_estacion,
      nombre,
      apellido,
      dpi,
      usuario,
      password,
      telefono,
      email,
      fecha_contratacion,
      turno,
      estado,
    } = req.body;

    // Validaciones obligatorias
    if (
      !id_estacion ||
      !nombre ||
      !apellido ||
      !dpi ||
      !usuario ||
      !password ||
      !fecha_contratacion
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos requeridos: id_estacion, nombre, apellido, dpi, usuario, password, fecha_contratacion",
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

    // Verificar que DPI no esté duplicado
    const dpiExists = await query(
      "SELECT id_operador FROM operador WHERE dpi = ?",
      [dpi]
    );

    if (dpiExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un operador con ese DPI",
      });
    }

    // Verificar que usuario no esté duplicado
    const usuarioExists = await query(
      "SELECT id_operador FROM operador WHERE usuario = ?",
      [usuario]
    );

    if (usuarioExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un operador con ese usuario",
      });
    }

    const sql = `
      INSERT INTO operador 
      (id_estacion, nombre, apellido, dpi, usuario, password, telefono, 
       email, fecha_contratacion, turno, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      id_estacion,
      nombre,
      apellido,
      dpi,
      usuario,
      password,
      telefono || null,
      email || null,
      fecha_contratacion,
      turno || "completo",
      estado || "activo",
    ]);

    res.status(201).json({
      success: true,
      message: "Operador creado exitosamente",
      data: { id_operador: result.insertId },
    });
  } catch (error) {
    console.error("Error al crear operador:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear operador",
      error: error.message,
    });
  }
};

// Actualizar operador
export const updateOperador = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_estacion,
      nombre,
      apellido,
      dpi,
      usuario,
      password,
      telefono,
      email,
      fecha_contratacion,
      turno,
      estado,
    } = req.body;

    // Verificar que el operador existe
    const operadorExists = await query(
      "SELECT id_operador FROM operador WHERE id_operador = ?",
      [id]
    );

    if (operadorExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Operador no encontrado",
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

    // Si se cambia el DPI, verificar que no esté duplicado
    if (dpi) {
      const dpiDuplicado = await query(
        "SELECT id_operador FROM operador WHERE dpi = ? AND id_operador != ?",
        [dpi, id]
      );

      if (dpiDuplicado.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro operador con ese DPI",
        });
      }
    }

    // Si se cambia el usuario, verificar que no esté duplicado
    if (usuario) {
      const usuarioDuplicado = await query(
        "SELECT id_operador FROM operador WHERE usuario = ? AND id_operador != ?",
        [usuario, id]
      );

      if (usuarioDuplicado.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro operador con ese usuario",
        });
      }
    }

    const sql = `
      UPDATE operador 
      SET id_estacion = COALESCE(?, id_estacion),
          nombre = COALESCE(?, nombre),
          apellido = COALESCE(?, apellido),
          dpi = COALESCE(?, dpi),
          usuario = COALESCE(?, usuario),
          ${password ? "password = ?," : ""}
          telefono = COALESCE(?, telefono),
          email = COALESCE(?, email),
          fecha_contratacion = COALESCE(?, fecha_contratacion),
          turno = COALESCE(?, turno),
          estado = COALESCE(?, estado)
      WHERE id_operador = ?
    `;

    const params = password
      ? [
          id_estacion,
          nombre,
          apellido,
          dpi,
          usuario,
          password,
          telefono,
          email,
          fecha_contratacion,
          turno,
          estado,
          id,
        ]
      : [
          id_estacion,
          nombre,
          apellido,
          dpi,
          usuario,
          telefono,
          email,
          fecha_contratacion,
          turno,
          estado,
          id,
        ];

    await query(sql, params);

    res.status(200).json({
      success: true,
      message: "Operador actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar operador:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar operador",
      error: error.message,
    });
  }
};

// Eliminar operador
export const deleteOperador = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = "DELETE FROM operador WHERE id_operador = ?";
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Operador no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Operador eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar operador:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar operador",
      error: error.message,
    });
  }
};

export default {
  getOperadores,
  getOperadoresByEstacion,
  getOperadorById,
  createOperador,
  updateOperador,
  deleteOperador,
};
