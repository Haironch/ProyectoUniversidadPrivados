// backend/src/controllers/estacionController.js
import { query } from "../config/database.js";

// Obtener todas las estaciones
export const getEstaciones = async (req, res) => {
  try {
    const sql = `
      SELECT 
        e.*,
        m.nombre as municipalidad_nombre,
        COUNT(DISTINCT a.id_acceso) as total_accesos
      FROM estacion e
      LEFT JOIN municipalidad m ON e.id_municipalidad = m.id_municipalidad
      LEFT JOIN acceso a ON e.id_estacion = a.id_estacion
      GROUP BY e.id_estacion
      ORDER BY e.codigo
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener estaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estaciones",
      error: error.message,
    });
  }
};

// Obtener una estacion por ID
export const getEstacionById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        e.*,
        m.nombre as municipalidad_nombre
      FROM estacion e
      LEFT JOIN municipalidad m ON e.id_municipalidad = m.id_municipalidad
      WHERE e.id_estacion = ?
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Estacion no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener estacion:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estacion",
      error: error.message,
    });
  }
};

// Crear nueva estacion
export const createEstacion = async (req, res) => {
  try {
    const {
      id_municipalidad,
      nombre,
      codigo,
      latitud,
      longitud,
      direccion,
      capacidad_maxima,
      estado,
    } = req.body;

    if (!id_municipalidad || !nombre || !codigo) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
      });
    }

    const sql = `
      INSERT INTO estacion 
      (id_municipalidad, nombre, codigo, latitud, longitud, direccion, capacidad_maxima, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      id_municipalidad,
      nombre,
      codigo,
      latitud || null,
      longitud || null,
      direccion || null,
      capacidad_maxima || 100,
      estado || "operativa",
    ]);

    res.status(201).json({
      success: true,
      message: "Estacion creada exitosamente",
      data: {
        id_estacion: result.insertId,
        ...req.body,
      },
    });
  } catch (error) {
    console.error("Error al crear estacion:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear estacion",
      error: error.message,
    });
  }
};

// Actualizar estacion
export const updateEstacion = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      id_municipalidad,
      nombre,
      codigo,
      latitud,
      longitud,
      direccion,
      capacidad_maxima,
      estado,
    } = req.body;

    const sql = `
      UPDATE estacion 
      SET id_municipalidad = ?, nombre = ?, codigo = ?, latitud = ?, 
          longitud = ?, direccion = ?, capacidad_maxima = ?, estado = ?
      WHERE id_estacion = ?
    `;

    const result = await query(sql, [
      id_municipalidad,
      nombre,
      codigo,
      latitud,
      longitud,
      direccion,
      capacidad_maxima,
      estado,
      id,
    ]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Estacion no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Estacion actualizada exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar estacion:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar estacion",
      error: error.message,
    });
  }
};

// Eliminar estacion
export const deleteEstacion = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si tiene lineas asignadas
    const lineas = await query(
      "SELECT COUNT(*) as count FROM linea_estacion WHERE id_estacion = ?",
      [id]
    );

    if (lineas[0].count > 0) {
      return res.status(400).json({
        success: false,
        message:
          "Esta estacion esta asignada a una linea y no puede ser eliminada.",
      });
    }

    const sql = `DELETE FROM estacion WHERE id_estacion = ?`;
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Estacion no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Estacion eliminada exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar estacion:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar estacion",
      error: error.message,
    });
  }
};

// Registrar conteo de pasajeros y generar alerta automática (PUNTO 14)
export const registrarConteo = async (req, res) => {
  try {
    const { id } = req.params;
    const { pasajeros_actuales } = req.body;

    // Validación
    if (!pasajeros_actuales || pasajeros_actuales < 0) {
      return res.status(400).json({
        success: false,
        message: "Se requiere un número válido de pasajeros",
      });
    }

    // Verificar que la estación existe y obtener su capacidad
    const estacionSql = `
      SELECT id_estacion, nombre, capacidad_maxima 
      FROM estacion 
      WHERE id_estacion = ?
    `;
    const estacion = await query(estacionSql, [id]);

    if (estacion.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Estación no encontrada",
      });
    }

    const { nombre, capacidad_maxima } = estacion[0];

    // Actualizar pasajeros actuales en la estación
    const updateSql = `
      UPDATE estacion 
      SET pasajeros_actuales = ? 
      WHERE id_estacion = ?
    `;
    await query(updateSql, [pasajeros_actuales, id]);

    // Calcular umbral (150% de capacidad según PUNTO 14)
    const umbral = capacidad_maxima * 1.5;
    let alertaGenerada = null;

    // VALIDACIÓN AUTOMÁTICA: ¿Se superó el umbral?
    if (pasajeros_actuales >= umbral) {
      // Determinar prioridad
      let prioridad = "alta";
      if (pasajeros_actuales >= capacidad_maxima * 2) {
        prioridad = "critica";
      }

      // Crear alerta automáticamente
      const alertaSql = `
        INSERT INTO alerta 
        (id_estacion, tipo_alerta, descripcion, prioridad, estado)
        VALUES (?, ?, ?, ?, 'pendiente')
      `;

      const descripcion = `Capacidad excedida en estación ${nombre}. Pasajeros actuales: ${pasajeros_actuales}, Capacidad máxima: ${capacidad_maxima} (${Math.round(
        (pasajeros_actuales / capacidad_maxima) * 100
      )}% de ocupación)`;

      const resultAlerta = await query(alertaSql, [
        id,
        "capacidad_excedida",
        descripcion,
        prioridad,
      ]);

      alertaGenerada = {
        id_alerta: resultAlerta.insertId,
        tipo: "capacidad_excedida",
        prioridad,
        descripcion,
      };
    }

    // Respuesta
    res.status(200).json({
      success: true,
      message: alertaGenerada
        ? "Conteo registrado y alerta generada automáticamente"
        : "Conteo registrado correctamente",
      data: {
        estacion: nombre,
        pasajeros_actuales,
        capacidad_maxima,
        porcentaje_ocupacion: Math.round(
          (pasajeros_actuales / capacidad_maxima) * 100
        ),
        umbral_alerta: umbral,
        alerta_generada: alertaGenerada,
      },
    });
  } catch (error) {
    console.error("Error al registrar conteo:", error);
    res.status(500).json({
      success: false,
      message: "Error al registrar conteo de pasajeros",
      error: error.message,
    });
  }
};

// Obtener buses disponibles en una estación (filtrados por línea)
export const getBusesDisponibles = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT DISTINCT
        b.id_bus,
        b.numero_unidad,
        b.placa,
        b.capacidad_maxima,
        b.pasajeros_actuales,
        b.estado,
        l.nombre as linea_nombre,
        l.codigo as linea_codigo
      FROM bus b
      INNER JOIN linea l ON b.id_linea = l.id_linea
      INNER JOIN linea_estacion le ON l.id_linea = le.id_linea
      WHERE le.id_estacion = ? 
        AND b.estado = 'operativo'
      ORDER BY b.numero_unidad
    `;

    const results = await query(sql, [id]);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener buses disponibles:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener buses disponibles",
      error: error.message,
    });
  }
};

export default {
  getEstaciones,
  getEstacionById,
  createEstacion,
  updateEstacion,
  deleteEstacion,
  registrarConteo,
  getBusesDisponibles,
};
