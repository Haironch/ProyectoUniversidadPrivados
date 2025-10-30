import { useState, useEffect } from "react";
import estacionService from "../../services/estacionService";
import alertaService from "../../services/alertaService";

const AlertaForm = ({ onClose, onSuccess }) => {
  const [estaciones, setEstaciones] = useState([]);
  const [busesDisponibles, setBusesDisponibles] = useState([]);
  const [formData, setFormData] = useState({
    id_estacion: "",
    id_bus: "",
    tipo_alerta: "",
    descripcion: "",
    prioridad: "media",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchEstaciones();
  }, []);

  const fetchEstaciones = async () => {
    try {
      const response = await estacionService.getEstaciones();
      setEstaciones(response.data);
    } catch (err) {
      console.error("Error al cargar estaciones:", err);
    }
  };

  const handleEstacionChange = async (id_estacion) => {
    setFormData({ ...formData, id_estacion, id_bus: "" });
    setBusesDisponibles([]);

    if (id_estacion) {
      try {
        const response = await estacionService.getBusesDisponibles(id_estacion);
        setBusesDisponibles(response.data);
      } catch (err) {
        console.error("Error al cargar buses:", err);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.tipo_alerta || !formData.descripcion) {
      setError("Debes completar todos los campos obligatorios");
      return;
    }

    try {
      setLoading(true);
      await alertaService.createAlerta({
        id_estacion: formData.id_estacion || null,
        id_bus: formData.id_bus || null,
        tipo_alerta: formData.tipo_alerta,
        descripcion: formData.descripcion,
        prioridad: formData.prioridad,
      });

      alert("Alerta creada exitosamente");
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al crear la alerta");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-blue-600 text-white px-6 py-4 rounded-t-lg">
          <h2 className="text-xl font-bold">🚨 Crear Nueva Alerta</h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Estación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estación *
            </label>
            <select
              value={formData.id_estacion}
              onChange={(e) => handleEstacionChange(e.target.value)}
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona una estación</option>
              {estaciones.map((est) => (
                <option key={est.id_estacion} value={est.id_estacion}>
                  {est.codigo} - {est.nombre}
                </option>
              ))}
            </select>
          </div>

          {/* Bus (opcional, filtrado por estación) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bus (Opcional)
            </label>
            <select
              value={formData.id_bus}
              onChange={(e) =>
                setFormData({ ...formData, id_bus: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              disabled={!formData.id_estacion}
            >
              <option value="">Sin bus específico</option>
              {busesDisponibles.map((bus) => (
                <option key={bus.id_bus} value={bus.id_bus}>
                  {bus.numero_unidad} - {bus.placa} ({bus.linea_codigo})
                </option>
              ))}
            </select>
            {formData.id_estacion && busesDisponibles.length === 0 && (
              <p className="text-sm text-gray-500 mt-1">
                No hay buses operativos en esta estación
              </p>
            )}
          </div>

          {/* Tipo de Alerta */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Tipo de Alerta *
            </label>
            <select
              value={formData.tipo_alerta}
              onChange={(e) =>
                setFormData({ ...formData, tipo_alerta: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="">Selecciona el tipo</option>
              <option value="capacidad_excedida">Capacidad Excedida</option>
              <option value="bus_vacio">Bus Vacío</option>
              <option value="mantenimiento">Mantenimiento</option>
              <option value="emergencia">Emergencia</option>
              <option value="otro">Otro</option>
            </select>
          </div>

          {/* Prioridad */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Prioridad *
            </label>
            <select
              value={formData.prioridad}
              onChange={(e) =>
                setFormData({ ...formData, prioridad: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              required
            >
              <option value="baja">Baja</option>
              <option value="media">Media</option>
              <option value="alta">Alta</option>
              <option value="critica">Crítica</option>
            </select>
          </div>

          {/* Descripción */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Descripción *
            </label>
            <textarea
              value={formData.descripcion}
              onChange={(e) =>
                setFormData({ ...formData, descripcion: e.target.value })
              }
              className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500"
              rows="4"
              placeholder="Describe la situación..."
              required
            ></textarea>
          </div>

          {/* Error */}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Botones */}
          <div className="flex gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-700 py-2 rounded-lg font-semibold hover:bg-gray-300 transition"
            >
              Cancelar
            </button>
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white py-2 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400"
            >
              {loading ? "Creando..." : "Crear Alerta"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AlertaForm;
