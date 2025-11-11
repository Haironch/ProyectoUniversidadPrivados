// frontend/src/components/estaciones/EstacionList.jsx
import { useState, useEffect } from "react";
import estacionService from "../../services/estacionService";
import EstacionForm from "./EstacionForm";

const EstacionList = () => {
  const [estaciones, setEstaciones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedEstacionId, setSelectedEstacionId] = useState(null);

  useEffect(() => {
    fetchEstaciones();
  }, []);

  const fetchEstaciones = async () => {
    try {
      setLoading(true);
      const response = await estacionService.getEstaciones();
      setEstaciones(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar estaciones. Verifica que el backend este corriendo."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Eliminar la estación ${nombre}?`)) {
      try {
        await estacionService.deleteEstacion(id);
        alert("Estación eliminada");
        fetchEstaciones();
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error al eliminar";
        alert(errorMessage);
        console.error(err);
      }
    }
  };

  const handleCreate = () => {
    setSelectedEstacionId(null);
    setShowForm(true);
  };

  const handleEdit = (id) => {
    setSelectedEstacionId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedEstacionId(null);
  };

  const handleFormSuccess = () => {
    fetchEstaciones();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchEstaciones}
            className="mt-4 w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-green-600 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">Estaciones de Transmetro</h1>
              <p className="text-green-100 mt-1 text-sm">
                {estaciones.length} estaciones registradas
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-white text-green-600 px-4 py-2 rounded font-semibold hover:bg-green-50 w-full sm:w-auto"
            >
              Nueva Estación
            </button>
          </div>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Código
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Municipalidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Dirección
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Capacidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Accesos
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
              {estaciones.map((estacion) => (
                <tr key={estacion.id_estacion} className="hover:bg-gray-50">
                  <td className="px-6 py-4 text-sm font-medium text-gray-900">
                    {estacion.codigo}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-900">
                    {estacion.nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {estacion.municipalidad_nombre}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {estacion.direccion || "N/A"}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {estacion.capacidad_maxima}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {estacion.total_accesos || 0}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        estacion.estado === "operativa"
                          ? "bg-green-100 text-green-800"
                          : estacion.estado === "cerrada"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {estacion.estado.charAt(0).toUpperCase() +
                        estacion.estado.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(estacion.id_estacion)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(estacion.id_estacion, estacion.nombre)
                      }
                      className="text-red-600 hover:text-red-800"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="lg:hidden divide-y divide-gray-200">
          {estaciones.map((estacion) => (
            <div key={estacion.id_estacion} className="p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900">{estacion.nombre}</h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {estacion.codigo}
                  </p>
                  <p className="text-xs text-gray-500">
                    {estacion.municipalidad_nombre}
                  </p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ml-2 ${
                    estacion.estado === "operativa"
                      ? "bg-green-100 text-green-800"
                      : estacion.estado === "cerrada"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {estacion.estado.charAt(0).toUpperCase() +
                    estacion.estado.slice(1)}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Dirección:</span>
                  <span className="text-gray-900 truncate max-w-[180px]">
                    {estacion.direccion || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacidad:</span>
                  <span className="text-gray-900 font-medium">
                    {estacion.capacidad_maxima}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Accesos:</span>
                  <span className="px-2 py-0.5 bg-blue-100 text-blue-800 rounded-full text-xs font-semibold">
                    {estacion.total_accesos || 0}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button
                  onClick={() => handleEdit(estacion.id_estacion)}
                  className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100"
                >
                  Editar
                </button>
                <button
                  onClick={() =>
                    handleDelete(estacion.id_estacion, estacion.nombre)
                  }
                  className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm font-medium hover:bg-red-100"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {estaciones.length === 0 && (
          <div className="text-center py-12 px-4">
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
                  d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                />
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
            </div>
            <h3 className="text-sm font-medium text-gray-900">
              No hay estaciones
            </h3>
            <p className="text-sm text-gray-500 mt-1">
              Crea una nueva estación para empezar
            </p>
            <button
              onClick={handleCreate}
              className="mt-6 bg-green-600 text-white px-4 py-2 rounded font-semibold hover:bg-green-700"
            >
              Nueva Estación
            </button>
          </div>
        )}
      </div>

      {showForm && (
        <EstacionForm
          estacionId={selectedEstacionId}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default EstacionList;
