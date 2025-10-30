// frontend/src/services/estacionService.js
import api from "./api";

export const estacionService = {
  // Obtener todas las estaciones
  getEstaciones: async () => {
    try {
      const response = await api.get("/estaciones");
      return response.data;
    } catch (error) {
      console.error("Error al obtener estaciones:", error);
      throw error;
    }
  },

  // Obtener una estacion por ID
  getEstacionById: async (id) => {
    try {
      const response = await api.get(`/estaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener estacion:", error);
      throw error;
    }
  },

  // Crear nueva estacion
  createEstacion: async (estacionData) => {
    try {
      const response = await api.post("/estaciones", estacionData);
      return response.data;
    } catch (error) {
      console.error("Error al crear estacion:", error);
      throw error;
    }
  },

  // Actualizar estacion
  updateEstacion: async (id, estacionData) => {
    try {
      const response = await api.put(`/estaciones/${id}`, estacionData);
      return response.data;
    } catch (error) {
      console.error("Error al actualizar estacion:", error);
      throw error;
    }
  },

  // Eliminar estacion
  deleteEstacion: async (id) => {
    try {
      const response = await api.delete(`/estaciones/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al eliminar estacion:", error);
      throw error;
    }
  },

  // ============================================
  // NUEVAS FUNCIONES - SISTEMA DE ALERTAS
  // ============================================

  // Registrar conteo de pasajeros (genera alerta automática si supera umbral)
  registrarConteo: async (id, pasajeros_actuales) => {
    try {
      const response = await api.post(`/estaciones/${id}/conteo`, {
        pasajeros_actuales,
      });
      return response.data;
    } catch (error) {
      console.error("Error al registrar conteo:", error);
      throw error;
    }
  },

  // Obtener buses disponibles en una estación (filtrados por línea)
  getBusesDisponibles: async (id) => {
    try {
      const response = await api.get(`/estaciones/${id}/buses-disponibles`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener buses disponibles:", error);
      throw error;
    }
  },
};

export default estacionService;
