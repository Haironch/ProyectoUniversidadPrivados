import { useState, useEffect } from "react";
import estacionService from "../../services/estacionService";
import alertaService from "../../services/alertaService";

const GenerarAlerta = ({ onClose, onSuccess }) => {
  const [tipoAlerta, setTipoAlerta] = useState("");
  const [estaciones, setEstaciones] = useState([]);
  const [busesDisponibles, setBusesDisponibles] = useState([]);

  const [formData, setFormData] = useState({
    id_estacion: "",
    id_bus: "",
    pasajeros_estacion: "",
    pasajeros_bus: "",
    tipo_alerta_manual: "",
    prioridad_manual: "media",
    descripcion: "",
  });

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

  const handleEstacionChange = async (id_estacion) => {
    setFormData({
      ...formData,
      id_estacion,
      id_bus: "",
      pasajeros_bus: "",
    });
    setBusesDisponibles([]);

    if (id_estacion) {
      try {
        const response = await estacionService.getBusesDisponibles(id_estacion);
        setBusesDisponibles(response.data);
      } catch (error) {
        console.error("Error al cargar buses:", error);
      }
    }
  };

  const resetForm = () => {
    setFormData({
      id_estacion: "",
      id_bus: "",
      pasajeros_estacion: "",
      pasajeros_bus: "",
      tipo_alerta_manual: "",
      prioridad_manual: "media",
      descripcion: "",
    });
    setBusesDisponibles([]);
    setMensaje(null);
  };

  const handleTipoChange = (tipo) => {
    setTipoAlerta(tipo);
    resetForm();
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMensaje(null);

    try {
      setLoading(true);

      if (tipoAlerta === "alta_demanda") {
        if (!formData.id_estacion || !formData.pasajeros_estacion) {
          setMensaje({
            tipo: "error",
            texto:
              "Debes seleccionar una estacion e ingresar el número de pasajeros",
          });
          return;
        }

        const response = await estacionService.registrarConteo(
          formData.id_estacion,
          parseInt(formData.pasajeros_estacion)
        );

        setMensaje({
          tipo: response.data.alerta_generada ? "warning" : "success",
          texto: response.message,
          data: response.data,
        });

        if (response.data.alerta_generada) {
          onSuccess?.();
        }
      } else if (tipoAlerta === "bus_vacio") {
        if (
          !formData.id_estacion ||
          !formData.id_bus ||
          !formData.pasajeros_bus
        ) {
          setMensaje({
            tipo: "error",
            texto: "Debes seleccionar estación, bus e ingresar pasajeros",
          });
          return;
        }

        const busSeleccionado = busesDisponibles.find(
          (b) => b.id_bus === parseInt(formData.id_bus)
        );

        if (!busSeleccionado) {
          setMensaje({
            tipo: "error",
            texto: "Bus no encontrado",
          });
          return;
        }

        const pasajeros = parseInt(formData.pasajeros_bus);
        const capacidad = busSeleccionado.capacidad_maxima;
        const umbral = capacidad * 0.25;
        const porcentaje = Math.round((pasajeros / capacidad) * 100);

        if (pasajeros < umbral) {
          const estacionNombre = estaciones.find(
            (e) => e.id_estacion === parseInt(formData.id_estacion)
          )?.nombre;

          await alertaService.createAlerta({
            id_estacion: formData.id_estacion,
            id_bus: formData.id_bus,
            tipo_alerta: "bus_vacio",
            descripcion: `Bus ${busSeleccionado.numero_unidad} con baja ocupación en ${estacionNombre}. Pasajeros: ${pasajeros}/${capacidad} (${porcentaje}%). Debe esperar 5 minutos adicionales.`,
            prioridad: "baja",
          });

          setMensaje({
            tipo: "warning",
            texto: "Alerta generada: Bus con baja ocupacion",
            data: {
              bus: `${busSeleccionado.numero_unidad} - ${busSeleccionado.placa}`,
              pasajeros,
              capacidad,
              porcentaje,
              umbral: Math.round(umbral),
            },
          });

          onSuccess?.();
        } else {
          setMensaje({
            tipo: "success",
            texto: "Registro completado. El bus tiene ocupación aceptable.",
            data: {
              bus: `${busSeleccionado.numero_unidad} - ${busSeleccionado.placa}`,
              pasajeros,
              capacidad,
              porcentaje,
            },
          });
        }
      } else if (tipoAlerta === "manual") {
        if (
          !formData.id_estacion ||
          !formData.tipo_alerta_manual ||
          !formData.descripcion
        ) {
          setMensaje({
            tipo: "error",
            texto: "Debes completar todos los campos obligatorios",
          });
          return;
        }

        await alertaService.createAlerta({
          id_estacion: formData.id_estacion,
          id_bus: formData.id_bus || null,
          tipo_alerta: formData.tipo_alerta_manual,
          descripcion: formData.descripcion,
          prioridad: formData.prioridad_manual,
        });

        setMensaje({
          tipo: "success",
          texto: "Alerta manual creada exitosamente",
        });

        onSuccess?.();
      }

      if (tipoAlerta !== "alta_demanda") {
        setTimeout(() => {
          resetForm();
          setTipoAlerta("");
        }, 3000);
      }
    } catch (error) {
      setMensaje({
        tipo: "error",
        texto:
          error.response?.data?.message || "Error al procesar la solicitud",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="bg-red-600 text-white px-6 py-4">
          <h2 className="text-2xl font-bold">Generar Alerta</h2>
          <p className="text-red-100 mt-1 text-sm">
            Selecciona el tipo de alerta que deseas generar
          </p>
        </div>

        <div className="p-6 bg-gray-50 border-b">
          <label className="block text-sm font-medium text-gray-700 mb-3">
            Tipo de Alerta
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <button
              type="button"
              onClick={() => handleTipoChange("alta_demanda")}
              className={`p-4 border-2 rounded-lg text-left ${
                tipoAlerta === "alta_demanda"
                  ? "border-red-500 bg-red-50"
                  : "border-gray-300 hover:border-red-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🔴</span>
                <div>
                  <p className="font-semibold text-gray-800">Alta Demanda</p>
                  <p className="text-xs text-gray-600">
                    Estación con más de 150% capacidad
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTipoChange("bus_vacio")}
              className={`p-4 border-2 rounded-lg text-left ${
                tipoAlerta === "bus_vacio"
                  ? "border-yellow-500 bg-yellow-50"
                  : "border-gray-300 hover:border-yellow-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🟡</span>
                <div>
                  <p className="font-semibold text-gray-800">Bus Vacío</p>
                  <p className="text-xs text-gray-600">
                    Bus con menos del 25% ocupación
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => handleTipoChange("manual")}
              className={`p-4 border-2 rounded-lg text-left ${
                tipoAlerta === "manual"
                  ? "border-orange-500 bg-orange-50"
                  : "border-gray-300 hover:border-orange-300"
              }`}
            >
              <div className="flex items-center gap-3">
                <span className="text-3xl">🟠</span>
                <div>
                  <p className="font-semibold text-gray-800">Alerta Manual</p>
                  <p className="text-xs text-gray-600">
                    Emergencia, mantenimiento u otro
                  </p>
                </div>
              </div>
            </button>
          </div>
        </div>

        {tipoAlerta && (
          <form onSubmit={handleSubmit} className="p-6 space-y-6">
            {tipoAlerta === "alta_demanda" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estación
                  </label>
                  <select
                    value={formData.id_estacion}
                    onChange={(e) =>
                      setFormData({ ...formData, id_estacion: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    required
                  >
                    <option value="">Selecciona una estación</option>
                    {estaciones.map((est) => (
                      <option key={est.id_estacion} value={est.id_estacion}>
                        {est.codigo} - {est.nombre} (Cap: {est.capacidad_maxima}
                        )
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Número de Pasajeros
                  </label>
                  <input
                    type="number"
                    min="0"
                    maxLength={4}
                    value={formData.pasajeros_estacion}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pasajeros_estacion: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-red-500"
                    placeholder="Ingresa el número de pasajeros"
                    required
                  />
                </div>
              </>
            )}

            {tipoAlerta === "bus_vacio" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estación
                  </label>
                  <select
                    value={formData.id_estacion}
                    onChange={(e) => handleEstacionChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bus
                  </label>
                  <select
                    value={formData.id_bus}
                    onChange={(e) =>
                      setFormData({ ...formData, id_bus: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    disabled={!formData.id_estacion}
                    required
                  >
                    <option value="">Selecciona un bus</option>
                    {busesDisponibles.map((bus) => (
                      <option key={bus.id_bus} value={bus.id_bus}>
                        {bus.numero_unidad} - {bus.placa} (Cap:{" "}
                        {bus.capacidad_maxima})
                      </option>
                    ))}
                  </select>
                  {formData.id_estacion && busesDisponibles.length === 0 && (
                    <p className="text-sm text-gray-500 mt-1">
                      No hay buses disponibles en esta estación
                    </p>
                  )}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pasajeros en el Bus
                  </label>
                  <input
                    type="number"
                    min="0"
                    maxLength={4}
                    value={formData.pasajeros_bus}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        pasajeros_bus: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-yellow-500"
                    placeholder="Número de pasajeros"
                    required
                  />
                </div>
              </>
            )}

            {tipoAlerta === "manual" && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Estación
                  </label>
                  <select
                    value={formData.id_estacion}
                    onChange={(e) => handleEstacionChange(e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Bus (Opcional)
                  </label>
                  <select
                    value={formData.id_bus}
                    onChange={(e) =>
                      setFormData({ ...formData, id_bus: e.target.value })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    disabled={!formData.id_estacion}
                  >
                    <option value="">Sin bus específico</option>
                    {busesDisponibles.map((bus) => (
                      <option key={bus.id_bus} value={bus.id_bus}>
                        {bus.numero_unidad} - {bus.placa}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Tipo de Alerta
                  </label>
                  <select
                    value={formData.tipo_alerta_manual}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        tipo_alerta_manual: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="">Selecciona el tipo</option>
                    <option value="emergencia">Emergencia</option>
                    <option value="mantenimiento">Mantenimiento</option>
                    <option value="retraso">Retraso</option>
                    <option value="vandalismo">Vandalismo</option>
                    <option value="falta_personal">Falta de Personal</option>
                    <option value="clima">Clima</option>
                    <option value="otro">Otro</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Prioridad
                  </label>
                  <select
                    value={formData.prioridad_manual}
                    onChange={(e) =>
                      setFormData({
                        ...formData,
                        prioridad_manual: e.target.value,
                      })
                    }
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    required
                  >
                    <option value="baja">Baja</option>
                    <option value="media">Media</option>
                    <option value="alta">Alta</option>
                    <option value="critica">Crítica</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Descripción
                  </label>
                  <textarea
                    value={formData.descripcion}
                    onChange={(e) =>
                      setFormData({ ...formData, descripcion: e.target.value })
                    }
                    maxLength={500}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500"
                    rows="4"
                    placeholder="Describe la situación..."
                    required
                  ></textarea>
                </div>
              </>
            )}

            {mensaje && (
              <div
                className={`p-4 rounded-lg border ${
                  mensaje.tipo === "success"
                    ? "bg-green-50 border-green-200"
                    : mensaje.tipo === "warning"
                    ? "bg-yellow-50 border-yellow-200"
                    : "bg-red-50 border-red-200"
                }`}
              >
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
                    {mensaje.data.estacion && (
                      <p className="text-gray-700">
                        Estación: {mensaje.data.estacion}
                      </p>
                    )}
                    {mensaje.data.pasajeros_actuales !== undefined && (
                      <>
                        <p className="text-gray-700">
                          Pasajeros: {mensaje.data.pasajeros_actuales}
                        </p>
                        <p className="text-gray-700">
                          Capacidad: {mensaje.data.capacidad_maxima}
                        </p>
                        <p
                          className={`font-semibold ${
                            mensaje.data.porcentaje_ocupacion >= 150
                              ? "text-red-600"
                              : "text-green-600"
                          }`}
                        >
                          Ocupación: {mensaje.data.porcentaje_ocupacion}%
                        </p>
                      </>
                    )}
                    {mensaje.data.bus && (
                      <>
                        <p className="text-gray-700">Bus: {mensaje.data.bus}</p>
                        <p className="text-gray-700">
                          Pasajeros: {mensaje.data.pasajeros}/
                          {mensaje.data.capacidad}
                        </p>
                        <p
                          className={`font-semibold ${
                            mensaje.data.porcentaje < 25
                              ? "text-yellow-600"
                              : "text-green-600"
                          }`}
                        >
                          Ocupación: {mensaje.data.porcentaje}%
                        </p>
                      </>
                    )}
                    {mensaje.data.alerta_generada && (
                      <div className="mt-3 p-3 bg-red-100 rounded border border-red-300">
                        <p className="text-red-800 font-bold">
                          ALERTA GENERADA
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
            )}

            <div className="flex gap-3 pt-4">
              {onClose && (
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 bg-gray-200 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-300"
                >
                  Cancelar
                </button>
              )}
              <button
                type="submit"
                disabled={loading}
                className={`flex-1 py-3 rounded-lg font-semibold ${
                  tipoAlerta === "alta_demanda"
                    ? "bg-red-600 hover:bg-red-700 text-white"
                    : tipoAlerta === "bus_vacio"
                    ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                    : "bg-orange-600 hover:bg-orange-700 text-white"
                } disabled:bg-gray-400`}
              >
                {loading ? "Procesando..." : "Generar Alerta"}
              </button>
            </div>
          </form>
        )}

        {!tipoAlerta && (
          <div className="p-12 text-center text-gray-500">
            <p className="text-lg">Selecciona un tipo de alerta</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerarAlerta;
