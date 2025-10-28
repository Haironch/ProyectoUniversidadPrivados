// frontend/src/components/estaciones/EstacionForm.jsx
import { useState, useEffect } from "react";
import estacionService from "../../services/estacionService";
import municipalidadService from "../../services/municipalidadService";

const EstacionForm = ({ estacionId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id_municipalidad: "",
    nombre: "",
    codigo: "",
    latitud: "",
    longitud: "",
    direccion: "",
    capacidad_maxima: "100",
    estado: "operativa",
  });

  const [municipalidades, setMunicipalidades] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchMunicipalidades();
    if (estacionId) {
      fetchEstacion();
    }
  }, [estacionId]);

  const fetchMunicipalidades = async () => {
    try {
      const response = await municipalidadService.getMunicipalidades();
      setMunicipalidades(response.data);
    } catch (err) {
      console.error("Error al cargar municipalidades:", err);
    }
  };

  const fetchEstacion = async () => {
    try {
      const response = await estacionService.getEstacionById(estacionId);
      setFormData(response.data);
    } catch (err) {
      setError("Error al cargar la estacion");
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
      if (estacionId) {
        await estacionService.updateEstacion(estacionId, formData);
      } else {
        await estacionService.createEstacion(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar la estacion");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-green-600 text-white rounded-t-lg sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold">
            {estacionId ? "Editar Estación" : "Nueva Estación"}
          </h2>
        </div>

        {/* Form */}
        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-3 sm:space-y-4"
        >
          {/* Error Message */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm">
              {error}
            </div>
          )}

          {/* Municipalidad y Código - 1 columna en móvil, 2 en desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Municipalidad *
              </label>
              <select
                name="id_municipalidad"
                value={formData.id_municipalidad}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
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
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Código *
              </label>
              <input
                type="text"
                name="codigo"
                value={formData.codigo}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="Ej: EST-001"
              />
            </div>
          </div>

          {/* Nombre */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Nombre *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: Estación Central"
            />
          </div>

          {/* Dirección */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Dirección
            </label>
            <input
              type="text"
              name="direccion"
              value={formData.direccion}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              placeholder="Ej: 6a Avenida, Zona 1"
            />
          </div>

          {/* Latitud y Longitud */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Latitud
              </label>
              <input
                type="number"
                step="0.000001"
                name="latitud"
                value={formData.latitud}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="14.628434"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Longitud
              </label>
              <input
                type="number"
                step="0.000001"
                name="longitud"
                value={formData.longitud}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
                placeholder="-90.513327"
              />
            </div>
          </div>

          {/* Capacidad y Estado */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Capacidad Máxima
              </label>
              <input
                type="number"
                name="capacidad_maxima"
                value={formData.capacidad_maxima}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Estado
              </label>
              <select
                name="estado"
                value={formData.estado}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500"
              >
                <option value="operativa">Operativa</option>
                <option value="mantenimiento">Mantenimiento</option>
                <option value="cerrada">Cerrada</option>
              </select>
            </div>
          </div>

          {/* Botones - Stack en móvil, lado a lado en desktop */}
          <div className="flex flex-col-reverse sm:flex-row gap-2 sm:gap-3 pt-2 sm:pt-4">
            <button
              type="button"
              onClick={onClose}
              className="w-full sm:flex-1 bg-gray-300 text-gray-700 py-2.5 sm:py-2 px-4 rounded-md hover:bg-gray-400 transition text-sm sm:text-base font-medium"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="w-full sm:flex-1 bg-green-600 text-white py-2.5 sm:py-2 px-4 rounded-md hover:bg-green-700 disabled:bg-gray-400 transition text-sm sm:text-base font-medium"
            >
              {loading ? "Guardando..." : estacionId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EstacionForm;
