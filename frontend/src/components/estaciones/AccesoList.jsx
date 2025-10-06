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
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-orange-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando accesos...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-md">
          <h3 className="text-red-800 font-semibold mb-2">Error</h3>
          <p className="text-red-600">{error}</p>
          <button
            onClick={fetchAccesos}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
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
        <div className="px-6 py-4 bg-orange-600 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Accesos de Estaciones</h1>
            <p className="text-orange-100 mt-1">
              Total de accesos: {accesos.length}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-white text-orange-600 px-4 py-2 rounded font-semibold hover:bg-orange-50 transition"
          >
            + Nuevo Acceso
          </button>
        </div>

        <div className="overflow-x-auto">
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
