// frontend/src/components/lineas/LineaForm.jsx
import { useState, useEffect } from "react";
import lineaService from "../../services/lineaService";
import municipalidadService from "../../services/municipalidadService";

const LineaForm = ({ lineaId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id_municipalidad: "",
    nombre: "",
    codigo: "",
    color: "#E31E24",
    estado: "activa",
  });

  const [municipalidades, setMunicipalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMunicipalidades();
    if (lineaId) {
      fetchLinea();
    }
  }, [lineaId]);

  const fetchMunicipalidades = async () => {
    try {
      const response = await municipalidadService.getMunicipalidades();
      setMunicipalidades(response.data);
    } catch (err) {
      console.error("Error al cargar municipalidades:", err);
    }
  };

  const fetchLinea = async () => {
    try {
      const response = await lineaService.getLineaById(lineaId);
      setFormData(response.data);
    } catch (err) {
      setError("Error al cargar la linea");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (lineaId) {
        await lineaService.updateLinea(lineaId, formData);
      } else {
        await lineaService.createLinea(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la linea");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 bg-blue-600 text-white rounded-t-lg">
          <h2 className="text-xl font-bold">
            {lineaId ? "Editar Linea" : "Nueva Linea"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Municipalidad *
            </label>
            <select
              name="id_municipalidad"
              value={formData.id_municipalidad}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar municipalidad</option>
              {municipalidades.map((m) => (
                <option key={m.id_municipalidad} value={m.id_municipalidad}>
                  {m.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: Linea Central"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Codigo *
            </label>
            <input
              type="text"
              name="codigo"
              value={formData.codigo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Ej: LC-01"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Color
            </label>
            <input
              type="color"
              name="color"
              value={formData.color}
              onChange={handleChange}
              className="w-full h-10 px-1 py-1 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="activa">Activa</option>
              <option value="inactiva">Inactiva</option>
              <option value="mantenimiento">Mantenimiento</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Guardando..." : lineaId ? "Actualizar" : "Crear"}
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-300 text-gray-700 py-2 px-4 rounded-md hover:bg-gray-400 transition"
            >
              Cancelar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default LineaForm;
