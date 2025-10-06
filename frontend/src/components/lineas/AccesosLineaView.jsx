// frontend/src/components/lineas/AccesosLineaView.jsx
import { useState, useEffect } from "react";
import lineaService from "../../services/lineaService";

const AccesosLineaView = () => {
  const [lineas, setLineas] = useState([]);
  const [lineaSeleccionada, setLineaSeleccionada] = useState("");
  const [accesosData, setAccesosData] = useState(null);
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
      setAccesosData(null);
      setError(null);
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await lineaService.getAccesosByLinea(idLinea);

      // Si la respuesta es exitosa pero sin datos
      if (response.success && response.total_accesos === 0) {
        setError("Esta línea no tiene accesos registrados");
        setAccesosData(null);
      } else {
        setAccesosData(response);
      }
    } catch (err) {
      // Manejo específico según el tipo de error
      if (err.response?.status === 404) {
        setError(
          err.response?.data?.message ||
            "No se encontraron accesos para esta línea"
        );
      } else if (err.response?.status === 500) {
        setError("Error del servidor al cargar los accesos");
      } else if (err.request) {
        setError("No se pudo conectar con el servidor");
      } else {
        setError("Error al cargar accesos de la línea");
      }
      setAccesosData(null);
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-cyan-600 text-white">
          <h1 className="text-2xl font-bold">Accesos por Línea</h1>
          <p className="text-cyan-100 mt-1">
            Punto 8: Consulta de todos los accesos de una línea
          </p>
        </div>

        <div className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Seleccionar Línea
            </label>
            <select
              value={lineaSeleccionada}
              onChange={handleLineaChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-cyan-500"
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
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-cyan-600 mx-auto"></div>
              <p className="text-gray-600 mt-4">Cargando accesos...</p>
            </div>
          )}

          {!loading && accesosData && (
            <>
              <div className="bg-cyan-50 border border-cyan-200 rounded-lg p-4 mb-6">
                <h3 className="font-semibold text-cyan-900 mb-2">
                  {accesosData.linea.nombre} ({accesosData.linea.codigo})
                </h3>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Total de Estaciones:</span>
                    <span className="ml-2 font-bold text-cyan-900">
                      {accesosData.total_estaciones}
                    </span>
                  </div>
                  <div>
                    <span className="text-gray-600">Total de Accesos:</span>
                    <span className="ml-2 font-bold text-cyan-900">
                      {accesosData.total_accesos}
                    </span>
                  </div>
                </div>
              </div>

              <div className="space-y-6">
                {accesosData.data.map((estacion) => (
                  <div
                    key={estacion.id_estacion}
                    className="border border-gray-200 rounded-lg overflow-hidden"
                  >
                    <div className="bg-gray-50 px-4 py-3 border-b border-gray-200">
                      <div className="flex justify-between items-center">
                        <div>
                          <h4 className="font-semibold text-gray-900">
                            {estacion.estacion_nombre}
                          </h4>
                          <p className="text-sm text-gray-500">
                            {estacion.estacion_codigo} - Orden:{" "}
                            {estacion.orden_secuencia}
                          </p>
                        </div>
                        <span className="px-3 py-1 bg-cyan-100 text-cyan-800 rounded-full text-sm font-semibold">
                          {estacion.accesos.length} acceso(s)
                        </span>
                      </div>
                    </div>
                    <div className="p-4">
                      <table className="min-w-full">
                        <thead className="bg-gray-50">
                          <tr>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Nombre
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Tipo
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Horario
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Guardias
                            </th>
                            <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase">
                              Estado
                            </th>
                          </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-200">
                          {estacion.accesos.map((acceso) => (
                            <tr key={acceso.id_acceso}>
                              <td className="px-4 py-3 text-sm text-gray-900">
                                {acceso.nombre}
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    acceso.tipo === "principal"
                                      ? "bg-blue-100 text-blue-800"
                                      : acceso.tipo === "secundario"
                                      ? "bg-gray-100 text-gray-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {acceso.tipo}
                                </span>
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {acceso.hora_apertura?.substring(0, 5)} -{" "}
                                {acceso.hora_cierre?.substring(0, 5)}
                              </td>
                              <td className="px-4 py-3 text-sm text-gray-500">
                                {acceso.guardias_asignados} guardia(s)
                              </td>
                              <td className="px-4 py-3 text-sm">
                                <span
                                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                                    acceso.esta_activo
                                      ? "bg-green-100 text-green-800"
                                      : "bg-red-100 text-red-800"
                                  }`}
                                >
                                  {acceso.esta_activo ? "Activo" : "Inactivo"}
                                </span>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};

export default AccesosLineaView;
