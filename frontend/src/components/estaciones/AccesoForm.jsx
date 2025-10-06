// frontend/src/components/estaciones/AccesoForm.jsx
import { useState, useEffect } from "react";
import accesoService from "../../services/accesoService";
import estacionService from "../../services/estacionService";

const AccesoForm = ({ accesoId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    id_estacion: "",
    nombre: "",
    tipo: "principal",
    esta_activo: true,
    hora_apertura: "05:00",
    hora_cierre: "22:00",
  });

  const [estaciones, setEstaciones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEstaciones();
    if (accesoId) {
      fetchAcceso();
    }
  }, [accesoId]);

  const fetchEstaciones = async () => {
    try {
      const response = await estacionService.getEstaciones();
      setEstaciones(response.data);
    } catch (err) {
      console.error("Error al cargar estaciones:", err);
    }
  };

  const fetchAcceso = async () => {
    try {
      const response = await accesoService.getAccesoById(accesoId);
      const acceso = response.data;
      setFormData({
        id_estacion: acceso.id_estacion,
        nombre: acceso.nombre,
        tipo: acceso.tipo,
        esta_activo: acceso.esta_activo,
        hora_apertura: acceso.hora_apertura?.substring(0, 5) || "05:00",
        hora_cierre: acceso.hora_cierre?.substring(0, 5) || "22:00",
      });
    } catch (err) {
      setError("Error al cargar el acceso");
      console.error(err);
    }
  };

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: type === "checkbox" ? checked : value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        hora_apertura: formData.hora_apertura + ":00",
        hora_cierre: formData.hora_cierre + ":00",
      };

      if (accesoId) {
        await accesoService.updateAcceso(accesoId, dataToSend);
      } else {
        await accesoService.createAcceso(dataToSend);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el acceso");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 bg-orange-600 text-white rounded-t-lg">
          <h2 className="text-xl font-bold">
            {accesoId ? "Editar Acceso" : "Nuevo Acceso"}
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
              Estación *
            </label>
            <select
              name="id_estacion"
              value={formData.id_estacion}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="">Seleccionar estación</option>
              {estaciones.map((e) => (
                <option key={e.id_estacion} value={e.id_estacion}>
                  {e.codigo} - {e.nombre}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Nombre del Acceso *
            </label>
            <input
              type="text"
              name="nombre"
              value={formData.nombre}
              onChange={handleChange}
              required
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              placeholder="Ej: Acceso Norte"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tipo de Acceso
            </label>
            <select
              name="tipo"
              value={formData.tipo}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
            >
              <option value="principal">Principal</option>
              <option value="secundario">Secundario</option>
              <option value="emergencia">Emergencia</option>
            </select>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Apertura
              </label>
              <input
                type="time"
                name="hora_apertura"
                value={formData.hora_apertura}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Hora de Cierre
              </label>
              <input
                type="time"
                name="hora_cierre"
                value={formData.hora_cierre}
                onChange={handleChange}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-orange-500"
              />
            </div>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              name="esta_activo"
              checked={formData.esta_activo}
              onChange={handleChange}
              className="h-4 w-4 text-orange-600 focus:ring-orange-500 border-gray-300 rounded"
            />
            <label className="ml-2 block text-sm text-gray-700">
              Acceso activo
            </label>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-orange-600 text-white py-2 px-4 rounded-md hover:bg-orange-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Guardando..." : accesoId ? "Actualizar" : "Crear"}
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

export default AccesoForm;
