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

    if (name === "dpi") {
      if (value === "" || (value.length <= 13 && /^\d*$/.test(value))) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else if (name === "telefono") {
      if (value === "" || (value.length <= 8 && /^\d*$/.test(value))) {
        setFormData((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
  };

  const handleHistorialChange = (e) => {
    const { name, value } = e.target;

    if (name === "anio_graduacion") {
      if (value === "" || (value.length <= 4 && /^\d*$/.test(value))) {
        setNuevoHistorial((prev) => ({
          ...prev,
          [name]: value,
        }));
      }
    } else {
      setNuevoHistorial((prev) => ({
        ...prev,
        [name]: value,
      }));
    }
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
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 overflow-y-auto p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl my-8 max-h-[90vh] overflow-y-auto">
        <div className="px-4 sm:px-6 py-3 sm:py-4 bg-purple-600 text-white rounded-t-lg sticky top-0 z-10">
          <h2 className="text-lg sm:text-xl font-bold">
            {pilotoId ? "Editar Piloto" : "Nuevo Piloto"}
          </h2>
        </div>

        <form
          onSubmit={handleSubmit}
          className="p-4 sm:p-6 space-y-4 sm:space-y-6"
        >
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 px-3 py-2 sm:px-4 sm:py-3 rounded text-sm">
              {error}
            </div>
          )}

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
              Información Personal
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
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
                  maxLength={50}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Apellido *
                </label>
                <input
                  type="text"
                  name="apellido"
                  value={formData.apellido}
                  onChange={handleChange}
                  required
                  maxLength={50}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  DPI *
                </label>
                <input
                  type="text"
                  name="dpi"
                  value={formData.dpi}
                  onChange={handleChange}
                  required
                  pattern="\d{13}"
                  maxLength={13}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="1234567890101"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Teléfono *
                </label>
                <input
                  type="text"
                  name="telefono"
                  value={formData.telefono}
                  onChange={handleChange}
                  required
                  pattern="\d{8}"
                  maxLength={8}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="12345678"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  maxLength={100}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="piloto@ejemplo.com"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
              Licencia de Conducir
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4">
              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Número de Licencia *
                </label>
                <input
                  type="text"
                  name="licencia"
                  value={formData.licencia}
                  onChange={handleChange}
                  required
                  maxLength={20}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Tipo de Licencia *
                </label>
                <select
                  name="tipo_licencia"
                  value={formData.tipo_licencia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                >
                  <option value="C">Tipo C</option>
                  <option value="B">Tipo B</option>
                  <option value="A">Tipo A</option>
                  <option value="M">Tipo M</option>
                  <option value="E">Tipo E</option>
                </select>
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Fecha de Vencimiento *
                </label>
                <input
                  type="date"
                  name="fecha_vencimiento_licencia"
                  value={formData.fecha_vencimiento_licencia}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          <div>
            <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
              Dirección de Residencia
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
              <div className="sm:col-span-2">
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Dirección *
                </label>
                <input
                  type="text"
                  name="direccion_residencia"
                  value={formData.direccion_residencia}
                  onChange={handleChange}
                  required
                  maxLength={200}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: 5ta Avenida 10-20, Zona 1"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Municipio *
                </label>
                <input
                  type="text"
                  name="municipio_residencia"
                  value={formData.municipio_residencia}
                  onChange={handleChange}
                  required
                  maxLength={100}
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                  placeholder="Ej: Guatemala"
                />
              </div>

              <div>
                <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                  Fecha de Contratación *
                </label>
                <input
                  type="date"
                  name="fecha_contratacion"
                  value={formData.fecha_contratacion}
                  onChange={handleChange}
                  required
                  className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                />
              </div>
            </div>
          </div>

          {!pilotoId && (
            <div>
              <h3 className="text-base sm:text-lg font-semibold text-gray-700 mb-3">
                Historial Educativo
              </h3>

              <div className="bg-gray-50 p-3 sm:p-4 rounded-lg mb-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4 mb-3">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Nivel Educativo
                    </label>
                    <select
                      name="nivel_educativo"
                      value={nuevoHistorial.nivel_educativo}
                      onChange={handleHistorialChange}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
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
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Institución
                    </label>
                    <input
                      type="text"
                      name="institucion"
                      value={nuevoHistorial.institucion}
                      onChange={handleHistorialChange}
                      maxLength={150}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Año de Graduación
                    </label>
                    <input
                      type="text"
                      name="anio_graduacion"
                      value={nuevoHistorial.anio_graduacion}
                      onChange={handleHistorialChange}
                      pattern="\d{4}"
                      maxLength={4}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                      placeholder="2020"
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Título Obtenido
                    </label>
                    <input
                      type="text"
                      name="titulo_obtenido"
                      value={nuevoHistorial.titulo_obtenido}
                      onChange={handleHistorialChange}
                      maxLength={150}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>

                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
                      Especialidad
                    </label>
                    <input
                      type="text"
                      name="especialidad"
                      value={nuevoHistorial.especialidad}
                      onChange={handleHistorialChange}
                      maxLength={100}
                      className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                    />
                  </div>
                </div>

                <button
                  type="button"
                  onClick={agregarHistorial}
                  className="w-full bg-purple-100 text-purple-700 py-2 px-4 rounded-md hover:bg-purple-200 transition text-sm sm:text-base font-medium"
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
                        <p className="font-medium text-gray-900 text-sm sm:text-base">
                          {registro.nivel_educativo?.charAt(0).toUpperCase() +
                            registro.nivel_educativo?.slice(1)}{" "}
                          - {registro.institucion}
                        </p>
                        <p className="text-xs sm:text-sm text-gray-500">
                          {registro.titulo_obtenido &&
                            `${registro.titulo_obtenido} • `}
                          {registro.anio_graduacion &&
                            `Año: ${registro.anio_graduacion}`}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => eliminarHistorial(index)}
                        className="text-red-600 hover:text-red-800 ml-4 text-sm sm:text-base"
                      >
                        Eliminar
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          <div>
            <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">
              Estado
            </label>
            <select
              name="estado"
              value={formData.estado}
              onChange={handleChange}
              className="w-full px-3 py-2 text-sm sm:text-base border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
            >
              <option value="activo">Activo</option>
              <option value="inactivo">Inactivo</option>
              <option value="suspendido">Suspendido</option>
              <option value="vacaciones">Vacaciones</option>
            </select>
          </div>

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
              className="w-full sm:flex-1 bg-purple-600 text-white py-2.5 sm:py-2 px-4 rounded-md hover:bg-purple-700 disabled:bg-gray-400 transition text-sm sm:text-base font-medium"
            >
              {loading ? "Guardando..." : pilotoId ? "Actualizar" : "Crear"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default PilotoForm;
