// frontend/src/App.jsx
import { useState, useEffect } from "react";
import BusesPage from "./pages/buses/BusesPage";
import LineasPage from "./pages/lineas/LineasPage";
import EstacionesPage from "./pages/estaciones/EstacionesPage";
import PilotosPage from "./pages/personal/PilotosPage";
import AccesosPage from "./pages/estaciones/AccesosPage";
import GuardiasPage from "./pages/personal/GuardiasPage";
import OperadoresPage from "./pages/personal/OperadoresPage";
import DistanciasPage from "./pages/lineas/DistanciasPage";
import AlertasPage from "./pages/alertas/AlertasPage";
import AccesosLineaPage from "./pages/lineas/AccesosLineaPage";
import LoginPage from "./pages/auth/LoginPage";
import logo from "./assets/images/proyecto.png";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);
  const [currentPage, setCurrentPage] = useState("buses");
  const [showWelcome, setShowWelcome] = useState(false);

  // Verificar si hay sesión guardada al cargar
  useEffect(() => {
    const savedUser = localStorage.getItem("transmetro_user");
    const savedToken = localStorage.getItem("transmetro_token");

    if (savedUser && savedToken) {
      setUser(JSON.parse(savedUser));
      setIsAuthenticated(true);
    }
  }, []);

  // Manejar login exitoso
  const handleLoginSuccess = (userData) => {
    setUser(userData);
    setIsAuthenticated(true);
    setShowWelcome(true);

    // Ocultar alerta después de 3 segundos
    setTimeout(() => {
      setShowWelcome(false);
    }, 3000);
  };

  // Manejar logout
  const handleLogout = () => {
    localStorage.removeItem("transmetro_user");
    localStorage.removeItem("transmetro_token");
    setUser(null);
    setIsAuthenticated(false);
    setCurrentPage("buses");
  };

  // Si no está autenticado, mostrar login
  if (!isAuthenticated) {
    return <LoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  // Si está autenticado, mostrar el sistema
  return (
    <div className="App min-h-screen bg-gray-50">
      {/* Alerta de Bienvenida */}
      {showWelcome && (
        <div className="fixed top-4 right-4 z-50 animate-fade-in-down">
          <div className="bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg flex items-center gap-3">
            <svg
              className="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
              />
            </svg>
            <div>
              <p className="font-semibold">
                Bienvenido, {user?.nombre || user?.username}
              </p>
              <p className="text-sm text-green-100">
                Sesión iniciada correctamente
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between py-3">
            {/* Logo y Título */}
            <div className="flex items-center space-x-3">
              <img
                src={logo}
                alt="Transmetro Logo"
                className="h-10 sm:h-12 w-auto object-contain bg-white rounded-lg p-1 shadow-md"
              />
              <div className="hidden sm:block">
                <h1 className="text-lg sm:text-xl font-bold">
                  Sistema Transmetro
                </h1>
                <p className="text-xs text-blue-100">Gestión de Transporte</p>
              </div>
            </div>

            {/* Botón Cerrar Sesión (siempre visible a la derecha) */}
            <button
              onClick={handleLogout}
              className="px-3 sm:px-4 py-2 bg-red-500 hover:bg-red-600 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-md flex items-center gap-2"
            >
              <svg
                className="w-4 h-4"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                />
              </svg>
              <span className="hidden sm:inline">Cerrar Sesión</span>
            </button>
          </div>

          {/* Botones de navegación (segunda fila) */}
          <div className="pb-3 overflow-x-auto">
            <div className="bg-blue-800 rounded-xl p-3 shadow-inner">
              <div className="flex gap-2 min-w-max">
                <button
                  onClick={() => setCurrentPage("buses")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "buses"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Buses
                </button>
                <button
                  onClick={() => setCurrentPage("lineas")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "lineas"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Líneas
                </button>
                <button
                  onClick={() => setCurrentPage("estaciones")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "estaciones"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Estaciones
                </button>
                <button
                  onClick={() => setCurrentPage("pilotos")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "pilotos"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Pilotos
                </button>
                <button
                  onClick={() => setCurrentPage("accesos")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "accesos"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Accesos
                </button>
                <button
                  onClick={() => setCurrentPage("guardias")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "guardias"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Guardias
                </button>
                <button
                  onClick={() => setCurrentPage("operadores")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "operadores"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Operadores
                </button>
                <button
                  onClick={() => setCurrentPage("distancias")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "distancias"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Distancias
                </button>
                <button
                  onClick={() => setCurrentPage("alertas")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "alertas"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Alertas
                </button>
                <button
                  onClick={() => setCurrentPage("accesos-linea")}
                  className={`px-3 py-2 rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "accesos-linea"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Accesos/Línea
                </button>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <main className="min-h-screen">
        {currentPage === "buses" && <BusesPage />}
        {currentPage === "lineas" && <LineasPage />}
        {currentPage === "estaciones" && <EstacionesPage />}
        {currentPage === "pilotos" && <PilotosPage />}
        {currentPage === "accesos" && <AccesosPage />}
        {currentPage === "guardias" && <GuardiasPage />}
        {currentPage === "operadores" && <OperadoresPage />}
        {currentPage === "distancias" && <DistanciasPage />}
        {currentPage === "alertas" && <AlertasPage />}
        {currentPage === "accesos-linea" && <AccesosLineaPage />}
      </main>

      <style>{`
        @keyframes fade-in-down {
          from {
            opacity: 0;
            transform: translateY(-20px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-down {
          animation: fade-in-down 0.3s ease-out;
        }
      `}</style>
    </div>
  );
}

export default App;
