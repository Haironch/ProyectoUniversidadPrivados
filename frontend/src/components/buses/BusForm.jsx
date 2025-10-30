// frontend/src/components/buses/BusForm.jsx
import { useState, useEffect } from "react";
import busService from "../../services/busService";
import lineaService from "../../services/lineaService";
import parqueoService from "../../services/parqueoService";

const BusForm = ({ busId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    numero_unidad: "",
    placa: "",
    modelo: "",
    anio: "",
    capacidad_maxima: "150",
    id_parqueo: "",
    id_linea: "",
    estado: "operativo", // ← CAMBIADO: activo → operativo
  });

  const [lineas, setLineas] = useState([]);
  const [parqueos, setParqueos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLineas();
    fetchParqueos();
    if (busId) {
      fetchBus();
    }
  }, [busId]);

  const fetchLineas = async () => {
    try {
      const response = await lineaService.getLineas();
      setLineas(response.data);
    } catch (err) {
      console.error("Error al cargar líneas:", err);
    }
  };

  const fetchParqueos = async () => {
    try {
      const response = await parqueoService.getParqueos();
      setParqueos(response.data);
    } catch (err) {
      console.error("Error al cargar parqueos:", err);
    }
  };

  const fetchBus = async () => {
    try {
      const response = await busService.getBusById(busId);
      setFormData(response.data);
    } catch (err) {
      setError("Error al cargar el bus");
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
      if (busId) {
        await busService.updateBus(busId, formData);
      } else {
        await busService.createBus(formData);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el bus");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-blue-600 text-white rounded-t-lg sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold">
            {busId ? "Editar Bus" : "Nuevo Bus"}
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

          {/* Número de Unidad y Placa - 1 columna en móvil, 2 en desktop */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Número de Unidad *
              </label>
              <input
                type="text"
                name="numero_unidad"
                value={formData.numero_unidad}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: BUS-001"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Placa *
              </label>
              <input
                type="text"
                name="placa"
                value={formData.placa}
                onChange={handleChange}
                required
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: P-123ABC"
              />
            </div>
          </div>

          {/* Modelo y Año */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Modelo
              </label>
              <input
                type="text"
                name="modelo"
                value={formData.modelo}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="Ej: Volvo B7RLE"
              />
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                Año
              </label>
              <input
                type="number"
                name="anio"
                value={formData.anio}
                onChange={handleChange}
                className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="2024"
              />
            </div>
          </div>

          {/* Capacidad */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Capacidad de Pasajeros *
            </label>
            <input
              type="number"
              name="capacidad_maxima"
              value={formData.capacidad_maxima}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Parqueo */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Parqueo Asignado *
            </label>
            <select
              name="id_parqueo"
              value={formData.id_parqueo}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Seleccionar parqueo</option>
              {parqueos.map((p) => (
                <option key={p.id_parqueo} value={p.id_parqueo}>
                  {p.nombre} - {p.direccion}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              * Un bus siempre debe tener un parqueo asignado
            </p>
          </div>

          {/* Línea */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Línea Asignada (opcional)
            </label>
            <select
              name="id_linea"
              value={formData.id_linea}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Sin asignar</option>
              {lineas.map((l) => (
                <option key={l.id_linea} value={l.id_linea}>
                  {l.codigo} - {l.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Estado */}
          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="operativo">Operativo</option> {/* ← CAMBIADO */}
              <option value="mantenimiento">Mantenimiento</option>
              <option value="fuera_servicio">Fuera de Servicio</option>
            </select>
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
              className="w-full sm:flex-1 bg-blue-600 text-white py-2.5 sm:py-2 px-4 rounded-md hover:bg-blue-700 disabled:bg-gray-400 transition text-sm sm:text-base font-medium"
            >
              {loading ? "Guardando..." : busId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default BusForm;
