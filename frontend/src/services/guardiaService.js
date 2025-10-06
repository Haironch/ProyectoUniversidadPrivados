// frontend/src/services/guardiaService.js
import api from "./api";

const guardiaService = {
  getGuardias: async () => {
    try {
      const response = await api.get("/guardias");
      return response.data;
    } catch (error) {
      console.error("Error al obtener guardias:", error);
      throw error;
    }
  },

  getGuardiasByAcceso: async (idAcceso) => {
    try {
      const response = await api.get(`/guardias/acceso/${idAcceso}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener guardias del acceso:", error);
      throw error;
    }
  },

  getGuardiaById: async (id) => {
    try {
      const response = await api.get(`/guardias/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener guardia:", error);
      throw error;
    }
  },

  createGuardia: async (data) => {
    try {
      const response = await api.post("/guardias", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear guardia:", error);
      throw error;
    }
  },

  updateGuardia: async (id, data) => {
    try {
      const response = await api.put(`/guardias/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar guardia:", error);
      throw error;
    }
  },

  deleteGuardia: async (id) => {
    try {
      const response = await api.delete(`/guardias/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar guardia:", error);
      throw error;
    }
  },
};

export default guardiaService;
