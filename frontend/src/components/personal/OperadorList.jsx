// frontend/src/components/personal/OperadorList.jsx
import { useState, useEffect } from "react";
import operadorService from "../../services/operadorService";
import OperadorForm from "./OperadorForm";

const OperadorList = () => {
  const [operadores, setOperadores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedOperadorId, setSelectedOperadorId] = useState(null);

  useEffect(() => {
    fetchOperadores();
  }, []);

  const fetchOperadores = async () => {
    try {
      setLoading(true);
      const response = await operadorService.getOperadores();
      setOperadores(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar los operadores. Verifica que el backend este corriendo."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre, apellido) => {
    if (
      window.confirm(
        `¿Estas seguro de eliminar al operador ${nombre} ${apellido}?`
      )
    ) {
      try {
        await operadorService.deleteOperador(id);
        alert("Operador eliminado exitosamente");
        fetchOperadores();
      } catch (err) {
        const errorMessage =
          err.response?.data?.message || "Error al eliminar el operador";
        alert(errorMessage);
        console.error(err);
      }
    }
  };

  const handleCreate = () => {
    setSelectedOperadorId(null);
    setShowForm(true);
  };

  const handleEdit = (id) => {
    setSelectedOperadorId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedOperadorId(null);
  };

  const handleFormSuccess = () => {
    fetchOperadores();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando operadores...</p>
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
            onClick={fetchOperadores}
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
        <div className="px-6 py-4 bg-teal-600 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Operadores de Estaciones</h1>
            <p className="text-teal-100 mt-1">
              Total de operadores: {operadores.length}
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-white text-teal-600 px-4 py-2 rounded font-semibold hover:bg-teal-50 transition"
          >
            + Nuevo Operador
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
                  Usuario
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Estación
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Contacto
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
              {operadores.map((operador) => (
                <tr
                  key={operador.id_operador}
                  className="hover:bg-gray-50 transition"
                >
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {operador.nombre} {operador.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                      Desde:{" "}
                      {new Date(
                        operador.fecha_contratacion
                      ).toLocaleDateString()}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    {operador.dpi}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {operador.usuario}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {operador.estacion_nombre}
                    </div>
                    <div className="text-sm text-gray-500">
                      {operador.estacion_codigo}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-500">
                      {operador.telefono || "N/A"}
                    </div>
                    <div className="text-sm text-gray-500">
                      {operador.email || "N/A"}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        operador.turno === "matutino"
                          ? "bg-yellow-100 text-yellow-800"
                          : operador.turno === "vespertino"
                          ? "bg-orange-100 text-orange-800"
                          : operador.turno === "nocturno"
                          ? "bg-blue-100 text-blue-800"
                          : "bg-purple-100 text-purple-800"
                      }`}
                    >
                      {operador.turno.charAt(0).toUpperCase() +
                        operador.turno.slice(1)}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        operador.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : operador.estado === "inactivo"
                          ? "bg-gray-100 text-gray-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {operador.estado === "activo"
                        ? "Activo"
                        : operador.estado === "inactivo"
                        ? "Inactivo"
                        : "Vacaciones"}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                    <button className="text-blue-600 hover:text-blue-900">
                      Ver
                    </button>
                    <button
                      onClick={() => handleEdit(operador.id_operador)}
                      className="text-green-600 hover:text-green-900"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          operador.id_operador,
                          operador.nombre,
                          operador.apellido
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
        <OperadorForm
          operadorId={selectedOperadorId}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default OperadorList;
