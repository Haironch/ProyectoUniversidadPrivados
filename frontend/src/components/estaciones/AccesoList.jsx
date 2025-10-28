// frontend/src/components/estaciones/AccesoList.jsx
import { useState, useEffect } from "react";
import accesoService from "../../services/accesoService";
import AccesoForm from "./AccesoForm";

const AccesoList = () => {
  const [accesos, setAccesos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedAccesoId, setSelectedAccesoId] = useState(null);

  useEffect(() => {
    fetchAccesos();
  }, []);

  const fetchAccesos = async () => {
    try {
      setLoading(true);
      const response = await accesoService.getAccesos();
      setAccesos(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar los accesos. Verifica que el backend este corriendo."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre) => {
    if (window.confirm(`¿Estas seguro de eliminar el acceso ${nombre}?`)) {
      try {
        await accesoService.deleteAcceso(id);
        alert("Acceso eliminado exitosamente");
        fetchAccesos();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error al eliminar el acceso";
        alert(errorMessage);
        console.error(err);
      }
    }
  };

  const handleCreate = () => {
    setSelectedAccesoId(null);
    setShowForm(true);
  };

  const handleEdit = (id) => {
    setSelectedAccesoId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedAccesoId(null);
  };

  const handleFormSuccess = () => {
    fetchAccesos();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Cargando accesos...
          </p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="bg-red-50 border border-red-200 rounded-lg p-4 sm:p-6 max-w-md w-full">
          <h3 className="text-red-800 font-semibold mb-2 text-sm sm:text-base">
            Error
          </h3>
          <p className="text-red-600 text-sm">{error}</p>
          <button
            onClick={fetchAccesos}
            className="mt-4 w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition text-sm"
          >
            Reintentar
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-4 sm:py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-orange-600 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Accesos de Estaciones
              </h1>
              <p className="text-orange-100 mt-1 text-sm">
                Total de accesos: {accesos.length}
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-white text-orange-600 px-4 py-2 rounded font-semibold hover:bg-orange-50 transition text-sm sm:text-base w-full sm:w-auto"
            >
              + Nuevo Acceso
            </button>
          </div>
        </div>

        {/* Vista Desktop - Tabla */}
        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Tipo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Horario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Guardias
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estado
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {accesos.map((acceso) => (
                <tr
                  key={acceso.id_acceso}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {acceso.estacion_nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {acceso.estacion_codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {acceso.nombre}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        acceso.tipo === "principal"
                          ? "bg-blue-100 text-blue-800"
                          : acceso.tipo === "secundario"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {acceso.tipo.charAt(0).toUpperCase() +
                        acceso.tipo.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {acceso.hora_apertura?.substring(0, 5)} -{" "}
                    {acceso.hora_cierre?.substring(0, 5)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {acceso.guardias_asignados > 0 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {acceso.guardias_asignados} guardia(s)
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin guardias</span>
                    )}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        acceso.esta_activo
                          ? "bg-green-100 text-green-800"
                          : "bg-red-100 text-red-800"
                      }`}
                    >
                      {acceso.esta_activo ? "Activo" : "Inactivo"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(acceso.id_acceso)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(acceso.id_acceso, acceso.nombre)
                      }
                      className="text-red-600 hover:text-red-900"
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Vista Móvil - Cards */}
        <div className="lg:hidden divide-y divide-gray-200">
          {accesos.map((acceso) => (
            <div
              key={acceso.id_acceso}
              className="p-4 hover:bg-gray-50 transition"
            >
              {/* Header de la Card */}
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base">
                    {acceso.nombre}
                  </h3>
                  <p className="text-xs text-gray-600 mt-0.5">
                    {acceso.estacion_nombre}
                  </p>
                  <p className="text-xs text-gray-500">
                    {acceso.estacion_codigo}
                  </p>
                </div>
                <div className="flex flex-col items-end gap-1 ml-2">
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      acceso.esta_activo
                        ? "bg-green-100 text-green-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {acceso.esta_activo ? "Activo" : "Inactivo"}
                  </span>
                  <span
                    className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ${
                      acceso.tipo === "principal"
                        ? "bg-blue-100 text-blue-800"
                        : acceso.tipo === "secundario"
                        ? "bg-gray-100 text-gray-800"
                        : "bg-red-100 text-red-800"
                    }`}
                  >
                    {acceso.tipo.charAt(0).toUpperCase() + acceso.tipo.slice(1)}
                  </span>
                </div>
              </div>

              {/* Detalles */}
              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Horario:</span>
                  <span className="text-gray-900 font-medium">
                    {acceso.hora_apertura?.substring(0, 5)} -{" "}
                    {acceso.hora_cierre?.substring(0, 5)}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Guardias:</span>
                  {acceso.guardias_asignados > 0 ? (
                    <span className="px-2 py-0.5 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                      {acceso.guardias_asignados}
                    </span>
                  ) : (
                    <span className="text-gray-400 text-xs">Sin guardias</span>
                  )}
                </div>
              </div>

              {/* Botones de Acción */}
              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100 transition">
                  Ver
                </button>
                <button
                  onClick={() => handleEdit(acceso.id_acceso)}
                  className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded text-sm font-medium hover:bg-green-100 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(acceso.id_acceso, acceso.nombre)}
                  className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm font-medium hover:bg-red-100 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Mensaje si no hay accesos */}
        {accesos.length === 0 && (
          <div className="text-center py-12 px-4">
            <svg
              className="mx-auto h-12 w-12 text-gray-400"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay accesos
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando un nuevo acceso.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-orange-600 hover:bg-orange-700"
              >
                + Nuevo Acceso
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <AccesoForm
          accesoId={selectedAccesoId}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default AccesoList;
