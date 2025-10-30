// frontend/src/services/busService.js
import api from "./api";

export const busService = {
  getBusesConPilotos: async () => {
    try {
      const response = await api.get("/buses/pilotos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener buses con pilotos:", error);
      throw error;
    }
  },

  getBuses: async () => {
    try {
      const response = await api.get("/buses");
      return response.data;
    } catch (error) {
      console.error("Error al obtener buses:", error);
      throw error;
    }
  },

  getBusesByLinea: async (idLinea) => {
    try {
      const response = await api.get(`/buses/linea/${idLinea}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener buses de la línea:", error);
      throw error;
    }
  },

  getBusById: async (id) => {
    try {
      const response = await api.get(`/buses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener bus:", error);
      throw error;
    }
  },

  createBus: async (data) => {
    try {
      const response = await api.post("/buses", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear bus:", error);
      throw error;
    }
  },

  updateBus: async (id, data) => {
    try {
      const response = await api.put(`/buses/${id}`, data);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar bus:", error);
      throw error;
    }
  },

  asignarBusALinea: async (id, idLinea) => {
    try {
      const response = await api.put(`/buses/${id}/asignar-linea`, {
        id_linea: idLinea,
      });
      return response.data;
    } catch (error) {
      console.error("Error al asignar bus a línea:", error);
      throw error;
    }
  },

  cambiarParqueoBus: async (id, idParqueo) => {
    try {
      const response = await api.put(`/buses/${id}/cambiar-parqueo`, {
        id_parqueo: idParqueo,
      });
      return response.data;
    } catch (error) {
      console.error("Error al cambiar parqueo:", error);
      throw error;
    }
  },

  deleteBus: async (id) => {
    try {
      const response = await api.delete(`/buses/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar bus:", error);
      throw error;
    }
  },

  desactivarBus: async (id) => {
    try {
      const response = await api.patch(`/buses/${id}/desactivar`);
      return response.data;
    } catch (error) {
      console.error("Error al desactivar bus:", error);
      throw error;
    }
  },
};

export default busService;
