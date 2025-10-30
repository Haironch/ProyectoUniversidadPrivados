import { useState, useEffect } from "react";
import estacionService from "../../services/estacionService";

const RegistrarConteo = () => {
  const [estaciones, setEstaciones] = useState([]);
  const [selectedEstacion, setSelectedEstacion] = useState("");
  const [pasajeros, setPasajeros] = useState("");
  const [loading, setLoading] = useState(false);
  const [mensaje, setMensaje] = useState(null);

  useEffect(() => {
    fetchEstaciones();
  }, []);

  const fetchEstaciones = async () => {
    try {
      const response = await estacionService.getEstaciones();
      setEstaciones(response.data);
    } catch (error) {
      console.error("Error al cargar estaciones:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedEstacion || !pasajeros) {
      setMensaje({
        tipo: "error",
        texto:
          "Debes seleccionar una estación e ingresar el número de pasajeros",
      });
      return;
    }

    try {
      setLoading(true);
      const response = await estacionService.registrarConteo(
        selectedEstacion,
        parseInt(pasajeros)
      );

      setMensaje({
        tipo: response.data.alerta_generada ? "warning" : "success",
        texto: response.message,
        data: response.data,
      });

      // Limpiar formulario
      setPasajeros("");
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto:
          error.response?.data?.message ||
          "Error al registrar el conteo de pasajeros",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="max-w-2xl mx-auto bg-white rounded-lg shadow-lg p-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-6">
          📊 Registrar Conteo de Pasajeros
        </h2>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Seleccionar Estación */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Estación *
            </label>
            <select
              value={selectedEstacion}
              onChange={(e) => setSelectedEstacion(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Selecciona una estación</option>
              {estaciones.map((estacion) => (
                <option key={estacion.id_estacion} value={estacion.id_estacion}>
                  {estacion.codigo} - {estacion.nombre} (Capacidad:{" "}
                  {estacion.capacidad_maxima})
                </option>
              ))}
            </select>
          </div>

          {/* Número de Pasajeros */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Número de Pasajeros Actuales *
            </label>
            <input
              type="number"
              min="0"
              value={pasajeros}
              onChange={(e) => setPasajeros(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Ingresa el número de pasajeros"
              required
            />
          </div>

          {/* Botón */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed"
          >
            {loading ? "Registrando..." : "Registrar Conteo"}
          </button>
        </form>

        {/* Mensajes */}
        {mensaje && (
          <div
            className={`mt-6 p-4 rounded-lg ${
              mensaje.tipo === "success"
                ? "bg-green-50 border border-green-200"
                : mensaje.tipo === "warning"
                ? "bg-yellow-50 border border-yellow-200"
                : "bg-red-50 border border-red-200"
            }`}
          >
            <div className="flex items-start">
              <span className="text-2xl mr-3">
                {mensaje.tipo === "success"
                  ? "✅"
                  : mensaje.tipo === "warning"
                  ? "⚠️"
                  : "❌"}
              </span>
              <div className="flex-1">
                <p
                  className={`font-semibold ${
                    mensaje.tipo === "success"
                      ? "text-green-800"
                      : mensaje.tipo === "warning"
                      ? "text-yellow-800"
                      : "text-red-800"
                  }`}
                >
                  {mensaje.texto}
                </p>

                {mensaje.data && (
                  <div className="mt-3 space-y-2 text-sm">
                    <p className="text-gray-700">
                      <strong>Estación:</strong> {mensaje.data.estacion}
                    </p>
                    <p className="text-gray-700">
                      <strong>Pasajeros actuales:</strong>{" "}
                      {mensaje.data.pasajeros_actuales}
                    </p>
                    <p className="text-gray-700">
                      <strong>Capacidad máxima:</strong>{" "}
                      {mensaje.data.capacidad_maxima}
                    </p>
                    <p
                      className={`font-semibold ${
                        mensaje.data.porcentaje_ocupacion >= 150
                          ? "text-red-600"
                          : mensaje.data.porcentaje_ocupacion >= 100
                          ? "text-yellow-600"
                          : "text-green-600"
                      }`}
                    >
                      <strong>Ocupación:</strong>{" "}
                      {mensaje.data.porcentaje_ocupacion}%
                    </p>

                    {mensaje.data.alerta_generada && (
                      <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                        <p className="text-red-800 font-bold">
                          🚨 ALERTA GENERADA AUTOMÁTICAMENTE
                        </p>
                        <p className="text-red-700 text-sm mt-1">
                          Prioridad:{" "}
                          {mensaje.data.alerta_generada.prioridad.toUpperCase()}
                        </p>
                        <p className="text-red-700 text-sm">
                          {mensaje.data.alerta_generada.descripcion}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default RegistrarConteo;
