// frontend/src/pages/home/HomePage.jsx
import { useState, useEffect } from "react";
import busService from "../../services/busService";
import lineaService from "../../services/lineaService";
import estacionService from "../../services/estacionService";
import logo from "../../assets/images/proyecto.png";

const HomePage = () => {
  const [stats, setStats] = useState({
    buses: 0,
    lineas: 0,
    estaciones: 0,
  });
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadStats();
    const savedUser = localStorage.getItem("transmetro_user");
    if (savedUser) {
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const loadStats = async () => {
    try {
      setLoading(true);
      const [busesRes, lineasRes, estacionesRes] = await Promise.all([
        busService.getBuses(),
        lineaService.getLineas(),
        estacionService.getEstaciones(),
      ]);

      setStats({
        buses: busesRes.data.length,
        lineas: lineasRes.data.length,
        estaciones: estacionesRes.data.length,
      });
    } catch (err) {
      console.error("Error al cargar estadisticas:", err);
    } finally {
      setLoading(false);
    }
  };

  const getCurrentGreeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return "Buenos días";
    if (hour < 18) return "Buenas tardes";
    return "Buenas noches";
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex items-center gap-4 mb-6">
            <img
              src={logo}
              alt="Transmetro"
              className="h-16 w-16 object-contain bg-white rounded-lg p-2 shadow"
            />
            <div>
              <h1 className="text-3xl font-bold text-gray-800">
                {getCurrentGreeting()}, {user?.nombre || user?.username}
              </h1>
              <p className="text-gray-600 mt-1">
                Bienvenido al sistema de gestión de Transmetro
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
            <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-blue-600 font-medium">
                    Total Buses
                  </p>
                  <p className="text-3xl font-bold text-blue-700 mt-2">
                    {stats.buses}
                  </p>
                </div>
                <div className="bg-blue-100 p-3 rounded-full">
                  <svg
                    className="w-8 h-8 text-blue-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-green-50 rounded-lg p-6 border border-green-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Total Líneas
                  </p>
                  <p className="text-3xl font-bold text-green-700 mt-2">
                    {stats.lineas}
                  </p>
                </div>
                <div className="bg-green-100 p-3 rounded-full">
                  <svg
                    className="w-8 h-8 text-green-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 10V3L4 14h7v7l9-11h-7z"
                    />
                  </svg>
                </div>
              </div>
            </div>

            <div className="bg-purple-50 rounded-lg p-6 border border-purple-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm text-purple-600 font-medium">
                    Total Estaciones
                  </p>
                  <p className="text-3xl font-bold text-purple-700 mt-2">
                    {stats.estaciones}
                  </p>
                </div>
                <div className="bg-purple-100 p-3 rounded-full">
                  <svg
                    className="w-8 h-8 text-purple-600"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Acerca del Sistema
            </h2>
            <p className="text-gray-600 mb-3">
              Este sistema permite gestionar de forma eficiente todos los
              recursos de Transmetro, incluyendo buses, líneas, estaciones y
              personal.
            </p>
            <ul className="space-y-2 text-gray-600">
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                Gestión de flotas de buses
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                Control de líneas y rutas
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                Administración de estaciones
              </li>
              <li className="flex items-center gap-2">
                <span className="text-blue-600">•</span>
                Seguimiento de personal operativo
              </li>
            </ul>
          </div>

          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-xl font-bold text-gray-800 mb-4">
              Información del Sistema
            </h2>
            <div className="space-y-3 text-gray-600">
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <svg
                  className="w-5 h-5 text-blue-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
                <span className="text-sm">Sistema en operación 24/7</span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <svg
                  className="w-5 h-5 text-green-600"
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
                <span className="text-sm">
                  Datos actualizados en tiempo real
                </span>
              </div>
              <div className="flex items-center gap-2 p-3 bg-gray-50 rounded">
                <svg
                  className="w-5 h-5 text-purple-600"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4"
                  />
                </svg>
                <span className="text-sm">Control total de operaciones</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;
