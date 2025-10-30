import { useState, useEffect } from "react";
import reporteService from "../../services/reporteService";

const ReportesPage = () => {
  const [lineas, setLineas] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchReporte();
  }, []);

  const fetchReporte = async () => {
    setLoading(true);
    setError(null);
    try {
      const response = await reporteService.getReporteLineasCompleto();
      setLineas(response.data);
    } catch (err) {
      setError("Error al cargar el reporte");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerarPDF = () => {
    if (lineas.length === 0) {
      alert("No hay datos para generar el reporte");
      return;
    }
    reporteService.generarReporteLineasPDF(lineas);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Cargando reporte...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-lg overflow-hidden">
        <div className="px-6 py-4 bg-blue-600 text-white">
          <h1 className="text-2xl font-bold">Reportes del Sistema</h1>
          <p className="text-blue-100 mt-1">
            Generación de reportes de líneas, estaciones y buses
          </p>
        </div>

        <div className="p-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-4">
              {error}
            </div>
          )}

          <div className="mb-6">
            <button
              onClick={handleGenerarPDF}
              disabled={loading || lineas.length === 0}
              className="bg-red-600 text-white px-6 py-3 rounded-lg hover:bg-red-700 disabled:bg-gray-400 disabled:cursor-not-allowed font-semibold flex items-center gap-2"
            >
              <svg
                className="w-5 h-5"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                />
              </svg>
              Generar Reporte PDF
            </button>
          </div>

          <div className="border rounded-lg p-4 bg-gray-50 max-h-96 overflow-y-auto">
            <h2 className="font-semibold mb-4 text-lg">
              Vista Previa del Reporte
            </h2>

            {lineas.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                No hay datos disponibles
              </p>
            ) : (
              lineas.map((linea) => (
                <div
                  key={linea.id_linea}
                  className="mb-6 pb-4 border-b last:border-b-0"
                >
                  <h3 className="text-lg font-bold text-blue-600 mb-2">
                    {linea.codigo} - {linea.nombre}
                  </h3>

                  <div className="grid grid-cols-2 gap-4 text-sm text-gray-600 mb-3">
                    <div>
                      <span className="font-semibold">Distancia Total:</span>{" "}
                      {linea.distancia_total} km
                    </div>
                    <div>
                      <span className="font-semibold">Estado:</span>{" "}
                      {linea.estado}
                    </div>
                    <div>
                      <span className="font-semibold">Estaciones:</span>{" "}
                      {linea.numero_estaciones}
                    </div>
                    <div>
                      <span className="font-semibold">Buses:</span>{" "}
                      {linea.buses?.length || 0}
                    </div>
                  </div>

                  <div className="mt-3">
                    <p className="font-semibold text-sm mb-2">Estaciones:</p>
                    <ul className="text-sm text-gray-700 space-y-1">
                      {linea.estaciones?.map((est, idx) => (
                        <li key={est.id_estacion} className="flex items-start">
                          <span className="font-semibold mr-2">{idx + 1}.</span>
                          <span>
                            {est.codigo} - {est.nombre}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  {linea.buses && linea.buses.length > 0 && (
                    <div className="mt-3">
                      <p className="font-semibold text-sm mb-2">
                        Buses Asignados:
                      </p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                        {linea.buses.map((bus) => (
                          <div
                            key={bus.id_bus}
                            className="text-sm text-gray-700 bg-white p-2 rounded border"
                          >
                            <span className="font-semibold">
                              {bus.numero_unidad}
                            </span>{" "}
                            ({bus.placa}) - {bus.estado}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReportesPage;
