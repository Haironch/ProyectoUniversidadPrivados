// frontend/src/services/pilotoService.js
import api from "./api";

const pilotoService = {
  getPilotos: async () => {
    try {
      const response = await api.get("/pilotos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener pilotos:", error);
      throw error;
    }
  },

  getPilotoById: async (id) => {
    try {
      const response = await api.get(`/pilotos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener piloto:", error);
      throw error;
    }
  },

  createPiloto: async (data) => {
    try {
      const response = await api.post("/pilotos", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear piloto:", error);
      throw error;
    }
  },

  updatePiloto: async (id, data) => {
    try {
      const response = await api.put(`/pilotos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar piloto:", error);
      throw error;
    }
  },

  deletePiloto: async (id) => {
    try {
      const response = await api.delete(`/pilotos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar piloto:", error);
      throw error;
    }
  },

  agregarHistorialEducativo: async (idPiloto, data) => {
    try {
      const response = await api.post(`/pilotos/${idPiloto}/historial`, data);
      return response.data;
    } catch (error) {
      console.error("Error al agregar historial educativo:", error);
      throw error;
    }
  },

  eliminarHistorialEducativo: async (idHistorial) => {
    try {
      const response = await api.delete(`/pilotos/historial/${idHistorial}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar historial educativo:", error);
      throw error;
    }
  },
};

export default pilotoService;
