// frontend/src/services/municipalidadService.js
import api from "./api";

export const municipalidadService = {
  // Obtener todas las municipalidades
  getMunicipalidades: async () => {
    try {
      const response = await api.get("/municipalidades");
      return response.data;
    } catch (error) {
      console.error("Error al obtener municipalidades:", error);
      throw error;
    }
  },
};

export default municipalidadService;
