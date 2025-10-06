// frontend/src/components/personal/PilotoForm.jsx
import { useState, useEffect } from "react";
import pilotoService from "../../services/pilotoService";

const PilotoForm = ({ pilotoId, onClose, onSuccess }) => {
  const [formData, setFormData] = useState({
    nombre: "",
    apellido: "",
    dpi: "",
    licencia: "",
    tipo_licencia: "C",
    fecha_vencimiento_licencia: "",
    direccion_residencia: "",
    municipio_residencia: "",
    telefono: "",
    email: "",
    fecha_contratacion: "",
    estado: "activo",
  });

  const [historialEducativo, setHistorialEducativo] = useState([]);
  const [nuevoHistorial, setNuevoHistorial] = useState({
    nivel_educativo: "",
    institucion: "",
    anio_graduacion: "",
    titulo_obtenido: "",
    especialidad: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (pilotoId) {
      fetchPiloto();
    }
  }, [pilotoId]);

  const fetchPiloto = async () => {
    try {
      const response = await pilotoService.getPilotoById(pilotoId);
      const { historial_educativo, ...pilotoData } = response.data;
      setFormData(pilotoData);
      setHistorialEducativo(historial_educativo || []);
    } catch (err) {
      setError("Error al cargar el piloto");
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

  const handleHistorialChange = (e) => {
    const { name, value } = e.target;
    setNuevoHistorial((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const agregarHistorial = () => {
    if (!nuevoHistorial.nivel_educativo || !nuevoHistorial.institucion) {
      alert("Nivel educativo e institución son obligatorios");
      return;
    }

    setHistorialEducativo((prev) => [...prev, { ...nuevoHistorial }]);
    setNuevoHistorial({
      nivel_educativo: "",
      institucion: "",
      anio_graduacion: "",
      titulo_obtenido: "",
      especialidad: "",
    });
  };

  const eliminarHistorial = (index) => {
    setHistorialEducativo((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const dataToSend = {
        ...formData,
        historial_educativo: historialEducativo,
      };

      if (pilotoId) {
        await pilotoService.updatePiloto(pilotoId, formData);
      } else {
        await pilotoService.createPiloto(dataToSend);
      }
      onSuccess();
      onClose();
    } catch (err) {
      setError(err.response?.data?.message || "Error al guardar el piloto");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto">
      <div className="bg-white rounded-lg shadow-xl max-w-4xl w-full mx-4 my-8 max-h-[90vh] overflow-y-auto">
        <div className="px-6 py-4 bg-purple-600 text-white rounded-t-lg">
          <h2 className="text-xl font-bold">
            {pilotoId ? "Editar Piloto" : "Nuevo Piloto"}
          </h2>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded">
              {error}
            </div>
          )}

          {/* Información Personal */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Información Personal
            </h3>
            <div className="grid grid-cols-2 gap-4">
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
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  DPI *
                </label>
                <input
                  type="text"
                  name="dpi"
                  value={formData.dpi}
                  onChange={handleChange}
                  required
                  maxLength="13"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1234567890101"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="tel"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="12345678"
                />
              </div>

              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="piloto@ejemplo.com"
                />
              </div>
            </div>
          </div>

          {/* Información de Licencia */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Licencia de Conducir
            </h3>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Número de Licencia *
                </label>
                <input
                  type="text"
                  name="licencia"
                  value={formData.licencia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Tipo de Licencia *
                </label>
                <select
                  name="tipo_licencia"
                  value={formData.tipo_licencia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="C">Tipo C</option>
                  <option value="B">Tipo B</option>
                  <option value="A">Tipo A</option>
                  <option value="M">Tipo M</option>
                  <option value="E">Tipo E</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  name="fecha_vencimiento_licencia"
                  value={formData.fecha_vencimiento_licencia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Residencia */}
          <div>
            <h3 className="text-lg font-semibold text-gray-700 mb-3">
              Dirección de Residencia
            </h3>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccion_residencia"
                  value={formData.direccion_residencia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: 5ta Avenida 10-20, Zona 1"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Municipio *
                </label>
                <input
                  type="text"
                  name="municipio_residencia"
                  value={formData.municipio_residencia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Guatemala"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Fecha de Contratación *
                </label>
                <input
                  type="date"
                  name="fecha_contratacion"
                  value={formData.fecha_contratacion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {/* Historial Educativo */}
          {!pilotoId && (
            <div>
              <h3 className="text-lg font-semibold text-gray-700 mb-3">
                Historial Educativo
              </h3>

              <div className="bg-gray-50 p-4 rounded-lg mb-4">
                <div className="grid grid-cols-2 gap-4 mb-3">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Nivel Educativo
                    </label>
                    <select
                      name="nivel_educativo"
                      value={nuevoHistorial.nivel_educativo}
                      onChange={handleHistorialChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    >
                      <option value="">Seleccionar</option>
                      <option value="primaria">Primaria</option>
                      <option value="basicos">Básicos</option>
                      <option value="diversificado">Diversificado</option>
                      <option value="universidad">Universidad</option>
                      <option value="postgrado">Postgrado</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Institución
                    </label>
                    <input
                      type="text"
                      name="institucion"
                      value={nuevoHistorial.institucion}
                      onChange={handleHistorialChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Año de Graduación
                    </label>
                    <input
                      type="number"
                      name="anio_graduacion"
                      value={nuevoHistorial.anio_graduacion}
                      onChange={handleHistorialChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="2020"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Título Obtenido
                    </label>
                    <input
                      type="text"
                      name="titulo_obtenido"
                      value={nuevoHistorial.titulo_obtenido}
                      onChange={handleHistorialChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="col-span-2">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Especialidad
                    </label>
                    <input
                      type="text"
                      name="especialidad"
                      value={nuevoHistorial.especialidad}
                      onChange={handleHistorialChange}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={agregarHistorial}
                  className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-md hover:bg-purple-200 transition"
                >
                  + Agregar Registro Educativo
                </button>
              </div>

              {historialEducativo.length > 0 && (
                <div className="space-y-2">
                  {historialEducativo.map((registro, index) => (
                    <div
                      key={index}
                      className="flex items-center justify-between bg-white border border-gray-200 p-3 rounded-md"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-gray-900">
                          {registro.nivel_educativo?.charAt(0).toUpperCase() +
                            registro.nivel_educativo?.slice(1)}{" "}
                          - {registro.institucion}
                        </p>
                        <p className="text-sm text-gray-500">
                          {registro.titulo_obtenido &&
                            `${registro.titulo_obtenido} • `}
                          {registro.anio_graduacion &&
                            `Año: ${registro.anio_graduacion}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarHistorial(index)}
                        className="text-red-600 hover:text-red-800 ml-4"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* Estado */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
              <option value="vacaciones">Vacaciones</option>
            </select>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition"
            >
              {loading ? "Guardando..." : pilotoId ? "Actualizar" : "Crear"}
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

export default PilotoForm;
