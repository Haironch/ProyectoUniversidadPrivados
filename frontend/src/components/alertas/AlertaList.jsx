// frontend/src/components/alertas/AlertaList.jsx
import { useState, useEffect } from "react";
import alertaService from "../../services/alertaService";

const AlertaList = () => {
  const [alertas, setAlertas] = useState([]);
  const [alertasActivas, setAlertasActivas] = useState(null);
  const [estadisticas, setEstadisticas] = useState(null);
  const [filtroEstado, setFiltroEstado] = useState("");
  const [filtroPrioridad, setFiltroPrioridad] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
    // Actualizar cada 30 segundos
    const interval = setInterval(fetchData, 30000);
    return () => clearInterval(interval);
  }, [filtroEstado, filtroPrioridad]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [resAlertas, resActivas, resEstadisticas] = await Promise.all([
        alertaService.getAlertas({
          estado: filtroEstado,
          prioridad: filtroPrioridad,
        }),
        alertaService.getAlertasActivas(),
        alertaService.getEstadisticasAlertas(),
      ]);

      setAlertas(resAlertas.data);
      setAlertasActivas(resActivas);
      setEstadisticas(resEstadisticas.data);
      setError(null);
    } catch (err) {
      setError("Error al cargar alertas");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAtender = async (id) => {
    try {
      await alertaService.atenderAlerta(id, null);
      fetchData();
    } catch (err) {
      alert("Error al atender alerta");
      console.error(err);
    }
  };

  const handleResolver = async (id) => {
    try {
      await alertaService.resolverAlerta(id, null);
      fetchData();
    } catch (err) {
      alert("Error al resolver alerta");
      console.error(err);
    }
  };

  const handleCancelar = async (id) => {
    if (window.confirm("¿Estás seguro de cancelar esta alerta?")) {
      try {
        await alertaService.cancelarAlerta(id);
        fetchData();
      } catch (err) {
        alert("Error al cancelar alerta");
        console.error(err);
      }
    }
  };

  const getPrioridadColor = (prioridad) => {
    switch (prioridad) {
      case "critica":
        return "bg-red-100 text-red-800 border-red-300";
      case "alta":
        return "bg-orange-100 text-orange-800 border-orange-300";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-300";
      case "baja":
        return "bg-blue-100 text-blue-800 border-blue-300";
      default:
        return "bg-gray-100 text-gray-800 border-gray-300";
    }
  };

  const getEstadoColor = (estado) => {
    switch (estado) {
      case "pendiente":
        return "bg-red-100 text-red-800";
      case "en_atencion":
        return "bg-yellow-100 text-yellow-800";
      case "resuelta":
        return "bg-green-100 text-green-800";
      case "cancelada":
        return "bg-gray-100 text-gray-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getPrioridadIcon = (prioridad) => {
    switch (prioridad) {
      case "critica":
        return "🚨";
      case "alta":
        return "⚠️";
      case "media":
        return "⚡";
      case "baja":
        return "ℹ️";
      default:
        return "•";
    }
  };

  if (loading && !alertas.length) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Cargando alertas...
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {/* Resumen de alertas activas - Responsive Grid */}
      {alertasActivas && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-4 sm:mb-6">
          <div className="bg-gradient-to-br from-red-50 to-red-100 border-2 border-red-300 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-red-600 font-medium">
                Críticas
              </div>
              <span className="text-xl">🚨</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-red-900">
              {alertasActivas.por_prioridad.critica}
            </div>
          </div>
          <div className="bg-gradient-to-br from-orange-50 to-orange-100 border-2 border-orange-300 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-orange-600 font-medium">
                Alta
              </div>
              <span className="text-xl">⚠️</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-orange-900">
              {alertasActivas.por_prioridad.alta}
            </div>
          </div>
          <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-2 border-yellow-300 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-yellow-600 font-medium">
                Media
              </div>
              <span className="text-xl">⚡</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-yellow-900">
              {alertasActivas.por_prioridad.media}
            </div>
          </div>
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 border-2 border-blue-300 rounded-xl p-3 sm:p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-center justify-between mb-2">
              <div className="text-xs sm:text-sm text-blue-600 font-medium">
                Baja
              </div>
              <span className="text-xl">ℹ️</span>
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-blue-900">
              {alertasActivas.por_prioridad.baja}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-gradient-to-r from-red-600 to-red-700 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-2">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold flex items-center gap-2">
                <span>🔔</span> Sistema de Alertas
              </h1>
              <p className="text-red-100 mt-1 text-xs sm:text-sm">
                Total de alertas: {alertas.length} • Actualización automática
              </p>
            </div>
          </div>
        </div>

        {/* Filtros - Responsive */}
        <div className="p-3 sm:p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Filtrar por Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_atencion">En Atención</option>
                <option value="resuelta">Resuelta</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Filtrar por Prioridad
              </label>
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todas</option>
                <option value="critica">Crítica</option>
                <option value="alta">Alta</option>
                <option value="media">Media</option>
                <option value="baja">Baja</option>
              </select>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 m-3 sm:m-4 rounded-lg text-sm">
            {error}
          </div>
        )}

        {/* Vista Desktop - Tabla */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Prioridad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Descripción
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estación/Bus
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Fecha
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {alertas.map((alerta) => (
                <tr
                  key={alerta.id_alerta}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border-2 inline-flex items-center gap-1 ${getPrioridadColor(
                        alerta.prioridad
                      )}`}
                    >
                      <span>{getPrioridadIcon(alerta.prioridad)}</span>
                      {alerta.prioridad.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {alerta.tipo_alerta.replace(/_/g, " ")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    {alerta.descripcion}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    {alerta.estacion_nombre && (
                      <div>
                        <div className="font-medium text-gray-900">
                          {alerta.estacion_nombre}
                        </div>
                        <div className="text-gray-500 text-xs">
                          {alerta.estacion_codigo}
                        </div>
                      </div>
                    )}
                    {alerta.bus_numero && (
                      <div className="text-gray-500">
                        Bus: {alerta.bus_numero}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {new Date(alerta.fecha_hora_generada).toLocaleDateString()}
                    <br />
                    <span className="text-xs">
                      {new Date(
                        alerta.fecha_hora_generada
                      ).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(
                        alerta.estado
                      )}`}
                    >
                      {alerta.estado.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    {alerta.estado === "pendiente" && (
                      <button
                        onClick={() => handleAtender(alerta.id_alerta)}
                        className="text-blue-600 hover:text-blue-900"
                      >
                        Atender
                      </button>
                    )}
                    {(alerta.estado === "pendiente" ||
                      alerta.estado === "en_atencion") && (
                      <>
                        <button
                          onClick={() => handleResolver(alerta.id_alerta)}
                          className="text-green-600 hover:text-green-900"
                        >
                          Resolver
                        </button>
                        <button
                          onClick={() => handleCancelar(alerta.id_alerta)}
                          className="text-red-600 hover:text-red-900"
                        >
                          Cancelar
                        </button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista Móvil - Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {alertas.map((alerta) => (
            <div
              key={alerta.id_alerta}
              className="p-4 hover:bg-gray-50 transition"
            >
              {/* Header Card */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <span
                    className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold border-2 ${getPrioridadColor(
                      alerta.prioridad
                    )}`}
                  >
                    <span>{getPrioridadIcon(alerta.prioridad)}</span>
                    {alerta.prioridad.toUpperCase()}
                  </span>
                  <p className="text-xs text-gray-500 mt-2">
                    {alerta.tipo_alerta.replace(/_/g, " ")}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${getEstadoColor(
                    alerta.estado
                  )}`}
                >
                  {alerta.estado.replace(/_/g, " ")}
                </span>
              </div>

              {/* Descripción */}
              <p className="text-sm text-gray-900 mb-3 bg-gray-50 p-2 rounded">
                {alerta.descripcion}
              </p>

              {/* Detalles */}
              <div className="space-y-2 mb-3 text-sm">
                {alerta.estacion_nombre && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estación:</span>
                    <span className="text-gray-900 font-medium text-right">
                      {alerta.estacion_nombre}
                      <span className="text-xs text-gray-500 ml-1">
                        ({alerta.estacion_codigo})
                      </span>
                    </span>
                  </div>
                )}
                {alerta.bus_numero && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Bus:</span>
                    <span className="text-gray-900 font-medium">
                      {alerta.bus_numero}
                    </span>
                  </div>
                )}
                <div className="flex justify-between">
                  <span className="text-gray-500">Fecha:</span>
                  <span className="text-gray-900 text-xs">
                    {new Date(alerta.fecha_hora_generada).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2">
                {alerta.estado === "pendiente" && (
                  <button
                    onClick={() => handleAtender(alerta.id_alerta)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100 transition"
                  >
                    Atender
                  </button>
                )}
                {(alerta.estado === "pendiente" ||
                  alerta.estado === "en_atencion") && (
                  <>
                    <button
                      onClick={() => handleResolver(alerta.id_alerta)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100 transition"
                    >
                      Resolver
                    </button>
                    <button
                      onClick={() => handleCancelar(alerta.id_alerta)}
                      className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100 transition"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Sin alertas */}
        {alertas.length === 0 && (
          <div className="text-center py-12 px-4">
            <div className="text-6xl mb-4">✅</div>
            <h3 className="text-lg font-medium text-gray-900">Todo en orden</h3>
            <p className="mt-1 text-sm text-gray-500">
              No hay alertas activas en este momento
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertaList;
