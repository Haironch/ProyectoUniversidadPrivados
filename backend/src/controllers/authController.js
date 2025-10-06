// backend/src/controllers/authController.js

// Credenciales hardcodeadas (temporal)
const VALID_CREDENTIALS = {
  username: "admin",
  password: "transmetro2025",
};

// Login
export const login = async (req, res) => {
  try {
    const { username, password } = req.body;

    // Validar que vengan los campos
    if (!username || !password) {
      return res.status(400).json({
        success: false,
        message: "Usuario y contraseña son requeridos",
      });
    }

    // Validar credenciales
    if (
      username === VALID_CREDENTIALS.username &&
      password === VALID_CREDENTIALS.password
    ) {
      // Login exitoso
      return res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso",
        data: {
          user: {
            username: username,
            role: "admin",
            nombre: "Administrador del Sistema",
          },
          // En producción aquí iría un JWT token
          token: "dummy-token-" + Date.now(),
        },
      });
    } else {
      // Credenciales incorrectas
      return res.status(401).json({
        success: false,
        message: "Usuario o contraseña incorrectos",
      });
    }
  } catch (error) {
    console.error("Error en login:", error);
    res.status(500).json({
      success: false,
      message: "Error en el servidor",
      error: error.message,
    });
  }
};

// Logout (opcional - por ahora solo confirma)
export const logout = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "Sesión cerrada exitosamente",
    });
  } catch (error) {
    console.error("Error en logout:", error);
    res.status(500).json({
      success: false,
      message: "Error al cerrar sesión",
      error: error.message,
    });
  }
};

// Verificar sesión (opcional)
export const verifySession = async (req, res) => {
  try {
    // Por ahora solo retorna éxito
    // En producción verificaría el token JWT
    res.status(200).json({
      success: true,
      message: "Sesión válida",
      data: {
        user: {
          username: "admin",
          role: "admin",
          nombre: "Administrador del Sistema",
        },
      },
    });
  } catch (error) {
    console.error("Error al verificar sesión:", error);
    res.status(500).json({
      success: false,
      message: "Error al verificar sesión",
      error: error.message,
    });
  }
};

export default {
  login,
  logout,
  verifySession,
};
