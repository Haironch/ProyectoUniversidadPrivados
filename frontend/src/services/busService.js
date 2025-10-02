// frontend/src/services/busService.js
import api from "./api";

export const busService = {
  // Obtener todos los buses con sus pilotos
  getBusesConPilotos: async () => {
    try {
      const response = await api.get("/buses/pilotos");
      return response.data;
    } catch (error) {
      console.error("Error al obtener buses con pilotos:", error);
      throw error;
    }
  },
};

export default busService;
