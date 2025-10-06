// frontend/src/components/personal/GuardiaList.jsx
import { useState, useEffect } from "react";
import guardiaService from "../../services/guardiaService";
import GuardiaForm from "./GuardiaForm";

const GuardiaList = () => {
  const [guardias, setGuardias] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedGuardiaId, setSelectedGuardiaId] = useState(null);

  useEffect(() => {
    fetchGuardias();
  }, []);

  const fetchGuardias = async () => {
    try {
      setLoading(true);
      const response = await guardiaService.getGuardias();
      setGuardias(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar los guardias. Verifica que el backend este corriendo."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre, apellido) => {
    if (
      window.confirm(
        `¿Estas seguro de eliminar al guardia ${nombre} ${apellido}?`
      )
    ) {
      try {
        await guardiaService.deleteGuardia(id);
        alert("Guardia eliminado exitosamente");
        fetchGuardias();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error al eliminar el guardia";
        alert(errorMessage);
        console.error(err);
      }
    }
  };

  const handleCreate = () => {
    setSelectedGuardiaId(null);
    setShowForm(true);
  };

  const handleEdit = (id) => {
    setSelectedGuardiaId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedGuardiaId(null);
  };

  const handleFormSuccess = () => {
    fetchGuardias();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando guardias...</p>
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
            onClick={fetchGuardias}
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
        <div className="px-6 py-4 bg-indigo-600 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Guardias de Seguridad</h1>
            <p className="text-indigo-100 mt-1">
              Total de guardias: {guardias.length}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-white text-indigo-600 px-4 py-2 rounded font-semibold hover:bg-indigo-50 transition"
          >
            + Nuevo Guardia
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  DPI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Acceso
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Turno
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
              {guardias.map((guardia) => (
                <tr
                  key={guardia.id_guardia}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {guardia.nombre} {guardia.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                      Desde:{" "}
                      {new Date(
                        guardia.fecha_contratacion
                      ).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guardia.dpi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {guardia.estacion_nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {guardia.estacion_codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {guardia.acceso_nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      <span
                        className={`px-2 py-1 rounded-full text-xs ${
                          guardia.acceso_tipo === "principal"
                            ? "bg-blue-100 text-blue-800"
                            : guardia.acceso_tipo === "secundario"
                            ? "bg-gray-100 text-gray-800"
                            : "bg-red-100 text-red-800"
                        }`}
                      >
                        {guardia.acceso_tipo}
                      </span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {guardia.telefono || "N/A"}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        guardia.turno === "matutino"
                          ? "bg-yellow-100 text-yellow-800"
                          : guardia.turno === "vespertino"
                          ? "bg-orange-100 text-orange-800"
                          : guardia.turno === "nocturno"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-gray-100 text-gray-800"
                      }`}
                    >
                      {guardia.turno.charAt(0).toUpperCase() +
                        guardia.turno.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        guardia.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : guardia.estado === "inactivo"
                          ? "bg-gray-100 text-gray-800"
                          : guardia.estado === "vacaciones"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      {guardia.estado === "activo"
                        ? "Activo"
                        : guardia.estado === "inactivo"
                        ? "Inactivo"
                        : guardia.estado === "vacaciones"
                        ? "Vacaciones"
                        : "Licencia"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(guardia.id_guardia)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          guardia.id_guardia,
                          guardia.nombre,
                          guardia.apellido
                        )
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
        <GuardiaForm
          guardiaId={selectedGuardiaId}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default GuardiaList;
