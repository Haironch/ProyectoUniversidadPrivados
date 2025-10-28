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
      {/* Alerta de Bienvenida - Responsive */}
      {showWelcome && (
        <div className="fixed top-2 sm:top-4 right-2 sm:right-4 left-2 sm:left-auto z-50 animate-fade-in-down">
          <div className="bg-green-500 text-white px-4 sm:px-6 py-2 sm:py-3 rounded-lg shadow-lg flex items-center gap-2 sm:gap-3">
            <svg
              className="w-5 h-5 sm:w-6 sm:h-6 flex-shrink-0"
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
            <div className="flex-1 min-w-0">
              <p className="font-semibold text-sm sm:text-base truncate">
                Bienvenido, {user?.nombre || user?.username}
              </p>
              <p className="text-xs sm:text-sm text-green-100">
                Sesión iniciada
              </p>
            </div>
          </div>
        </div>
      )}

      <nav className="bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg sticky top-0 z-40">
        <div className="container mx-auto px-3 sm:px-4">
          {/* Primera fila: Logo y Cerrar Sesión */}
          <div className="flex items-center justify-between py-2 sm:py-3">
            {/* Logo y Título */}
            <div className="flex items-center space-x-2 sm:space-x-3 min-w-0 flex-1">
              <img
                src={logo}
                alt="Transmetro Logo"
                className="h-8 sm:h-10 md:h-12 w-auto object-contain bg-white rounded-lg p-0.5 sm:p-1 shadow-md flex-shrink-0"
              />
              <div className="hidden xs:block min-w-0">
                <h1 className="text-sm sm:text-lg md:text-xl font-bold truncate">
                  Sistema Transmetro
                </h1>
                <p className="text-xs text-blue-100 hidden sm:block">
                  Gestión de Transporte
                </p>
              </div>
            </div>

            {/* Botón Cerrar Sesión */}
            <button
              onClick={handleLogout}
              className="px-2 sm:px-3 md:px-4 py-1.5 sm:py-2 bg-red-500 hover:bg-red-600 rounded-lg text-xs sm:text-sm font-medium transition-all shadow-md flex items-center gap-1 sm:gap-2 flex-shrink-0"
            >
              <svg
                className="w-3.5 h-3.5 sm:w-4 sm:h-4"
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
              <span className="hidden xs:inline">Salir</span>
            </button>
          </div>

          {/* Segunda fila: Navegación con scroll horizontal */}
          <div className="pb-2 sm:pb-3 -mx-3 sm:mx-0 px-3 sm:px-0">
            <div className="bg-blue-800 rounded-lg sm:rounded-xl p-2 sm:p-3 shadow-inner overflow-x-auto scrollbar-thin">
              <div className="flex gap-1.5 sm:gap-2 min-w-max">
                <button
                  onClick={() => setCurrentPage("buses")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "buses"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Buses
                </button>
                <button
                  onClick={() => setCurrentPage("lineas")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "lineas"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Líneas
                </button>
                <button
                  onClick={() => setCurrentPage("estaciones")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "estaciones"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Estaciones
                </button>
                <button
                  onClick={() => setCurrentPage("pilotos")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "pilotos"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Pilotos
                </button>
                <button
                  onClick={() => setCurrentPage("accesos")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "accesos"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Accesos
                </button>
                <button
                  onClick={() => setCurrentPage("guardias")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "guardias"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Guardias
                </button>
                <button
                  onClick={() => setCurrentPage("operadores")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "operadores"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Operadores
                </button>
                <button
                  onClick={() => setCurrentPage("distancias")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "distancias"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Distancias
                </button>
                <button
                  onClick={() => setCurrentPage("alertas")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
                    currentPage === "alertas"
                      ? "bg-white text-blue-600 shadow-md"
                      : "hover:bg-blue-500"
                  }`}
                >
                  Alertas
                </button>
                <button
                  onClick={() => setCurrentPage("accesos-linea")}
                  className={`px-2.5 sm:px-3 py-1.5 sm:py-2 rounded-md sm:rounded-lg text-xs sm:text-sm font-medium transition-all whitespace-nowrap ${
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
        
        /* Scrollbar personalizado para navegación */
        .scrollbar-thin::-webkit-scrollbar {
          height: 4px;
        }
        .scrollbar-thin::-webkit-scrollbar-track {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb {
          background: rgba(255, 255, 255, 0.3);
          border-radius: 10px;
        }
        .scrollbar-thin::-webkit-scrollbar-thumb:hover {
          background: rgba(255, 255, 255, 0.5);
        }
        
        /* Breakpoint personalizado xs (475px) */
        @media (min-width: 475px) {
          .xs\:block {
            display: block;
          }
          .xs\:inline {
            display: inline;
          }
        }
      `}</style>
    </div>
  );
}

export default App;
