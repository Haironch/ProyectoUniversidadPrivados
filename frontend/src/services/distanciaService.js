// frontend/src/services/distanciaService.js
import api from "./api";

const distanciaService = {
  getDistanciaLinea: async (idLinea) => {
    try {
      const response = await api.get(`/distancias/linea/${idLinea}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener distancia de línea:", error);
      throw error;
    }
  },

  getDistanciasEstacionesLinea: async (idLinea) => {
    try {
      const response = await api.get(`/distancias/linea/${idLinea}/estaciones`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener distancias de estaciones:", error);
      throw error;
    }
  },

  getMatrizDistancias: async (idLinea) => {
    try {
      const response = await api.get(`/distancias/linea/${idLinea}/matriz`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener matriz de distancias:", error);
      throw error;
    }
  },

  getDistanciaEntreEstaciones: async (idLinea, idOrigen, idDestino) => {
    try {
      const response = await api.get(
        `/distancias/linea/${idLinea}/entre/${idOrigen}/${idDestino}`
      );
      return response.data;
    } catch (error) {
      console.error("Error al calcular distancia entre estaciones:", error);
      throw error;
    }
  },
};

export default distanciaService;
