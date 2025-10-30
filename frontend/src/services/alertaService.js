// frontend/src/services/alertaService.js
import api from "./api";

const alertaService = {
  getAlertas: async (filtros = {}) => {
    try {
      const params = new URLSearchParams();
      if (filtros.estado) params.append("estado", filtros.estado);
      if (filtros.prioridad) params.append("prioridad", filtros.prioridad);

      const response = await api.get(`/alertas?${params.toString()}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener alertas:", error);
      throw error;
    }
  },

  getAlertasActivas: async () => {
    try {
      const response = await api.get("/alertas/activas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener alertas activas:", error);
      throw error;
    }
  },

  getEstadisticasAlertas: async () => {
    try {
      const response = await api.get("/alertas/estadisticas");
      return response.data;
    } catch (error) {
      console.error("Error al obtener estadísticas:", error);
      throw error;
    }
  },

  getAlertaById: async (id) => {
    try {
      const response = await api.get(`/alertas/${id}`);
      return response.data;
    } catch (error) {
      console.error("Error al obtener alerta:", error);
      throw error;
    }
  },

  createAlerta: async (data) => {
    try {
      const response = await api.post("/alertas", data);
      return response.data;
    } catch (error) {
      console.error("Error al crear alerta:", error);
      throw error;
    }
  },

  atenderAlerta: async (id, idOperador) => {
    try {
      const response = await api.patch(`/alertas/${id}/atender`, {
        id_operador: idOperador,
      });
      return response.data;
    } catch (error) {
      console.error("Error al atender alerta:", error);
      throw error;
    }
  },

  resolverAlerta: async (id, idOperador) => {
    try {
      const response = await api.patch(`/alertas/${id}/resolver`, {
        id_operador: idOperador,
      });
      return response.data;
    } catch (error) {
      console.error("Error al resolver alerta:", error);
      throw error;
    }
  },

  cancelarAlerta: async (id) => {
    try {
      const response = await api.patch(`/alertas/${id}/cancelar`);
      return response.data;
    } catch (error) {
      console.error("Error al cancelar alerta:", error);
      throw error;
    }
  },
};

export default alertaService;
