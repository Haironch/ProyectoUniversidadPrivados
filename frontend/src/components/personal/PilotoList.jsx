// frontend/src/components/personal/PilotoList.jsx
import { useState, useEffect } from "react";
import pilotoService from "../../services/pilotoService";
import PilotoForm from "./PilotoForm";

const PilotoList = () => {
  const [pilotos, setPilotos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [selectedPilotoId, setSelectedPilotoId] = useState(null);

  useEffect(() => {
    fetchPilotos();
  }, []);

  const fetchPilotos = async () => {
    try {
      setLoading(true);
      const response = await pilotoService.getPilotos();
      setPilotos(response.data);
      setError(null);
    } catch (err) {
      setError(
        "Error al cargar pilotos. Verifica que el backend este corriendo."
      );
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id, nombre, apellido) => {
    if (window.confirm(`¿Eliminar al piloto ${nombre} ${apellido}?`)) {
      try {
        await pilotoService.deletePiloto(id);
        alert("Piloto eliminado");
        fetchPilotos();
      } catch (err) {
        const errorMessage = err.response?.data?.message || "Error al eliminar";
        alert(errorMessage);
        console.error(err);
      }
    }
  };

  const handleCreate = () => {
    setSelectedPilotoId(null);
    setShowForm(true);
  };

  const handleEdit = (id) => {
    setSelectedPilotoId(id);
    setShowForm(true);
  };

  const handleCloseForm = () => {
    setShowForm(false);
    setSelectedPilotoId(null);
  };

  const handleFormSuccess = () => {
    fetchPilotos();
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando...</p>
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
            onClick={fetchPilotos}
            className="mt-4 bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700"
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
        <div className="px-6 py-4 bg-purple-600 text-white flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold">Pilotos de Transmetro</h1>
            <p className="text-purple-100 mt-1">
              {pilotos.length} pilotos registrados
            </p>
          </div>
          <button
            onClick={handleCreate}
            className="bg-white text-purple-600 px-4 py-2 rounded font-semibold hover:bg-purple-50"
          >
            Nuevo Piloto
          </button>
        </div>

        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Nombre
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  DPI
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Licencia
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Teléfono
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Municipio
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                  Educación
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
              {pilotos.map((piloto) => (
                <tr key={piloto.id_piloto} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <div className="text-sm font-medium text-gray-900">
                      {piloto.nombre} {piloto.apellido}
                    </div>
                    <div className="text-sm text-gray-500">
                      {piloto.email || "Sin email"}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {piloto.dpi}
                  </td>
                  <td className="px-6 py-4">
                    <div className="text-sm text-gray-900">
                      {piloto.licencia}
                    </div>
                    <div className="text-sm text-gray-500">
                      Tipo {piloto.tipo_licencia}
                    </div>
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {piloto.telefono}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {piloto.municipio_residencia}
                  </td>
                  <td className="px-6 py-4 text-sm text-gray-500">
                    {piloto.registros_educativos > 0 ? (
                      <span className="px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs font-semibold">
                        {piloto.registros_educativos}
                      </span>
                    ) : (
                      <span className="text-gray-400">Sin registros</span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-sm">
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-semibold ${
                        piloto.estado === "activo"
                          ? "bg-green-100 text-green-800"
                          : piloto.estado === "inactivo"
                          ? "bg-gray-100 text-gray-800"
                          : piloto.estado === "suspendido"
                          ? "bg-red-100 text-red-800"
                          : "bg-yellow-100 text-yellow-800"
                      }`}
                    >
                      {piloto.estado === "activo"
                        ? "Activo"
                        : piloto.estado === "inactivo"
                        ? "Inactivo"
                        : piloto.estado === "suspendido"
                        ? "Suspendido"
                        : "Vacaciones"}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-sm font-medium space-x-2">
                    <button
                      onClick={() => handleEdit(piloto.id_piloto)}
                      className="text-blue-600 hover:text-blue-800"
                    >
                      Editar
                    </button>
                    <button
                      onClick={() =>
                        handleDelete(
                          piloto.id_piloto,
                          piloto.nombre,
                          piloto.apellido
                        )
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

        {pilotos.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay pilotos registrados</p>
          </div>
        )}
      </div>

      {showForm && (
        <PilotoForm
          pilotoId={selectedPilotoId}
          onClose={handleCloseForm}
          onSuccess={handleFormSuccess}
        />
      )}
    </div>
  );
};

export default PilotoList;
