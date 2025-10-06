// frontend/src/services/accesoService.js
import api from "./api";

const accesoService = {
  getAccesos: async () => {
    try {
      const response = await api.get("/accesos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener accesos:", error);
      throw error;
    }
  },

  getAccesosByEstacion: async (idEstacion) => {
    try {
      const response = await api.get(`/accesos/estacion/${idEstacion}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener accesos de la estación:", error);
      throw error;
    }
  },

  getAccesoById: async (id) => {
    try {
      const response = await api.get(`/accesos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener acceso:", error);
      throw error;
    }
  },

  createAcceso: async (data) => {
    try {
      const response = await api.post("/accesos", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear acceso:", error);
      throw error;
    }
  },

  updateAcceso: async (id, data) => {
    try {
      const response = await api.put(`/accesos/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar acceso:", error);
      throw error;
    }
  },

  deleteAcceso: async (id) => {
    try {
      const response = await api.delete(`/accesos/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar acceso:", error);
      throw error;
    }
  },
};

export default accesoService;
