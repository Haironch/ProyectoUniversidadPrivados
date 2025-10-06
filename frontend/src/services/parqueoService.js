// frontend/src/services/parqueoService.js
import api from "./api";

const parqueoService = {
  getParqueos: async () => {
    try {
      const response = await api.get("/parqueos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener parqueos:", error);
      throw error;
    }
  },

  getParqueoById: async (id) => {
    try {
      const response = await api.get(`/parqueos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener parqueo:", error);
      throw error;
    }
  },

  createParqueo: async (data) => {
    try {
      const response = await api.post("/parqueos", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear parqueo:", error);
      throw error;
    }
  },

  updateParqueo: async (id, data) => {
    try {
      const response = await api.put(`/parqueos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar parqueo:", error);
      throw error;
    }
  },

  deleteParqueo: async (id) => {
    try {
      const response = await api.delete(`/parqueos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar parqueo:", error);
      throw error;
    }
  },
};

export default parqueoService;
