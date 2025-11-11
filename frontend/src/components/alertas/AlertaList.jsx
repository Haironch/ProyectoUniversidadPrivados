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
    if (window.confirm("¿Cancelar esta alerta?")) {
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
    const colores = {
      critica: "bg-red-50 text-red-700 border-red-200",
      alta: "bg-orange-50 text-orange-700 border-orange-200",
      media: "bg-yellow-50 text-yellow-700 border-yellow-200",
      baja: "bg-blue-50 text-blue-700 border-blue-200",
    };
    return colores[prioridad] || "bg-gray-50 text-gray-700 border-gray-200";
  };

  const getEstadoColor = (estado) => {
    const colores = {
      pendiente: "bg-red-50 text-red-700",
      en_atencion: "bg-yellow-50 text-yellow-700",
      resuelta: "bg-green-50 text-green-700",
      cancelada: "bg-gray-50 text-gray-700",
    };
    return colores[estado] || "bg-gray-50 text-gray-700";
  };

  if (loading && !alertas.length) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-3 sm:px-4 py-4 sm:py-8">
      {alertasActivas && (
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6">
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-600 mb-1">Críticas</div>
            <div className="text-3xl font-bold text-red-700">
              {alertasActivas.por_prioridad.critica}
            </div>
          </div>
          <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
            <div className="text-sm text-orange-600 mb-1">Alta</div>
            <div className="text-3xl font-bold text-orange-700">
              {alertasActivas.por_prioridad.alta}
            </div>
          </div>
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-600 mb-1">Media</div>
            <div className="text-3xl font-bold text-yellow-700">
              {alertasActivas.por_prioridad.media}
            </div>
          </div>
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 mb-1">Baja</div>
            <div className="text-3xl font-bold text-blue-700">
              {alertasActivas.por_prioridad.baja}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow">
        <div className="px-4 sm:px-6 py-4 bg-red-600 text-white rounded-t-lg">
          <h1 className="text-xl sm:text-2xl font-bold">Alertas del Sistema</h1>
          <p className="text-red-100 text-sm mt-1">
            {alertas.length} alertas registradas
          </p>
        </div>

        <div className="p-4 bg-gray-50 border-b">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                value={filtroEstado}
                onChange={(e) => setFiltroEstado(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
              >
                <option value="">Todos</option>
                <option value="pendiente">Pendiente</option>
                <option value="en_atencion">En Atención</option>
                <option value="resuelta">Resuelta</option>
                <option value="cancelada">Cancelada</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Prioridad
              </label>
              <select
                value={filtroPrioridad}
                onChange={(e) => setFiltroPrioridad(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
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
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded-lg">
            {error}
          </div>
        )}

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
                  Ubicación
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
                <tr key={alerta.id_alerta} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getPrioridadColor(
                        alerta.prioridad
                      )}`}
                    >
                      {alerta.prioridad.toUpperCase()}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {alerta.tipo_alerta.replace(/_/g, " ")}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900 max-w-xs">
                    {alerta.descripcion}
                  </td>
                  <td className="px-6 py-4 text-sm">
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
                        Bus {alerta.bus_numero}
                      </div>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {new Date(alerta.fecha_hora_generada).toLocaleDateString()}
                    <br />
                    <span className="text-xs">
                      {new Date(
                        alerta.fecha_hora_generada
                      ).toLocaleTimeString()}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(
                        alerta.estado
                      )}`}
                    >
                      {alerta.estado.replace(/_/g, " ")}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    {alerta.estado === "pendiente" && (
                      <button
                        onClick={() => handleAtender(alerta.id_alerta)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        Atender
                      </button>
                    )}
                    {(alerta.estado === "pendiente" ||
                      alerta.estado === "en_atencion") && (
                      <>
                        <button
                          onClick={() => handleResolver(alerta.id_alerta)}
                          className="text-green-600 hover:text-green-800"
                        >
                          Resolver
                        </button>
                        <button
                          onClick={() => handleCancelar(alerta.id_alerta)}
                          className="text-red-600 hover:text-red-800"
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

        <div className="lg:hidden divide-y divide-gray-200">
          {alertas.map((alerta) => (
            <div key={alerta.id_alerta} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-bold border ${getPrioridadColor(
                    alerta.prioridad
                  )}`}
                >
                  {alerta.prioridad.toUpperCase()}
                </span>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${getEstadoColor(
                    alerta.estado
                  )}`}
                >
                  {alerta.estado.replace(/_/g, " ")}
                </span>
              </div>

              <p className="text-xs text-gray-500 mb-2">
                {alerta.tipo_alerta.replace(/_/g, " ")}
              </p>

              <p className="text-sm text-gray-900 mb-3 bg-gray-50 p-2 rounded">
                {alerta.descripcion}
              </p>

              <div className="space-y-1 mb-3 text-sm">
                {alerta.estacion_nombre && (
                  <div className="flex justify-between">
                    <span className="text-gray-500">Estación:</span>
                    <span className="text-gray-900 font-medium">
                      {alerta.estacion_nombre}
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

              <div className="flex gap-2">
                {alerta.estado === "pendiente" && (
                  <button
                    onClick={() => handleAtender(alerta.id_alerta)}
                    className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-blue-100"
                  >
                    Atender
                  </button>
                )}
                {(alerta.estado === "pendiente" ||
                  alerta.estado === "en_atencion") && (
                  <>
                    <button
                      onClick={() => handleResolver(alerta.id_alerta)}
                      className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-green-100"
                    >
                      Resolver
                    </button>
                    <button
                      onClick={() => handleCancelar(alerta.id_alerta)}
                      className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded-lg text-sm font-medium hover:bg-red-100"
                    >
                      Cancelar
                    </button>
                  </>
                )}
              </div>
            </div>
          ))}
        </div>

        {alertas.length === 0 && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-2">
              <svg
                className="mx-auto h-12 w-12"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
                />
              </svg>
            </div>
            <h3 className="text-lg font-medium text-gray-900">Sin alertas</h3>
            <p className="text-sm text-gray-500 mt-1">
              No hay alertas pendientes
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AlertaList;
