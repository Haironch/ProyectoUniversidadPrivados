// backend/src/controllers/pilotoController.js
import { query } from "../config/database.js";

// Obtener todos los pilotos
export const getPilotos = async (req, res) => {
  try {
    const sql = `
      SELECT 
        p.*,
        COUNT(DISTINCT he.id_historial) as registros_educativos,
        COUNT(DISTINCT pb.id_piloto_bus) as buses_asignados
      FROM piloto p
      LEFT JOIN historial_educativo he ON p.id_piloto = he.id_piloto
      LEFT JOIN piloto_bus pb ON p.id_piloto = pb.id_piloto AND pb.estado = 'activo'
      GROUP BY p.id_piloto
      ORDER BY p.nombre, p.apellido
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener pilotos:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener pilotos",
      error: error.message,
    });
  }
};

// Obtener un piloto por ID con su historial educativo
export const getPilotoById = async (req, res) => {
  try {
    const { id } = req.params;

    // Obtener datos del piloto
    const pilotoSql = `SELECT * FROM piloto WHERE id_piloto = ?`;
    const piloto = await query(pilotoSql, [id]);

    if (piloto.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Piloto no encontrado",
      });
    }

    // Obtener historial educativo
    const historialSql = `
      SELECT * FROM historial_educativo 
      WHERE id_piloto = ? 
      ORDER BY anio_graduacion DESC
    `;
    const historial = await query(historialSql, [id]);

    res.status(200).json({
      success: true,
      data: {
        ...piloto[0],
        historial_educativo: historial,
      },
    });
  } catch (error) {
    console.error("Error al obtener piloto:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener piloto",
      error: error.message,
    });
  }
};

// Crear nuevo piloto
export const createPiloto = async (req, res) => {
  try {
    const {
      nombre,
      apellido,
      dpi,
      licencia,
      tipo_licencia,
      fecha_vencimiento_licencia,
      direccion_residencia,
      municipio_residencia,
      telefono,
      email,
      fecha_contratacion,
      estado,
      historial_educativo,
    } = req.body;

    // Validaciones obligatorias
    if (
      !nombre ||
      !apellido ||
      !dpi ||
      !licencia ||
      !tipo_licencia ||
      !fecha_vencimiento_licencia ||
      !direccion_residencia ||
      !municipio_residencia ||
      !telefono ||
      !fecha_contratacion
    ) {
      return res.status(400).json({
        success: false,
        message: "Faltan campos requeridos",
      });
    }

    // Verificar que DPI no esté duplicado
    const dpiExists = await query(
      "SELECT id_piloto FROM piloto WHERE dpi = ?",
      [dpi]
    );
    if (dpiExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un piloto con ese DPI",
      });
    }

    // Verificar que licencia no esté duplicada
    const licenciaExists = await query(
      "SELECT id_piloto FROM piloto WHERE licencia = ?",
      [licencia]
    );
    if (licenciaExists.length > 0) {
      return res.status(400).json({
        success: false,
        message: "Ya existe un piloto con esa licencia",
      });
    }

    // Insertar piloto
    const pilotoSql = `
      INSERT INTO piloto 
      (nombre, apellido, dpi, licencia, tipo_licencia, fecha_vencimiento_licencia,
       direccion_residencia, municipio_residencia, telefono, email, 
       fecha_contratacion, estado)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const result = await query(pilotoSql, [
      nombre,
      apellido,
      dpi,
      licencia,
      tipo_licencia,
      fecha_vencimiento_licencia,
      direccion_residencia,
      municipio_residencia,
      telefono,
      email || null,
      fecha_contratacion,
      estado || "activo",
    ]);

    const id_piloto = result.insertId;

    // Insertar historial educativo si existe
    if (historial_educativo && Array.isArray(historial_educativo)) {
      for (const registro of historial_educativo) {
        const historialSql = `
          INSERT INTO historial_educativo
          (id_piloto, nivel_educativo, institucion, anio_graduacion, 
           titulo_obtenido, especialidad)
          VALUES (?, ?, ?, ?, ?, ?)
        `;

        await query(historialSql, [
          id_piloto,
          registro.nivel_educativo,
          registro.institucion,
          registro.anio_graduacion || null,
          registro.titulo_obtenido || null,
          registro.especialidad || null,
        ]);
      }
    }

    res.status(201).json({
      success: true,
      message: "Piloto creado exitosamente",
      data: { id_piloto },
    });
  } catch (error) {
    console.error("Error al crear piloto:", error);
    res.status(500).json({
      success: false,
      message: "Error al crear piloto",
      error: error.message,
    });
  }
};

// Actualizar piloto
export const updatePiloto = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nombre,
      apellido,
      dpi,
      licencia,
      tipo_licencia,
      fecha_vencimiento_licencia,
      direccion_residencia,
      municipio_residencia,
      telefono,
      email,
      fecha_contratacion,
      estado,
    } = req.body;

    // Verificar que el piloto existe
    const pilotoExists = await query(
      "SELECT id_piloto FROM piloto WHERE id_piloto = ?",
      [id]
    );

    if (pilotoExists.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Piloto no encontrado",
      });
    }

    // Si se cambia el DPI, verificar que no esté duplicado
    if (dpi) {
      const dpiDuplicado = await query(
        "SELECT id_piloto FROM piloto WHERE dpi = ? AND id_piloto != ?",
        [dpi, id]
      );
      if (dpiDuplicado.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro piloto con ese DPI",
        });
      }
    }

    // Si se cambia la licencia, verificar que no esté duplicada
    if (licencia) {
      const licenciaDuplicada = await query(
        "SELECT id_piloto FROM piloto WHERE licencia = ? AND id_piloto != ?",
        [licencia, id]
      );
      if (licenciaDuplicada.length > 0) {
        return res.status(400).json({
          success: false,
          message: "Ya existe otro piloto con esa licencia",
        });
      }
    }

    const sql = `
      UPDATE piloto 
      SET nombre = COALESCE(?, nombre),
          apellido = COALESCE(?, apellido),
          dpi = COALESCE(?, dpi),
          licencia = COALESCE(?, licencia),
          tipo_licencia = COALESCE(?, tipo_licencia),
          fecha_vencimiento_licencia = COALESCE(?, fecha_vencimiento_licencia),
          direccion_residencia = COALESCE(?, direccion_residencia),
          municipio_residencia = COALESCE(?, municipio_residencia),
          telefono = COALESCE(?, telefono),
          email = COALESCE(?, email),
          fecha_contratacion = COALESCE(?, fecha_contratacion),
          estado = COALESCE(?, estado)
      WHERE id_piloto = ?
    `;

    await query(sql, [
      nombre,
      apellido,
      dpi,
      licencia,
      tipo_licencia,
      fecha_vencimiento_licencia,
      direccion_residencia,
      municipio_residencia,
      telefono,
      email,
      fecha_contratacion,
      estado,
      id,
    ]);

    res.status(200).json({
      success: true,
      message: "Piloto actualizado exitosamente",
    });
  } catch (error) {
    console.error("Error al actualizar piloto:", error);
    res.status(500).json({
      success: false,
      message: "Error al actualizar piloto",
      error: error.message,
    });
  }
};

// Eliminar piloto
export const deletePiloto = async (req, res) => {
  try {
    const { id } = req.params;

    // Verificar si tiene buses asignados activos
    const asignaciones = await query(
      "SELECT COUNT(*) as total FROM piloto_bus WHERE id_piloto = ? AND estado = 'activo'",
      [id]
    );

    if (asignaciones[0].total > 0) {
      return res.status(400).json({
        success: false,
        message:
          "No se puede eliminar el piloto porque tiene buses asignados activos",
      });
    }

    const sql = "DELETE FROM piloto WHERE id_piloto = ?";
    const result = await query(sql, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Piloto no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Piloto eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar piloto:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar piloto",
      error: error.message,
    });
  }
};

// Agregar registro educativo a un piloto
export const agregarHistorialEducativo = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      nivel_educativo,
      institucion,
      anio_graduacion,
      titulo_obtenido,
      especialidad,
    } = req.body;

    if (!nivel_educativo || !institucion) {
      return res.status(400).json({
        success: false,
        message: "Se requiere nivel_educativo e institucion",
      });
    }

    const sql = `
      INSERT INTO historial_educativo
      (id_piloto, nivel_educativo, institucion, anio_graduacion, 
       titulo_obtenido, especialidad)
      VALUES (?, ?, ?, ?, ?, ?)
    `;

    const result = await query(sql, [
      id,
      nivel_educativo,
      institucion,
      anio_graduacion || null,
      titulo_obtenido || null,
      especialidad || null,
    ]);

    res.status(201).json({
      success: true,
      message: "Registro educativo agregado exitosamente",
      data: { id_historial: result.insertId },
    });
  } catch (error) {
    console.error("Error al agregar historial educativo:", error);
    res.status(500).json({
      success: false,
      message: "Error al agregar historial educativo",
      error: error.message,
    });
  }
};

// Eliminar registro educativo
export const eliminarHistorialEducativo = async (req, res) => {
  try {
    const { id_historial } = req.params;

    const sql = "DELETE FROM historial_educativo WHERE id_historial = ?";
    const result = await query(sql, [id_historial]);

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Registro educativo no encontrado",
      });
    }

    res.status(200).json({
      success: true,
      message: "Registro educativo eliminado exitosamente",
    });
  } catch (error) {
    console.error("Error al eliminar historial educativo:", error);
    res.status(500).json({
      success: false,
      message: "Error al eliminar historial educativo",
      error: error.message,
    });
  }
};

export default {
  getPilotos,
  getPilotoById,
  createPiloto,
  updatePiloto,
  deletePiloto,
  agregarHistorialEducativo,
  eliminarHistorialEducativo,
};
