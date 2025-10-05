// frontend/src/services/lineaService.js
import api from "./api";

export const lineaService = {
  // Obtener todas las lineas
  getLineas: async () => {
    try {
      const response = await api.get("/lineas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener lineas:", error);
      throw error;
    }
  },

  // Obtener una linea por ID
  getLineaById: async (id) => {
    try {
      const response = await api.get(`/lineas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener linea:", error);
      throw error;
    }
  },

  // Crear nueva linea
  createLinea: async (lineaData) => {
    try {
      const response = await api.post("/lineas", lineaData);
      return response.data;
    } catch (error) {
      console.error("Error al crear linea:", error);
      throw error;
    }
  },

  // Actualizar linea
  updateLinea: async (id, lineaData) => {
    try {
      const response = await api.put(`/lineas/${id}`, lineaData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar linea:", error);
      throw error;
    }
  },

  // Eliminar linea
  deleteLinea: async (id) => {
    try {
      const response = await api.delete(`/lineas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar linea:", error);
      throw error;
    }
  },
};

export default lineaService;
