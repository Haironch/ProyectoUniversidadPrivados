import GenerarAlerta from "../../components/alertas/GenerarAlerta";

const GenerarAlertaPage = () => {
  const handleSuccess = () => {
    // Opcional: Mostrar notificación o refrescar lista
    console.log("Alerta generada exitosamente");
  };

  return <GenerarAlerta onSuccess={handleSuccess} />;
};

export default GenerarAlertaPage;
