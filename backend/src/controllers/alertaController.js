// backend/src/controllers/alertaController.js
import { query } from "../config/database.js";

// Obtener todas las alertas
export const getAlertas = async (req, res) => {
  try {
    const { estado, prioridad } = req.query;

    let sql = `
      SELECT 
        a.*,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo,
        b.numero_unidad as bus_numero,
        b.placa as bus_placa,
        o.nombre as operador_nombre,
        o.apellido as operador_apellido
      FROM alerta a
      LEFT JOIN estacion e ON a.id_estacion = e.id_estacion
      LEFT JOIN bus b ON a.id_bus = b.id_bus
      LEFT JOIN operador o ON a.id_operador_atendio = o.id_operador
      WHERE 1=1
    `;

    const params = [];

    if (estado) {
      sql += ` AND a.estado = ?`;
      params.push(estado);
    }

    if (prioridad) {
      sql += ` AND a.prioridad = ?`;
      params.push(prioridad);
    }

    sql += ` ORDER BY a.fecha_hora_generada DESC`;

    const results = await query(sql, params);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener alertas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener alertas",
      error: error.message,
    });
  }
};

// Obtener alertas activas (pendientes y en atención)
export const getAlertasActivas = async (req, res) => {
  try {
    const sql = `
      SELECT 
        a.*,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo,
        b.numero_unidad as bus_numero,
        b.placa as bus_placa
      FROM alerta a
      LEFT JOIN estacion e ON a.id_estacion = e.id_estacion
      LEFT JOIN bus b ON a.id_bus = b.id_bus
      WHERE a.estado IN ('pendiente', 'en_atencion')
      ORDER BY 
        FIELD(a.prioridad, 'critica', 'alta', 'media', 'baja'),
        a.fecha_hora_generada DESC
    `;

    const results = await query(sql);

    // Agrupar por prioridad
    const alertasPorPrioridad = {
      critica: results.filter((a) => a.prioridad === "critica"),
      alta: results.filter((a) => a.prioridad === "alta"),
      media: results.filter((a) => a.prioridad === "media"),
      baja: results.filter((a) => a.prioridad === "baja"),
    };

    res.status(200).json({
      success: true,
      total: results.length,
      por_prioridad: {
        critica: alertasPorPrioridad.critica.length,
        alta: alertasPorPrioridad.alta.length,
        media: alertasPorPrioridad.media.length,
        baja: alertasPorPrioridad.baja.length,
      },
      data: results,
      agrupadas: alertasPorPrioridad,
    });
  } catch (error) {
    console.error("Error al obtener alertas activas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener alertas activas",
      error: error.message,
    });
  }
};

// Obtener alerta por ID
export const getAlertaById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        a.*,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo,
        b.numero_unidad as bus_numero,
        b.placa as bus_placa,
        o.nombre as operador_nombre,
        o.apellido as operador_apellido
      FROM alerta a
      LEFT JOIN estacion e ON a.id_estacion = e.id_estacion
      LEFT JOIN bus b ON a.id_bus = b.id_bus
      LEFT JOIN operador o ON a.id_operador_atendio = o.id_operador
      WHERE a.id_alerta = ?
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Alerta no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener alerta:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener alerta",
      error: error.message,
    });
  }
};

// Crear nueva alerta manualmente
export const createAlerta = async (req, res) => {
  try {
    const { id_estacion, id_bus, tipo_alerta, descripcion, prioridad } =
      req.body;

    if (!tipo_alerta || !descripcion) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos: tipo_alerta, descripcion",
      });
    }

    const sql = `
      INSERT INTO alerta 
      (id_estacion, id_bus, tipo_alerta, descripcion, prioridad, estado)
      VALUES (?, ?, ?, ?, ?, 'pendiente')
    `;

    const result = await query(sql, [
      id_estacion || null,
      id_bus || null,
      tipo_alerta,
      descripcion,
      prioridad || "media",
    ]);

    res.status(201).json({
      success: true,
      message: "Alerta creada exitosamente",
      data: { id_alerta: result.insertId },
    });
  } catch (error) {
    console.error("Error al crear alerta:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear alerta",
      error: error.message,
    });
  }
};

// Atender alerta (cambiar estado a "en_atencion")
export const atenderAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_operador } = req.body;

    const sql = `
      UPDATE alerta 
      SET estado = 'en_atencion',
          id_operador_atendio = ?
      WHERE id_alerta = ? AND estado = 'pendiente'
    `;

    const result = await query(sql, [id_operador || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Alerta no encontrada o ya fue atendida",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alerta marcada como en atención",
    });
  } catch (error) {
    console.error("Error al atender alerta:", error);
    res.status(500).json({
      success: false,
      message: "Error al atender alerta",
      error: error.message,
    });
  }
};

// Resolver alerta
export const resolverAlerta = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_operador } = req.body;

    const sql = `
      UPDATE alerta 
      SET estado = 'resuelta',
          fecha_hora_atendida = NOW(),
          id_operador_atendio = COALESCE(?, id_operador_atendio)
      WHERE id_alerta = ? AND estado IN ('pendiente', 'en_atencion')
    `;

    const result = await query(sql, [id_operador || null, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Alerta no encontrada o ya fue resuelta",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alerta resuelta exitosamente",
    });
  } catch (error) {
    console.error("Error al resolver alerta:", error);
    res.status(500).json({
      success: false,
      message: "Error al resolver alerta",
      error: error.message,
    });
  }
};

// Cancelar alerta
export const cancelarAlerta = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE alerta 
      SET estado = 'cancelada'
      WHERE id_alerta = ? AND estado IN ('pendiente', 'en_atencion')
    `;

    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Alerta no encontrada o ya fue procesada",
      });
    }

    res.status(200).json({
      success: true,
      message: "Alerta cancelada",
    });
  } catch (error) {
    console.error("Error al cancelar alerta:", error);
    res.status(500).json({
      success: false,
      message: "Error al cancelar alerta",
      error: error.message,
    });
  }
};

// Obtener estadísticas de alertas
export const getEstadisticasAlertas = async (req, res) => {
  try {
    const sqlEstados = `
      SELECT 
        estado,
        COUNT(*) as total
      FROM alerta
      GROUP BY estado
    `;

    const sqlPrioridades = `
      SELECT 
        prioridad,
        COUNT(*) as total
      FROM alerta
      WHERE estado IN ('pendiente', 'en_atencion')
      GROUP BY prioridad
    `;

    const sqlTipos = `
      SELECT 
        tipo_alerta,
        COUNT(*) as total
      FROM alerta
      WHERE DATE(fecha_hora_generada) >= DATE_SUB(CURDATE(), INTERVAL 7 DAY)
      GROUP BY tipo_alerta
      ORDER BY total DESC
    `;

    const [estados, prioridades, tipos] = await Promise.all([
      query(sqlEstados),
      query(sqlPrioridades),
      query(sqlTipos),
    ]);

    res.status(200).json({
      success: true,
      data: {
        por_estado: estados,
        por_prioridad: prioridades,
        por_tipo_ultima_semana: tipos,
      },
    });
  } catch (error) {
    console.error("Error al obtener estadísticas:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener estadísticas",
      error: error.message,
    });
  }
};

export default {
  getAlertas,
  getAlertasActivas,
  getAlertaById,
  createAlerta,
  atenderAlerta,
  resolverAlerta,
  cancelarAlerta,
  getEstadisticasAlertas,
};
