// backend/src/controllers/busController.js
import { query } from "../config/database.js";

export const getBusesConPilotos = async (req, res) => {
  try {
    const sql = `
      SELECT
        b.numero_unidad,
        b.placa,
        l.nombre AS linea,
        CONCAT(p.nombre, ' ', p.apellido) AS piloto,
        pb.turno
      FROM bus b
      LEFT JOIN linea l ON b.id_linea = l.id_linea
      LEFT JOIN piloto_bus pb ON b.id_bus = pb.id_bus AND pb.estado = 'activo'
      LEFT JOIN piloto p ON pb.id_piloto = p.id_piloto
      ORDER BY b.numero_unidad
    `;
    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener buses con pilotos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener la informacion de buses",
      error: error.message,
    });
  }
};

export const getBuses = async (req, res) => {
  try {
    const sql = `
      SELECT 
        b.*,
        l.nombre as linea_nombre,
        l.codigo as linea_codigo,
        p.nombre as parqueo_nombre,
        p.direccion as parqueo_direccion
      FROM bus b
      LEFT JOIN linea l ON b.id_linea = l.id_linea
      LEFT JOIN parqueo p ON b.id_parqueo = p.id_parqueo
      ORDER BY b.numero_unidad
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener buses:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener buses",
      error: error.message,
    });
  }
};

export const getBusById = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      SELECT 
        b.*,
        l.nombre as linea_nombre,
        l.codigo as linea_codigo,
        p.nombre as parqueo_nombre,
        p.direccion as parqueo_direccion
      FROM bus b
      LEFT JOIN linea l ON b.id_linea = l.id_linea
      LEFT JOIN parqueo p ON b.id_parqueo = p.id_parqueo
      WHERE b.id_bus = ?
    `;

    const results = await query(sql, [id]);

    if (results.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      data: results[0],
    });
  } catch (error) {
    console.error("Error al obtener bus:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener bus",
      error: error.message,
    });
  }
};

export const createBus = async (req, res) => {
  try {
    const {
      numero_unidad,
      placa,
      modelo,
      anio,
      capacidad_maxima,
      id_parqueo,
      id_linea,
      estado,
    } = req.body;

    if (!numero_unidad || !placa || !capacidad_maxima || !id_parqueo) {
      return res.status(400).json({
        success: false,
        message:
          "Faltan campos requeridos: numero_unidad, placa, capacidad_maxima, id_parqueo",
      });
    }

    const parqueoExists = await query(
      "SELECT id_parqueo FROM parqueo WHERE id_parqueo = ?",
      [id_parqueo]
    );

    if (parqueoExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El parqueo especificado no existe",
      });
    }

    if (id_linea) {
      const lineaExists = await query(
        "SELECT id_linea, numero_estaciones, min_buses_requeridos, max_buses_permitidos FROM linea WHERE id_linea = ?",
        [id_linea]
      );

      if (lineaExists.length === 0) {
        return res.status(400).json({
          success: false,
          message: "La línea especificada no existe",
        });
      }

      const busesEnLinea = await query(
        "SELECT COUNT(*) as total FROM bus WHERE id_linea = ?",
        [id_linea]
      );

      const linea = lineaExists[0];
      const totalBusesActuales = busesEnLinea[0].total;

      if (totalBusesActuales >= linea.max_buses_permitidos) {
        return res.status(400).json({
          success: false,
          message: `La línea ya tiene el máximo de buses permitidos (${linea.max_buses_permitidos}). Máximo = número de estaciones × 2`,
        });
      }
    }

    const sql = `
      INSERT INTO bus 
      (numero_unidad, placa, modelo, anio, capacidad_maxima, id_parqueo, 
       id_linea, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      numero_unidad,
      placa,
      modelo || null,
      anio || null,
      capacidad_maxima,
      id_parqueo,
      id_linea || null,
      estado || "operativo",
    ]);

    res.status(201).json({
      success: true,
      message: "Bus creado exitosamente",
      data: { id_bus: result.insertId },
    });
  } catch (error) {
    console.error("Error al crear bus:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear bus",
      error: error.message,
    });
  }
};

export const updateBus = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      numero_unidad,
      placa,
      modelo,
      anio,
      capacidad_maxima,
      id_parqueo,
      id_linea,
      estado,
    } = req.body;

    const busExists = await query("SELECT id_linea FROM bus WHERE id_bus = ?", [
      id,
    ]);

    if (busExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus no encontrado",
      });
    }

    if (id_parqueo !== undefined) {
      const parqueoExists = await query(
        "SELECT id_parqueo FROM parqueo WHERE id_parqueo = ?",
        [id_parqueo]
      );

      if (parqueoExists.length === 0) {
        return res.status(400).json({
          success: false,
          message: "El parqueo especificado no existe",
        });
      }
    }

    if (id_linea !== undefined && id_linea !== null) {
      const lineaExists = await query(
        "SELECT id_linea, max_buses_permitidos FROM linea WHERE id_linea = ?",
        [id_linea]
      );

      if (lineaExists.length === 0) {
        return res.status(400).json({
          success: false,
          message: "La línea especificada no existe",
        });
      }

      const lineaActual = busExists[0].id_linea;

      if (id_linea !== lineaActual) {
        const busesEnNuevaLinea = await query(
          "SELECT COUNT(*) as total FROM bus WHERE id_linea = ?",
          [id_linea]
        );

        const linea = lineaExists[0];
        const totalBusesActuales = busesEnNuevaLinea[0].total;

        if (totalBusesActuales >= linea.max_buses_permitidos) {
          return res.status(400).json({
            success: false,
            message: `La línea ya tiene el máximo de buses permitidos (${linea.max_buses_permitidos})`,
          });
        }
      }
    }

    const sql = `
      UPDATE bus 
      SET numero_unidad = COALESCE(?, numero_unidad),
          placa = COALESCE(?, placa),
          modelo = COALESCE(?, modelo),
          anio = COALESCE(?, anio),
          capacidad_maxima = COALESCE(?, capacidad_maxima),
          id_parqueo = COALESCE(?, id_parqueo),
          id_linea = ?,
          estado = COALESCE(?, estado)
      WHERE id_bus = ?
    `;

    await query(sql, [
      numero_unidad,
      placa,
      modelo,
      anio,
      capacidad_maxima,
      id_parqueo,
      id_linea,
      estado,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Bus actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar bus:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar bus",
      error: error.message,
    });
  }
};

export const deleteBus = async (req, res) => {
  try {
    const { id } = req.params;

    const busExists = await query(
      "SELECT numero_unidad FROM bus WHERE id_bus = ?",
      [id]
    );

    if (busExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus no encontrado",
      });
    }

    const checkDependencies = `
      SELECT 
        (SELECT COUNT(*) FROM alerta WHERE id_bus = ?) as alertas,
        (SELECT COUNT(*) FROM piloto_bus WHERE id_bus = ?) as pilotos,
        (SELECT COUNT(*) FROM recorrido WHERE id_bus = ?) as recorridos
    `;

    const [dependencies] = await query(checkDependencies, [id, id, id]);
    const { alertas, pilotos, recorridos } = dependencies;
    const total = alertas + pilotos + recorridos;

    if (total > 0) {
      const detalles = [];
      if (alertas > 0) detalles.push(`${alertas} alerta(s)`);
      if (pilotos > 0) detalles.push(`${pilotos} piloto(s) asignado(s)`);
      if (recorridos > 0)
        detalles.push(`${recorridos} recorrido(s) histórico(s)`);

      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar este bus porque tiene registros asociados",
        dependencies: {
          alertas,
          pilotos,
          recorridos,
          total,
          detalles,
        },
        suggestion: "Puedes desactivar el bus en lugar de eliminarlo",
      });
    }

    const sql = "DELETE FROM bus WHERE id_bus = ?";
    await query(sql, [id]);

    res.status(200).json({
      success: true,
      message: "Bus eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar bus:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar bus",
      error: error.message,
    });
  }
};

export const desactivarBus = async (req, res) => {
  try {
    const { id } = req.params;

    const sql = `
      UPDATE bus 
      SET estado = 'fuera_servicio' 
      WHERE id_bus = ?
    `;
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Bus no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message:
        "Bus desactivado exitosamente. Ya no aparecerá en operaciones activas.",
    });
  } catch (error) {
    console.error("Error al desactivar bus:", error);
    res.status(500).json({
      success: false,
      message: "Error al desactivar bus",
      error: error.message,
    });
  }
};

export const asignarBusALinea = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_linea } = req.body;

    if (!id_linea) {
      return res.status(400).json({
        success: false,
        message: "Se requiere id_linea",
      });
    }

    const lineaExists = await query(
      "SELECT id_linea, max_buses_permitidos FROM linea WHERE id_linea = ?",
      [id_linea]
    );

    if (lineaExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "La línea especificada no existe",
      });
    }

    const busesEnLinea = await query(
      "SELECT COUNT(*) as total FROM bus WHERE id_linea = ?",
      [id_linea]
    );

    const linea = lineaExists[0];
    const totalBusesActuales = busesEnLinea[0].total;

    if (totalBusesActuales >= linea.max_buses_permitidos) {
      return res.status(400).json({
        success: false,
        message: `La línea ya tiene el máximo de buses permitidos (${linea.max_buses_permitidos})`,
      });
    }

    const sql = "UPDATE bus SET id_linea = ? WHERE id_bus = ?";
    await query(sql, [id_linea, id]);

    res.status(200).json({
      success: true,
      message: "Bus asignado a línea exitosamente",
    });
  } catch (error) {
    console.error("Error al asignar bus a línea:", error);
    res.status(500).json({
      success: false,
      message: "Error al asignar bus a línea",
      error: error.message,
    });
  }
};

export const cambiarParqueoBus = async (req, res) => {
  try {
    const { id } = req.params;
    const { id_parqueo } = req.body;

    if (!id_parqueo) {
      return res.status(400).json({
        success: false,
        message: "Se requiere id_parqueo. Un bus no puede quedarse sin parqueo",
      });
    }

    const parqueoExists = await query(
      "SELECT id_parqueo FROM parqueo WHERE id_parqueo = ?",
      [id_parqueo]
    );

    if (parqueoExists.length === 0) {
      return res.status(400).json({
        success: false,
        message: "El parqueo especificado no existe",
      });
    }

    const sql = "UPDATE bus SET id_parqueo = ? WHERE id_bus = ?";
    await query(sql, [id_parqueo, id]);

    res.status(200).json({
      success: true,
      message: "Parqueo del bus cambiado exitosamente",
    });
  } catch (error) {
    console.error("Error al cambiar parqueo:", error);
    res.status(500).json({
      success: false,
      message: "Error al cambiar parqueo",
      error: error.message,
    });
  }
};

export const getBusesByLinea = async (req, res) => {
  try {
    const { id_linea } = req.params;

    const sql = `
      SELECT 
        b.*,
        p.nombre as parqueo_nombre,
        p.direccion as parqueo_direccion
      FROM bus b
      LEFT JOIN parqueo p ON b.id_parqueo = p.id_parqueo
      WHERE b.id_linea = ?
      ORDER BY b.numero_unidad
    `;

    const results = await query(sql, [id_linea]);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener buses de la línea:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener buses de la línea",
      error: error.message,
    });
  }
};

export default {
  getBusesConPilotos,
  getBuses,
  getBusById,
  createBus,
  updateBus,
  deleteBus,
  desactivarBus,
  asignarBusALinea,
  cambiarParqueoBus,
  getBusesByLinea,
};
