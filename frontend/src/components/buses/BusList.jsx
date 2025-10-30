// frontend/src/components/buses/BusList.jsx
import { useState, useEffect } from "react";
import busService from "../../services/busService";
import BusForm from "./BusForm";

const BusList = () => {
  const [buses, setBuses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedBusId, setSelectedBusId] = useState(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [busToDelete, setBusToDelete] = useState(null);
  const [deleteDependencies, setDeleteDependencies] = useState(null);

  useEffect(() => {
    fetchBuses();
  }, []);

  const fetchBuses = async () => {
    try {
      setLoading(true);
      const response = await busService.getBuses();
      setBuses(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar los buses. Verifica que el backend este corriendo."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, numeroUnidad) => {
    try {
      await busService.deleteBus(id);
      alert("Bus eliminado exitosamente");
      fetchBuses();
    } catch (err) {
      if (err.response?.data?.dependencies) {
        setBusToDelete({ id, numeroUnidad });
        setDeleteDependencies(err.response.data.dependencies);
        setShowDeleteModal(true);
      } else {
        alert(err.response?.data?.message || "Error al eliminar el bus");
      }
    }
  };

  const handleDesactivar = async () => {
    try {
      await busService.desactivarBus(busToDelete.id);
      alert("Bus desactivado exitosamente");
      setShowDeleteModal(false);
      setBusToDelete(null);
      setDeleteDependencies(null);
      fetchBuses();
    } catch (err) {
      alert(err.response?.data?.message || "Error al desactivar el bus");
    }
  };

  const handleCreate = () => {
    setSelectedBusId(null);
    setShowForm(true);
  };

  const handleEdit = (id) => {
    setSelectedBusId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedBusId(null);
  };

  const handleFormSuccess = () => {
    fetchBuses();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen px-4">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600 text-sm sm:text-base">
            Cargando buses...
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
            onClick={fetchBuses}
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
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-xl sm:text-2xl font-bold">
                Buses de Transmetro
              </h1>
              <p className="text-blue-100 mt-1 text-sm">
                Total de buses: {buses.length}
              </p>
            </div>
            <button
              onClick={handleCreate}
              className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50 transition text-sm sm:text-base w-full sm:w-auto"
            >
              + Nuevo Bus
            </button>
          </div>
        </div>

        <div className="hidden lg:block overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Unidad
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Placa
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Modelo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Línea
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Parqueo
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Capacidad
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
              {buses.map((bus) => (
                <tr key={bus.id_bus} className="hover:bg-gray-50 transition">
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {bus.numero_unidad}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {bus.placa}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.modelo || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.linea_nombre ? (
                      <span className="text-blue-600 font-medium">
                        {bus.linea_codigo} - {bus.linea_nombre}
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin asignar</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
                    {bus.parqueo_nombre || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {bus.capacidad_maxima}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        bus.estado === "operativo"
                          ? "bg-green-100 text-green-800"
                          : bus.estado === "fuera_servicio"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {bus.estado === "operativo"
                        ? "Operativo"
                        : bus.estado === "fuera_servicio"
                        ? "Fuera de Servicio"
                        : "Mantenimiento"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(bus.id_bus)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(bus.id_bus, bus.numero_unidad)
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

        <div className="lg:hidden divide-y divide-gray-200">
          {buses.map((bus) => (
            <div key={bus.id_bus} className="p-4 hover:bg-gray-50 transition">
              <div className="flex items-start justify-between mb-3">
                <div className="flex-1">
                  <h3 className="font-bold text-gray-900 text-base">
                    {bus.numero_unidad}
                  </h3>
                  <p className="text-sm text-gray-600">{bus.placa}</p>
                </div>
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold whitespace-nowrap ml-2 ${
                    bus.estado === "operativo"
                      ? "bg-green-100 text-green-800"
                      : bus.estado === "fuera_servicio"
                      ? "bg-red-100 text-red-800"
                      : "bg-yellow-100 text-yellow-800"
                  }`}
                >
                  {bus.estado === "operativo"
                    ? "Operativo"
                    : bus.estado === "fuera_servicio"
                    ? "Fuera"
                    : "Mant."}
                </span>
              </div>

              <div className="space-y-2 mb-3">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Modelo:</span>
                  <span className="text-gray-900 font-medium">
                    {bus.modelo || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Línea:</span>
                  {bus.linea_nombre ? (
                    <span className="text-blue-600 font-medium">
                      {bus.linea_codigo}
                    </span>
                  ) : (
                    <span className="text-gray-400">Sin asignar</span>
                  )}
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Parqueo:</span>
                  <span className="text-gray-900 truncate max-w-[180px]">
                    {bus.parqueo_nombre || "N/A"}
                  </span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Capacidad:</span>
                  <span className="text-gray-900 font-medium">
                    {bus.capacidad_maxima}
                  </span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100 transition">
                  Ver
                </button>
                <button
                  onClick={() => handleEdit(bus.id_bus)}
                  className="flex-1 bg-green-50 text-green-600 px-3 py-2 rounded text-sm font-medium hover:bg-green-100 transition"
                >
                  Editar
                </button>
                <button
                  onClick={() => handleDelete(bus.id_bus, bus.numero_unidad)}
                  className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm font-medium hover:bg-red-100 transition"
                >
                  Eliminar
                </button>
              </div>
            </div>
          ))}
        </div>

        {buses.length === 0 && (
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
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            <h3 className="mt-2 text-sm font-medium text-gray-900">
              No hay buses
            </h3>
            <p className="mt-1 text-sm text-gray-500">
              Comienza creando un nuevo bus.
            </p>
            <div className="mt-6">
              <button
                onClick={handleCreate}
                className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700"
              >
                + Nuevo Bus
              </button>
            </div>
          </div>
        )}
      </div>

      {showForm && (
        <BusForm
          busId={selectedBusId}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}

      {showDeleteModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg
                  className="h-6 w-6 text-red-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                  />
                </svg>
              </div>

              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                No se puede eliminar el bus {busToDelete?.numeroUnidad}
              </h3>

              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
                <p className="text-sm text-gray-700 mb-3">
                  Este bus tiene registros asociados:
                </p>
                <ul className="text-sm text-gray-800 space-y-1">
                  {deleteDependencies?.detalles.map((detalle, index) => (
                    <li key={index} className="flex items-center gap-2">
                      <span className="text-yellow-600">•</span>
                      {detalle}
                    </li>
                  ))}
                </ul>
              </div>

              <p className="text-sm text-gray-600 mb-6">
                <strong>Sugerencia:</strong> Puedes desactivar el bus para que
                ya no aparezca en operaciones activas, pero se mantendrá el
                historial.
              </p>

              <div className="flex gap-3">
                <button
                  onClick={() => {
                    setShowDeleteModal(false);
                    setBusToDelete(null);
                    setDeleteDependencies(null);
                  }}
                  className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition font-medium"
                >
                  Cancelar
                </button>
                <button
                  onClick={handleDesactivar}
                  className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 transition font-medium"
                >
                  Desactivar Bus
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default BusList;
