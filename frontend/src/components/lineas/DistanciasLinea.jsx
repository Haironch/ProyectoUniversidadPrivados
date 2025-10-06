// frontend/src/components/lineas/DistanciasLinea.jsx
import { useState, useEffect } from "react";
import distanciaService from "../../services/distanciaService";
import lineaService from "../../services/lineaService";

const DistanciasLinea = () => {
  const [lineas, setLineas] = useState([]);
  const [lineaSeleccionada, setLineaSeleccionada] = useState("");
  const [distanciaLinea, setDistanciaLinea] = useState(null);
  const [distanciasEstaciones, setDistanciasEstaciones] = useState([]);
  const [matrizDistancias, setMatrizDistancias] = useState([]);
  const [vistaActual, setVistaActual] = useState("estaciones"); // 'estaciones' o 'matriz'
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchLineas();
  }, []);

  const fetchLineas = async () => {
    try {
      const response = await lineaService.getLineas();
      setLineas(response.data);
    } catch (err) {
      console.error("Error al cargar líneas:", err);
    }
  };

  const handleLineaChange = async (e) => {
    const idLinea = e.target.value;
    setLineaSeleccionada(idLinea);

    if (!idLinea) {
      setDistanciaLinea(null);
      setDistanciasEstaciones([]);
      setMatrizDistancias([]);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Obtener distancia total de la línea
      const resLinea = await distanciaService.getDistanciaLinea(idLinea);
      setDistanciaLinea(resLinea.data);

      // Obtener distancias entre estaciones
      const resEstaciones = await distanciaService.getDistanciasEstacionesLinea(
        idLinea
      );
      setDistanciasEstaciones(resEstaciones.data);

      // Obtener matriz de distancias
      const resMatriz = await distanciaService.getMatrizDistancias(idLinea);
      setMatrizDistancias(resMatriz.data);
    } catch (err) {
      setError("Error al cargar distancias");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-indigo-600 text-white">
          <h1 className="text-2xl font-bold">Cálculo de Distancias</h1>
          <p className="text-indigo-100 mt-1">
            Puntos 12 y 13: Distancias entre estaciones
          </p>
        </div>

        <div className="p-6">
          {/* Selector de línea */}
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Línea
            </label>
            <select
              value={lineaSeleccionada}
              onChange={handleLineaChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="">-- Selecciona una línea --</option>
              {lineas.map((l) => (
                <option key={l.id_linea} value={l.id_linea}>
                  {l.codigo} - {l.nombre}
                </option>
              ))}
            </select>
          </div>

          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          {loading && (
            <div className="text-center py-8">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Calculando distancias...</p>
            </div>
          )}

          {!loading && distanciaLinea && (
            <>
              {/* Información general de la línea */}
              <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-indigo-900 mb-2">
                  {distanciaLinea.nombre} ({distanciaLinea.codigo})
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Distancia Total:</span>
                    <span className="ml-2 font-bold text-indigo-900">
                      {parseFloat(distanciaLinea.distancia_total).toFixed(2)} km
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Número de Estaciones:</span>
                    <span className="ml-2 font-bold text-indigo-900">
                      {distanciaLinea.numero_estaciones}
                    </span>
                  </div>
                </div>
              </div>

              {/* Tabs para cambiar vista */}
              <div className="mb-4 border-b border-gray-200">
                <nav className="flex space-x-4">
                  <button
                    onClick={() => setVistaActual("estaciones")}
                    className={`py-2 px-4 font-medium text-sm border-b-2 transition ${
                      vistaActual === "estaciones"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Distancias por Estación
                  </button>
                  <button
                    onClick={() => setVistaActual("matriz")}
                    className={`py-2 px-4 font-medium text-sm border-b-2 transition ${
                      vistaActual === "matriz"
                        ? "border-indigo-600 text-indigo-600"
                        : "border-transparent text-gray-500 hover:text-gray-700"
                    }`}
                  >
                    Matriz de Distancias
                  </button>
                </nav>
              </div>

              {/* Vista de estaciones */}
              {vistaActual === "estaciones" && (
                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Orden
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Estación
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Distancia desde Anterior (km)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Distancia desde Inicio (km)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Tiempo Estimado (min)
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {distanciasEstaciones.map((estacion) => (
                        <tr
                          key={estacion.id_linea_estacion}
                          className="hover:bg-gray-50"
                        >
                          <td className="px-6 py-4 whitespace-nowrap text-sm">
                            {estacion.orden_secuencia}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {estacion.estacion_nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {estacion.estacion_codigo}
                              {estacion.es_estacion_inicial && (
                                <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded-full text-xs">
                                  Inicial
                                </span>
                              )}
                              {estacion.es_estacion_final && (
                                <span className="ml-2 px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs">
                                  Final
                                </span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                            {parseFloat(
                              estacion.distancia_estacion_anterior
                            ).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-indigo-600">
                            {parseFloat(
                              estacion.distancia_desde_inicio
                            ).toFixed(2)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {estacion.tiempo_estimado_minutos}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}

              {/* Vista de matriz */}
              {vistaActual === "matriz" && (
                <div className="overflow-x-auto">
                  <p className="text-sm text-gray-600 mb-4">
                    Mostrando {matrizDistancias.length} combinaciones de
                    distancias entre estaciones
                  </p>
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead className="bg-gray-50">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Origen
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Destino
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Distancia (km)
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">
                          Estaciones Intermedias
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {matrizDistancias.map((dist, index) => (
                        <tr key={index} className="hover:bg-gray-50">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {dist.origen.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dist.origen.codigo} (Orden: {dist.origen.orden})
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {dist.destino.nombre}
                            </div>
                            <div className="text-sm text-gray-500">
                              {dist.destino.codigo} (Orden: {dist.destino.orden}
                              )
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm font-bold text-indigo-600">
                            {parseFloat(dist.distancia_km).toFixed(2)} km
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            {dist.estaciones_intermedias}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default DistanciasLinea;
