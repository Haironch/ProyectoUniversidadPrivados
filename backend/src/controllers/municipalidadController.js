// backend/src/controllers/municipalidadController.js
import { query } from "../config/database.js";

// Obtener todas las municipalidades
export const getMunicipalidades = async (req, res) => {
  try {
    const sql = `
      SELECT * FROM municipalidad
      ORDER BY nombre
    `;

    const results = await query(sql);

    res.status(200).json({
      success: true,
      count: results.length,
      data: results,
    });
  } catch (error) {
    console.error("Error al obtener municipalidades:", error);
    res.status(500).json({
      success: false,
      message: "Error al obtener municipalidades",
      error: error.message,
    });
  }
};

export default {
  getMunicipalidades,
};
