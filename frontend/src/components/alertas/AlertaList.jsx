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
        return "bg-red-100 text-red-800 border-red-200";
      case "alta":
        return "bg-orange-100 text-orange-800 border-orange-200";
      case "media":
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
      case "baja":
        return "bg-blue-100 text-blue-800 border-blue-200";
      default:
        return "bg-gray-100 text-gray-800 border-gray-200";
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

  if (loading && !alertas.length) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando alertas...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      {/* Resumen de alertas activas */}
      {alertasActivas && (
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
          <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
            <div className="text-sm text-red-600 font-medium">Críticas</div>
            <div className="text-3xl font-bold text-red-900">
              {alertasActivas.por_prioridad.critica}
            </div>
          </div>
          <div className="bg-orange-50 border-2 border-orange-200 rounded-lg p-4">
            <div className="text-sm text-orange-600 font-medium">
              Alta Prioridad
            </div>
            <div className="text-3xl font-bold text-orange-900">
              {alertasActivas.por_prioridad.alta}
            </div>
          </div>
          <div className="bg-yellow-50 border-2 border-yellow-200 rounded-lg p-4">
            <div className="text-sm text-yellow-600 font-medium">
              Media Prioridad
            </div>
            <div className="text-3xl font-bold text-yellow-900">
              {alertasActivas.por_prioridad.media}
            </div>
          </div>
          <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
            <div className="text-sm text-blue-600 font-medium">
              Baja Prioridad
            </div>
            <div className="text-3xl font-bold text-blue-900">
              {alertasActivas.por_prioridad.baja}
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-red-600 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Sistema de Alertas</h1>
            <p className="text-red-100 mt-1">
              Total de alertas: {alertas.length}
            </p>
          </div>
        </div>

        {/* Filtros */}
        <div className="p-4 bg-gray-50 border-b grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Filtrar por Estado
            </label>
            <select
              value={filtroEstado}
              onChange={(e) => setFiltroEstado(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
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
              Filtrar por Prioridad
            </label>
            <select
              value={filtroPrioridad}
              onChange={(e) => setFiltroPrioridad(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-red-500"
            >
              <option value="">Todas</option>
              <option value="critica">Crítica</option>
              <option value="alta">Alta</option>
              <option value="media">Media</option>
              <option value="baja">Baja</option>
            </select>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 m-4 rounded">
            {error}
          </div>
        )}

        <div className="overflow-x-auto">
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
                <tr key={alerta.id_alerta} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span
                      className={`px-3 py-1 rounded-full text-xs font-bold border ${getPrioridadColor(
                        alerta.prioridad
                      )}`}
                    >
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
                        <div className="text-gray-500">
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
                    {new Date(alerta.fecha_hora_generada).toLocaleString()}
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
      </div>
    </div>
  );
};

export default AlertaList;
