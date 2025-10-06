import api from "./api";

export const authService = {
  // Login
  login: async (username, password) => {
    try {
      const response = await api.post("/auth/login", {
        username,
        password,
      });
      return response.data;
    } catch (error) {
      console.error("Error al iniciar sesión:", error);
      throw error;
    }
  },

  // Logout
  logout: async () => {
    try {
      const response = await api.post("/auth/logout");
      return response.data;
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      throw error;
    }
  },

  // Verificar sesión
  verifySession: async () => {
    try {
      const response = await api.get("/auth/verify");
      return response.data;
    } catch (error) {
      console.error("Error al verificar sesión:", error);
      throw error;
    }
  },
};

export default authService;
