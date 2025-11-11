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
        "Error al cargar buses. Verifica que el backend este corriendo."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const attemptDelete = async (id, numeroUnidad) => {
    try {
      await busService.deleteBus(id);
      alert("Bus eliminado");
      fetchBuses();
    } catch (err) {
      if (err.response?.data?.dependencies) {
        setBusToDelete({ id, numeroUnidad });
        setDeleteDependencies(err.response.data.dependencies);
        setShowDeleteModal(true);
      } else {
        alert(err.response?.data?.message || "Error al eliminar");
      }
    }
  };

  const confirmDeactivation = async () => {
    if (!busToDelete) return;
    try {
      await busService.desactivarBus(busToDelete.id);
      alert("Bus desactivado");
      closeDeleteModal();
      fetchBuses();
    } catch (err) {
      alert(err.response?.data?.message || "Error al desactivar");
    }
  };

  const openCreateForm = () => {
    setSelectedBusId(null);
    setShowForm(true);
  };

  const openEditForm = (id) => {
    setSelectedBusId(id);
    setShowForm(true);
  };

  const closeForm = () => {
    setShowForm(false);
    setSelectedBusId(null);
  };

  const refreshListAfterSave = () => {
    fetchBuses();
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setBusToDelete(null);
    setDeleteDependencies(null);
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message={error} onRetry={fetchBuses} />;
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-center gap-3">
            <div>
              <h1 className="text-2xl font-bold">Buses de Transmetro</h1>
              <p className="text-blue-100 mt-1 text-sm">
                {buses.length} buses registrados
              </p>
            </div>
            <button
              onClick={openCreateForm}
              className="bg-white text-blue-600 px-4 py-2 rounded font-semibold hover:bg-blue-50 w-full sm:w-auto"
            >
              Nuevo Bus
            </button>
          </div>
        </div>

        {buses.length > 0 ? (
          <>
            <div className="hidden lg:block overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Unidad
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Placa
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Modelo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Línea
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Parqueo
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                      Capacidad
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
                  {buses.map((bus) => (
                    <BusTableRow
                      key={bus.id_bus}
                      bus={bus}
                      onEdit={openEditForm}
                      onDelete={attemptDelete}
                    />
                  ))}
                </tbody>
              </table>
            </div>

            <div className="lg:hidden divide-y divide-gray-200">
              {buses.map((bus) => (
                <BusCard
                  key={bus.id_bus}
                  bus={bus}
                  onEdit={openEditForm}
                  onDelete={attemptDelete}
                />
              ))}
            </div>
          </>
        ) : (
          <EmptyState onCreate={openCreateForm} />
        )}
      </div>

      {showForm && (
        <BusForm
          busId={selectedBusId}
          onClose={closeForm}
          onSuccess={refreshListAfterSave}
        />
      )}

      {showDeleteModal && (
        <DeleteDependencyModal
          bus={busToDelete}
          dependencies={deleteDependencies}
          onClose={closeDeleteModal}
          onConfirm={confirmDeactivation}
        />
      )}
    </div>
  );
};

export default BusList;

const LoadingSpinner = () => (
  <div className="flex justify-center items-center min-h-screen px-4">
    <div className="text-center">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
      <p className="text-gray-600">Cargando...</p>
    </div>
  </div>
);

const ErrorMessage = ({ message, onRetry }) => (
  <div className="flex justify-center items-center min-h-screen px-4">
    <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md w-full">
      <h3 className="text-red-800 font-semibold mb-2">Error</h3>
      <p className="text-red-600 text-sm">{message}</p>
      <button
        onClick={onRetry}
        className="mt-4 w-full sm:w-auto bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
      >
        Reintentar
      </button>
    </div>
  </div>
);

const EmptyState = ({ onCreate }) => (
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
          d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
        />
      </svg>
    </div>
    <h3 className="text-sm font-medium text-gray-900">No hay buses</h3>
    <p className="text-sm text-gray-500 mt-1">
      Crea un nuevo bus para comenzar
    </p>
    <button
      onClick={onCreate}
      className="mt-6 bg-blue-600 text-white px-4 py-2 rounded font-semibold hover:bg-blue-700"
    >
      Nuevo Bus
    </button>
  </div>
);

const BusStatusBadge = ({ estado }) => {
  const statusMap = {
    operativo: {
      text: "Operativo",
      className: "bg-green-100 text-green-800",
      mobileText: "Oper.",
    },
    fuera_servicio: {
      text: "Fuera de Servicio",
      className: "bg-red-100 text-red-800",
      mobileText: "Fuera",
    },
    mantenimiento: {
      text: "Mantenimiento",
      className: "bg-yellow-100 text-yellow-800",
      mobileText: "Mant.",
    },
  };

  const status = statusMap[estado] || statusMap.mantenimiento;

  return (
    <>
      <span
        className={`lg:hidden px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}
      >
        {status.mobileText}
      </span>
      <span
        className={`hidden lg:inline-block px-2 py-1 rounded-full text-xs font-semibold ${status.className}`}
      >
        {status.text}
      </span>
    </>
  );
};

const BusTableRow = ({ bus, onEdit, onDelete }) => (
  <tr className="hover:bg-gray-50">
    <td className="px-6 py-4 text-sm font-medium text-gray-900">
      {bus.numero_unidad}
    </td>
    <td className="px-6 py-4 text-sm text-gray-900">{bus.placa}</td>
    <td className="px-6 py-4 text-sm text-gray-500">{bus.modelo || "N/A"}</td>
    <td className="px-6 py-4 text-sm text-gray-500">
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
    <td className="px-6 py-4 text-sm text-gray-500">{bus.capacidad_maxima}</td>
    <td className="px-6 py-4 text-sm">
      <BusStatusBadge estado={bus.estado} />
    </td>
    <td className="px-6 py-4 text-sm font-medium">
      <div className="flex flex-col gap-1">
        <button
          onClick={() => onEdit(bus.id_bus)}
          className="text-blue-600 hover:text-blue-800 text-left"
        >
          Editar
        </button>
        <button
          onClick={() => onDelete(bus.id_bus, bus.numero_unidad)}
          className="text-red-600 hover:text-red-800 text-left"
        >
          Eliminar
        </button>
      </div>
    </td>
  </tr>
);

const BusCard = ({ bus, onEdit, onDelete }) => (
  <div className="p-4">
    <div className="flex items-start justify-between mb-3">
      <div className="flex-1">
        <h3 className="font-bold text-gray-900">{bus.numero_unidad}</h3>
        <p className="text-sm text-gray-600">{bus.placa}</p>
      </div>
      <BusStatusBadge estado={bus.estado} />
    </div>

    <div className="space-y-2 mb-3">
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Modelo:</span>
        <span className="text-gray-900 font-medium">{bus.modelo || "N/A"}</span>
      </div>
      <div className="flex justify-between text-sm">
        <span className="text-gray-500">Línea:</span>
        {bus.linea_nombre ? (
          <span className="text-blue-600 font-medium">{bus.linea_codigo}</span>
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
      <button
        onClick={() => onEdit(bus.id_bus)}
        className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded text-sm font-medium hover:bg-blue-100"
      >
        Editar
      </button>
      <button
        onClick={() => onDelete(bus.id_bus, bus.numero_unidad)}
        className="flex-1 bg-red-50 text-red-600 px-3 py-2 rounded text-sm font-medium hover:bg-red-100"
      >
        Eliminar
      </button>
    </div>
  </div>
);

const DeleteDependencyModal = ({ bus, dependencies, onClose, onConfirm }) => (
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
          No se puede eliminar el bus {bus?.numeroUnidad}
        </h3>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-4">
          <p className="text-sm text-gray-700 mb-3">
            Este bus tiene registros asociados:
          </p>
          <ul className="text-sm text-gray-800 space-y-1">
            {dependencies?.detalles.map((detalle, index) => (
              <li key={index} className="flex items-center gap-2">
                <span className="text-yellow-600">•</span>
                {detalle}
              </li>
            ))}
          </ul>
        </div>

        <p className="text-sm text-gray-600 mb-6">
          Puedes desactivar el bus para que ya no aparezca en operaciones
          activas
        </p>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-medium"
          >
            Cancelar
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-medium"
          >
            Desactivar
          </button>
        </div>
      </div>
    </div>
  </div>
);
