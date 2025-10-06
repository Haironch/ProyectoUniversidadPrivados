// backend/src/controllers/distanciaController.js
import { query } from "../config/database.js";

// Obtener distancia total de una línea (Punto 13)
export const getDistanciaLinea = async (req, res) => {
  try {
    const { id_linea } = req.params;

    const sql = `
      SELECT 
        l.id_linea,
        l.nombre,
        l.codigo,
        l.distancia_total,
        l.numero_estaciones
      FROM linea l
      WHERE l.id_linea = ?
    `;

    const results = await query(sql, [id_linea]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Línea no encontrada",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener distancia de línea:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener distancia de línea",
      error: error.message,
    });
  }
};

// Obtener distancias entre todas las estaciones de una línea (Punto 12)
export const getDistanciasEstacionesLinea = async (req, res) => {
  try {
    const { id_linea } = req.params;

    const sql = `
      SELECT 
        le.id_linea_estacion,
        le.orden_secuencia,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo,
        le.distancia_estacion_anterior,
        le.tiempo_estimado_minutos,
        le.es_estacion_inicial,
        le.es_estacion_final
      FROM linea_estacion le
      INNER JOIN estacion e ON le.id_estacion = e.id_estacion
      WHERE le.id_linea = ?
      ORDER BY le.orden_secuencia
    `;

    const results = await query(sql, [id_linea]);

    // Calcular distancia acumulada desde el inicio
    let distanciaAcumulada = 0;
    const estacionesConDistancia = results.map((estacion) => {
      distanciaAcumulada +=
        parseFloat(estacion.distancia_estacion_anterior) || 0;
      return {
        ...estacion,
        distancia_desde_inicio: distanciaAcumulada,
      };
    });

    res.status(200).json({
      success: true,
      count: results.length,
      data: estacionesConDistancia,
    });
  } catch (error) {
    console.error("Error al obtener distancias de estaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener distancias de estaciones",
      error: error.message,
    });
  }
};

// Calcular distancia entre dos estaciones específicas en una línea (Punto 12)
export const getDistanciaEntreEstaciones = async (req, res) => {
  try {
    const { id_linea, id_estacion_origen, id_estacion_destino } = req.params;

    // Obtener orden de las estaciones
    const sqlOrden = `
      SELECT 
        id_estacion,
        orden_secuencia,
        distancia_estacion_anterior
      FROM linea_estacion
      WHERE id_linea = ? AND id_estacion IN (?, ?)
      ORDER BY orden_secuencia
    `;

    const estaciones = await query(sqlOrden, [
      id_linea,
      id_estacion_origen,
      id_estacion_destino,
    ]);

    if (estaciones.length !== 2) {
      return res.status(404).json({
        success: false,
        message: "Una o ambas estaciones no pertenecen a esta línea",
      });
    }

    const [estacion1, estacion2] = estaciones;

    // Calcular distancia entre las estaciones
    const sqlDistancia = `
      SELECT 
        SUM(distancia_estacion_anterior) as distancia_total
      FROM linea_estacion
      WHERE id_linea = ? 
        AND orden_secuencia > ? 
        AND orden_secuencia <= ?
    `;

    const distanciaResult = await query(sqlDistancia, [
      id_linea,
      estacion1.orden_secuencia,
      estacion2.orden_secuencia,
    ]);

    const distancia = distanciaResult[0].distancia_total || 0;

    res.status(200).json({
      success: true,
      data: {
        id_linea,
        estacion_origen: {
          id_estacion: estacion1.id_estacion,
          orden_secuencia: estacion1.orden_secuencia,
        },
        estacion_destino: {
          id_estacion: estacion2.id_estacion,
          orden_secuencia: estacion2.orden_secuencia,
        },
        distancia_km: parseFloat(distancia),
        num_estaciones_intermedias:
          estacion2.orden_secuencia - estacion1.orden_secuencia - 1,
      },
    });
  } catch (error) {
    console.error("Error al calcular distancia entre estaciones:", error);
    res.status(500).json({
      success: false,
      message: "Error al calcular distancia entre estaciones",
      error: error.message,
    });
  }
};

// Obtener matriz de distancias de todas las combinaciones de estaciones
export const getMatrizDistancias = async (req, res) => {
  try {
    const { id_linea } = req.params;

    // Obtener todas las estaciones de la línea
    const sqlEstaciones = `
      SELECT 
        le.id_estacion,
        le.orden_secuencia,
        e.nombre as estacion_nombre,
        e.codigo as estacion_codigo
      FROM linea_estacion le
      INNER JOIN estacion e ON le.id_estacion = e.id_estacion
      WHERE le.id_linea = ?
      ORDER BY le.orden_secuencia
    `;

    const estaciones = await query(sqlEstaciones, [id_linea]);

    if (estaciones.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No se encontraron estaciones para esta línea",
      });
    }

    // Obtener todas las distancias
    const sqlDistancias = `
      SELECT 
        orden_secuencia,
        distancia_estacion_anterior
      FROM linea_estacion
      WHERE id_linea = ?
      ORDER BY orden_secuencia
    `;

    const distancias = await query(sqlDistancias, [id_linea]);

    // Crear matriz de distancias acumuladas
    const matriz = [];

    for (let i = 0; i < estaciones.length; i++) {
      for (let j = i + 1; j < estaciones.length; j++) {
        let distanciaTotal = 0;

        // Sumar distancias entre estación i y j
        for (let k = i + 1; k <= j; k++) {
          distanciaTotal +=
            parseFloat(distancias[k].distancia_estacion_anterior) || 0;
        }

        matriz.push({
          origen: {
            id_estacion: estaciones[i].id_estacion,
            nombre: estaciones[i].estacion_nombre,
            codigo: estaciones[i].estacion_codigo,
            orden: estaciones[i].orden_secuencia,
          },
          destino: {
            id_estacion: estaciones[j].id_estacion,
            nombre: estaciones[j].estacion_nombre,
            codigo: estaciones[j].estacion_codigo,
            orden: estaciones[j].orden_secuencia,
          },
          distancia_km: distanciaTotal,
          estaciones_intermedias: j - i - 1,
        });
      }
    }

    res.status(200).json({
      success: true,
      id_linea: parseInt(id_linea),
      total_estaciones: estaciones.length,
      total_combinaciones: matriz.length,
      data: matriz,
    });
  } catch (error) {
    console.error("Error al generar matriz de distancias:", error);
    res.status(500).json({
      success: false,
      message: "Error al generar matriz de distancias",
      error: error.message,
    });
  }
};

export default {
  getDistanciaLinea,
  getDistanciasEstacionesLinea,
  getDistanciaEntreEstaciones,
  getMatrizDistancias,
};
