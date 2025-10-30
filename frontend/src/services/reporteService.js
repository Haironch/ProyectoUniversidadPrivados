import jsPDF from "jspdf";
import "jspdf-autotable";
import api from "./api";

export const getReporteLineasCompleto = async () => {
  try {
    const response = await api.get("/reportes/lineas-completo");
    return response.data;
  } catch (error) {
    console.error("Error al obtener reporte:", error);
    throw error;
  }
};

export const generarReporteLineasPDF = (lineas) => {
  const doc = new jsPDF();

  doc.setFontSize(20);
  doc.setFont(undefined, "bold");
  doc.text("SISTEMA TRANSMETRO", 105, 15, { align: "center" });

  doc.setFontSize(16);
  doc.text("Reporte de Líneas, Estaciones y Buses", 105, 23, {
    align: "center",
  });

  doc.setFontSize(10);
  doc.setFont(undefined, "normal");
  doc.text(
    `Fecha de generación: ${new Date().toLocaleDateString("es-GT")}`,
    14,
    32
  );
  doc.text(`Hora: ${new Date().toLocaleTimeString("es-GT")}`, 14, 37);

  let yPosition = 45;

  lineas.forEach((linea, index) => {
    if (yPosition > 250) {
      doc.addPage();
      yPosition = 20;
    }

    doc.setFillColor(37, 99, 235);
    doc.rect(14, yPosition - 5, 182, 8, "F");
    doc.setTextColor(255, 255, 255);
    doc.setFontSize(12);
    doc.setFont(undefined, "bold");
    doc.text(`${linea.codigo} - ${linea.nombre}`, 16, yPosition);
    yPosition += 10;

    doc.setTextColor(0, 0, 0);
    doc.setFontSize(9);
    doc.setFont(undefined, "normal");
    doc.text(`Distancia Total: ${linea.distancia_total} km`, 14, yPosition);
    doc.text(`Estado: ${linea.estado}`, 100, yPosition);
    yPosition += 5;
    doc.text(`Número de Estaciones: ${linea.numero_estaciones}`, 14, yPosition);
    doc.text(`Buses asignados: ${linea.buses?.length || 0}`, 100, yPosition);
    yPosition += 8;

    if (linea.estaciones && linea.estaciones.length > 0) {
      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("ESTACIONES", 14, yPosition);
      yPosition += 5;

      const estacionesData = linea.estaciones.map((est, idx) => {
        let distanciaAcumulada = 0;
        for (let i = 0; i <= idx; i++) {
          distanciaAcumulada += parseFloat(
            linea.estaciones[i].distancia_estacion_anterior || 0
          );
        }

        return [
          est.orden_secuencia,
          est.codigo,
          est.nombre,
          `${distanciaAcumulada.toFixed(2)} km`,
          est.estado,
        ];
      });

      doc.autoTable({
        startY: yPosition,
        head: [["Orden", "Código", "Nombre", "Distancia", "Estado"]],
        body: estacionesData,
        theme: "striped",
        headStyles: {
          fillColor: [59, 130, 246],
          fontSize: 9,
          fontStyle: "bold",
        },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 15 },
          1: { cellWidth: 25 },
          2: { cellWidth: 70 },
          3: { cellWidth: 30 },
          4: { cellWidth: 30 },
        },
      });

      yPosition = doc.lastAutoTable.finalY + 8;
    }

    if (linea.buses && linea.buses.length > 0) {
      if (yPosition > 220) {
        doc.addPage();
        yPosition = 20;
      }

      doc.setFontSize(10);
      doc.setFont(undefined, "bold");
      doc.text("BUSES ASIGNADOS", 14, yPosition);
      yPosition += 5;

      const busesData = linea.buses.map((bus) => [
        bus.numero_unidad,
        bus.placa,
        bus.modelo || "N/A",
        bus.capacidad_maxima.toString(),
        bus.estado,
      ]);

      doc.autoTable({
        startY: yPosition,
        head: [["Unidad", "Placa", "Modelo", "Capacidad", "Estado"]],
        body: busesData,
        theme: "grid",
        headStyles: {
          fillColor: [34, 197, 94],
          fontSize: 9,
          fontStyle: "bold",
        },
        bodyStyles: { fontSize: 8 },
        margin: { left: 14, right: 14 },
        columnStyles: {
          0: { cellWidth: 30 },
          1: { cellWidth: 35 },
          2: { cellWidth: 50 },
          3: { cellWidth: 30 },
          4: { cellWidth: 35 },
        },
      });

      yPosition = doc.lastAutoTable.finalY + 12;
    } else {
      doc.setFontSize(9);
      doc.setFont(undefined, "italic");
      doc.setTextColor(150, 150, 150);
      doc.text("Sin buses asignados", 14, yPosition);
      yPosition += 12;
    }
  });

  const pageCount = doc.internal.getNumberOfPages();
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setTextColor(150, 150, 150);
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width / 2,
      doc.internal.pageSize.height - 10,
      { align: "center" }
    );
  }

  doc.save(`Reporte_Lineas_${new Date().toISOString().split("T")[0]}.pdf`);
};

export default {
  getReporteLineasCompleto,
  generarReporteLineasPDF,
};
