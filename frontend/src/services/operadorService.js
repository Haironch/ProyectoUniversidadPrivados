// frontend/src/services/operadorService.js
import api from "./api";

const operadorService = {
  getOperadores: async () => {
    try {
      const response = await api.get("/operadores");
      return response.data;
    } catch (error) {
      console.error("Error al obtener operadores:", error);
      throw error;
    }
  },

  getOperadoresByEstacion: async (idEstacion) => {
    try {
      const response = await api.get(`/operadores/estacion/${idEstacion}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener operadores de la estación:", error);
      throw error;
    }
  },

  getOperadorById: async (id) => {
    try {
      const response = await api.get(`/operadores/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener operador:", error);
      throw error;
    }
  },

  createOperador: async (data) => {
    try {
      const response = await api.post("/operadores", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear operador:", error);
      throw error;
    }
  },

  updateOperador: async (id, data) => {
    try {
      const response = await api.put(`/operadores/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar operador:", error);
      throw error;
    }
  },

  deleteOperador: async (id) => {
    try {
      const response = await api.delete(`/operadores/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar operador:", error);
      throw error;
    }
  },
};

export default operadorService;
