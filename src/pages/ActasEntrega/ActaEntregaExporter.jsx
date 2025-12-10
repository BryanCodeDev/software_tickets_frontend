import jsPDF from 'jspdf';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableCell, TableRow, WidthType, AlignmentType, BorderStyle } from 'docx';

export const exportToPDF = async (acta, equipo) => {
  const pdf = new jsPDF();
  const pageWidth = 210;
  const margin = 15;
  const contentWidth = pageWidth - (margin * 2);

  // Colores corporativos
  const primaryColor = [102, 45, 145]; // Morado corporativo (#662d91)
  const secondaryColor = [52, 73, 94]; // Gris oscuro
  const accentColor = [149, 165, 166]; // Gris claro

  // Encabezado moderno con banda de color
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 0, pageWidth, 35, 'F');

  // Logo/Título empresa en blanco
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(18);
  pdf.setFont('helvetica', 'bold');
  pdf.text('DuvyClass S.A.S', margin, 15);
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'normal');
  pdf.text('NIT: 901.456.789-1', margin, 22);
  
  // Fecha en el lado derecho del encabezado
  const fecha = new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const hora = new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' });
  pdf.setFontSize(8);
  pdf.text(`${fecha} | ${hora}`, pageWidth - margin, 15, { align: 'right' });
  pdf.text('Acta de Entrega', pageWidth - margin, 20, { align: 'right' });

  // Resetear color de texto
  pdf.setTextColor(0, 0, 0);

  // Título principal con estilo
  let yPos = 45;
  pdf.setFontSize(14);
  pdf.setFont('helvetica', 'bold');
  pdf.setTextColor(...secondaryColor);
  pdf.text('ACTA DE ENTREGA DE EQUIPOS', pageWidth / 2, yPos, { align: 'center' });
  pdf.setFontSize(11);
  pdf.text('Comunicación y Cómputo', pageWidth / 2, yPos + 6, { align: 'center' });
  
  // Línea decorativa
  pdf.setDrawColor(...primaryColor);
  pdf.setLineWidth(0.8);
  pdf.line(margin + 40, yPos + 9, pageWidth - margin - 40, yPos + 9);

  yPos = 62;
  pdf.setTextColor(0, 0, 0);

  // Sección de información del receptor en dos columnas
  pdf.setFillColor(245, 245, 245);
  pdf.rect(margin, yPos, contentWidth, 18, 'F');
  
  pdf.setFontSize(9);
  pdf.setFont('helvetica', 'bold');
  pdf.text('RECEPTOR:', margin + 3, yPos + 5);
  pdf.setFont('helvetica', 'normal');
  pdf.text(acta.usuarioRecibe?.name || 'N/A', margin + 30, yPos + 5);
  
  pdf.setFont('helvetica', 'bold');
  pdf.text('CARGO:', margin + 3, yPos + 11);
  pdf.setFont('helvetica', 'normal');
  pdf.text(acta.cargo_recibe || 'N/A', margin + 30, yPos + 11);

  pdf.setFont('helvetica', 'bold');
  pdf.text('FECHA:', pageWidth - margin - 50, yPos + 5);
  pdf.setFont('helvetica', 'normal');
  pdf.text(new Date(acta.fecha_entrega).toLocaleDateString('es-ES'), pageWidth - margin - 30, yPos + 5);

  yPos += 24;

  // Información del equipo en tabla compacta
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('INFORMACIÓN DEL EQUIPO', margin, yPos);
  yPos += 6;

  pdf.setTextColor(0, 0, 0);
  pdf.setDrawColor(...accentColor);
  pdf.setLineWidth(0.1);
  
  const drawInfoRow = (label, value, label2, value2, y) => {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(8);
    pdf.text(label, margin + 2, y);
    pdf.setFont('helvetica', 'normal');
    pdf.text(String(value), margin + 35, y);
    
    if (label2) {
      pdf.setFont('helvetica', 'bold');
      pdf.text(label2, margin + 100, y);
      pdf.setFont('helvetica', 'normal');
      pdf.text(String(value2), margin + 125, y);
    }
    
    pdf.line(margin, y + 1.5, pageWidth - margin, y + 1.5);
  };

  // Mostrar equipo con IT y marca en formato: IT0016 - LENOVO (MP13ZXQN)
  const equipoInfo = equipo ? `${equipo.it || 'N/A'} - ${equipo.marca || 'N/A'} (${equipo.serial || 'N/A'})` : 'N/A';
  drawInfoRow('Equipo:', equipoInfo, 'Modelo:', acta.modelo_equipo || equipo?.propiedad || 'N/A', yPos);
  yPos += 6;

  drawInfoRow('Serial/IMEI:', acta.serial_imei || equipo?.serial || 'N/A', 'Procesador:', acta.procesador || equipo?.it || 'N/A', yPos);
  yPos += 6;
  
  drawInfoRow('Almacenamiento:', acta.almacenamiento || equipo?.capacidad || 'N/A', 'RAM:', acta.ram || equipo?.ram || 'N/A', yPos);
  yPos += 6;
  
  drawInfoRow('S.O:', acta.sistema_operativo || 'N/A', 'Línea:', acta.linea_telefonica || 'N/A', yPos);
  yPos += 8;

  // Accesorios en formato compacto con checkboxes
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('ACCESORIOS', margin, yPos);
  yPos += 6;

  pdf.setFontSize(8);
  pdf.setTextColor(0, 0, 0);
  
  const drawCheckbox = (label, checked, x, y) => {
    pdf.setDrawColor(...secondaryColor);
    pdf.rect(x, y - 3, 3, 3);
    if (checked) {
      pdf.setFillColor(...primaryColor);
      pdf.rect(x + 0.5, y - 2.5, 2, 2, 'F');
    }
    pdf.setFont('helvetica', 'normal');
    pdf.text(label, x + 5, y);
  };

  drawCheckbox('Cargador', acta.accesorio_cargador, margin + 2, yPos);
  drawCheckbox('Teclado', acta.accesorio_teclado, margin + 35, yPos);
  drawCheckbox('Office', acta.accesorio_office, margin + 65, yPos);
  yPos += 5;
  drawCheckbox('Antivirus', acta.accesorio_antivirus, margin + 2, yPos);
  drawCheckbox('SSD', acta.accesorio_ssd, margin + 35, yPos);
  drawCheckbox('HDD', acta.accesorio_hdd, margin + 65, yPos);
  yPos += 8;

  // Observaciones del equipo
  if (acta.observaciones_equipo) {
    pdf.setFont('helvetica', 'bold');
    pdf.setFontSize(9);
    pdf.text('Observaciones:', margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(8);
    const obsLines = pdf.splitTextToSize(acta.observaciones_equipo, contentWidth - 4);
    pdf.text(obsLines, margin + 2, yPos + 4);
    yPos += 4 + (obsLines.length * 4);
  }

  yPos += 3;

  // Políticas de uso compactas
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(10);
  pdf.setTextColor(...primaryColor);
  pdf.text('POLÍTICAS DE USO', margin, yPos);
  yPos += 5;

  pdf.setFontSize(7);
  pdf.setTextColor(0, 0, 0);
  pdf.setFont('helvetica', 'normal');
  
  const politicas = [
    'El equipo es de uso exclusivo para funciones laborales. El usuario es responsable de su cuidado y mantenimiento.',
    '• Verificar estado inicial • Reportar daños/robos al área IT • No instalar software no autorizado',
    '• Realizar copias de seguridad • Navegar solo en páginas permitidas • Mantener privacidad de información',
    '• Al retiro, entregar todos los equipos al área IT para revisión'
  ];

  politicas.forEach((pol, i) => {
    const lines = pdf.splitTextToSize(pol, contentWidth - 4);
    pdf.text(lines, margin + 2, yPos);
    yPos += lines.length * 3.5;
  });

  yPos += 3;

  // Aceptación
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ACEPTACIÓN DE POLÍTICAS:', margin, yPos);
  drawCheckbox('SI', acta.acepta_politica, margin + 55, yPos);
  drawCheckbox('NO', !acta.acepta_politica, margin + 75, yPos);
  yPos += 8;

  // Información de entrega
  pdf.setFont('helvetica', 'bold');
  pdf.setFontSize(9);
  pdf.text('ESTADO:', margin, yPos);
  pdf.setFont('helvetica', 'normal');
  pdf.text(acta.estado_equipo_entrega || 'N/A', margin + 20, yPos);
  
  if (acta.observaciones_entrega) {
    pdf.setFont('helvetica', 'bold');
    pdf.text('OBS:', margin + 80, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(acta.observaciones_entrega.substring(0, 40), margin + 95, yPos);
  }
  yPos += 8;

  // Firmas en horizontal compacto
  pdf.setFontSize(8);
  pdf.setFont('helvetica', 'bold');
  
  const firma1X = margin + 20;
  const firma2X = pageWidth - margin - 60;
  
  pdf.text('RECIBE', firma1X, yPos);
  pdf.text('ENTREGA', firma2X, yPos);
  yPos += 2;
  
  pdf.setLineWidth(0.3);
  pdf.line(firma1X - 10, yPos + 8, firma1X + 40, yPos + 8);
  pdf.line(firma2X - 10, yPos + 8, firma2X + 40, yPos + 8);
  
  yPos += 11;
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(7);
  pdf.text(acta.usuarioRecibe?.name || 'N/A', firma1X, yPos);
  pdf.text(acta.usuarioEntrega?.name || 'N/A', firma2X, yPos);
  yPos += 3;
  pdf.text(acta.cargo_recibe || 'N/A', firma1X, yPos);
  pdf.text(acta.usuarioEntrega?.role?.name || 'N/A', firma2X, yPos);

  // Pie de página moderno
  pdf.setFillColor(...primaryColor);
  pdf.rect(0, 287, pageWidth, 10, 'F');
  pdf.setTextColor(255, 255, 255);
  pdf.setFontSize(7);
  pdf.text('Documento generado automáticamente por el sistema de gestión DuvyClass', pageWidth / 2, 292.5, { align: 'center' });

  // Página de devolución si existe
  if (acta.fecha_devolucion) {
    pdf.addPage();
    
    // Encabezado de devolución
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 0, pageWidth, 35, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(18);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DuvyClass S.A.S', margin, 15);
    pdf.setFontSize(9);
    pdf.setFont('helvetica', 'normal');
    pdf.text('NIT: 901.456.789-1', margin, 22);
    pdf.setFontSize(8);
    pdf.text(`${new Date().toLocaleDateString('es-ES')} | ${new Date().toLocaleTimeString('es-ES')}`, pageWidth - margin, 15, { align: 'right' });

    yPos = 45;
    pdf.setTextColor(...secondaryColor);
    pdf.setFontSize(14);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DEVOLUCIÓN DEL EQUIPO', pageWidth / 2, yPos, { align: 'center' });
    pdf.setLineWidth(0.8);
    pdf.setDrawColor(...primaryColor);
    pdf.line(margin + 40, yPos + 3, pageWidth - margin - 40, yPos + 3);

    yPos = 58;
    pdf.setTextColor(0, 0, 0);
    pdf.setFontSize(9);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Serial:', margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(acta.serial_imei || 'N/A', margin + 20, yPos);
    
    pdf.setFont('helvetica', 'bold');
    pdf.text('Fecha:', pageWidth - margin - 50, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(new Date(acta.fecha_devolucion).toLocaleDateString('es-ES'), pageWidth - margin - 30, yPos);
    
    yPos += 8;
    pdf.setFont('helvetica', 'bold');
    pdf.text('Estado:', margin, yPos);
    pdf.setFont('helvetica', 'normal');
    pdf.text(acta.estado_equipo_devolucion || 'N/A', margin + 20, yPos);
    
    if (acta.observaciones_devolucion) {
      yPos += 8;
      pdf.setFont('helvetica', 'bold');
      pdf.text('Observaciones:', margin, yPos);
      pdf.setFont('helvetica', 'normal');
      const devLines = pdf.splitTextToSize(acta.observaciones_devolucion, contentWidth - 4);
      pdf.text(devLines, margin + 2, yPos + 4);
      yPos += 4 + (devLines.length * 4);
    }

    yPos += 12;
    pdf.setFontSize(8);
    pdf.setFont('helvetica', 'bold');
    pdf.text('RECIBE (IT)', firma1X, yPos);
    pdf.text('ENTREGA', firma2X, yPos);
    yPos += 2;
    pdf.line(firma1X - 10, yPos + 8, firma1X + 40, yPos + 8);
    pdf.line(firma2X - 10, yPos + 8, firma2X + 40, yPos + 8);
    yPos += 11;
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(7);
    pdf.text(acta.usuarioEntrega?.name || 'N/A', firma1X, yPos);
    pdf.text(acta.usuarioRecibe?.name || 'N/A', firma2X, yPos);

    // Pie de página
    pdf.setFillColor(...primaryColor);
    pdf.rect(0, 287, pageWidth, 10, 'F');
    pdf.setTextColor(255, 255, 255);
    pdf.setFontSize(7);
    pdf.text('Documento generado automáticamente por el sistema de gestión DuvyClass', pageWidth / 2, 292.5, { align: 'center' });
  }

  pdf.save(`acta-entrega-${acta.id}.pdf`);
};

export const exportToWord = async (acta, equipo) => {
  const doc = new Document({
    sections: [{
      properties: {
        page: {
          margin: {
            top: 1000,
            right: 1000,
            bottom: 1000,
            left: 1000,
          },
        },
      },
      children: [
        // Encabezado con tabla
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          borders: {
            top: { style: BorderStyle.NONE },
            bottom: { style: BorderStyle.SINGLE, size: 20, color: "662D91" },
            left: { style: BorderStyle.NONE },
            right: { style: BorderStyle.NONE },
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: "DuvyClass S.A.S", bold: true, size: 32, color: "662D91" }),
                      ],
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: "NIT: 901.456.789-1", size: 18 }),
                      ],
                    }),
                  ],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                }),
                new TableCell({
                  children: [
                    new Paragraph({
                      children: [
                        new TextRun({ text: `Fecha: ${new Date().toLocaleDateString('es-ES')}`, size: 18 }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                    new Paragraph({
                      children: [
                        new TextRun({ text: "Acta de Entrega", size: 18 }),
                      ],
                      alignment: AlignmentType.RIGHT,
                    }),
                  ],
                  borders: {
                    top: { style: BorderStyle.NONE },
                    bottom: { style: BorderStyle.NONE },
                    left: { style: BorderStyle.NONE },
                    right: { style: BorderStyle.NONE },
                  },
                }),
              ],
            }),
          ],
        }),
        
        new Paragraph({ text: "" }),

        // Título principal
        new Paragraph({
          children: [
            new TextRun({
              text: "ACTA DE ENTREGA DE EQUIPOS",
              bold: true,
              size: 28,
              color: "662D91",
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Comunicación y Cómputo",
              size: 22,
              color: "662D91",
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
        
        new Paragraph({ text: "" }),

        // Información del receptor
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "RECEPTOR:", bold: true })] })],
                  shading: { fill: "F5F5F5" },
                }),
                new TableCell({
                  children: [new Paragraph(acta.usuarioRecibe?.name || 'N/A')],
                }),
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "FECHA:", bold: true })] })],
                  shading: { fill: "F5F5F5" },
                }),
                new TableCell({
                  children: [new Paragraph(new Date(acta.fecha_entrega).toLocaleDateString('es-ES'))],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph({ children: [new TextRun({ text: "CARGO:", bold: true })] })],
                  shading: { fill: "F5F5F5" },
                }),
                new TableCell({
                  children: [new Paragraph(acta.cargo_recibe || 'N/A')],
                  columnSpan: 3,
                }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "" }),

        // Información del equipo
        new Paragraph({
          children: [new TextRun({ text: "INFORMACIÓN DEL EQUIPO", bold: true, size: 24, color: "662D91" })],
        }),
        
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Equipo:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph(equipo ? `${equipo.it || 'N/A'} - ${equipo.marca || 'N/A'} (${equipo.serial || 'N/A'})` : 'N/A')] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Modelo:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph(acta.modelo_equipo || equipo?.propiedad || 'N/A')] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Serial/IMEI:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph(acta.serial_imei || equipo?.serial || 'N/A')] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Procesador:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph(acta.procesador || equipo?.it || 'N/A')] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Almacenamiento:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph(acta.almacenamiento || equipo?.capacidad || 'N/A')] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "RAM:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph(acta.ram || equipo?.ram || 'N/A')] }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "S.O:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph(acta.sistema_operativo || 'N/A')] }),
                new TableCell({ children: [new Paragraph({ children: [new TextRun({ text: "Línea:", bold: true })] })] }),
                new TableCell({ children: [new Paragraph(acta.linea_telefonica || 'N/A')] }),
              ],
            }),
          ],
        }),

        new Paragraph({ text: "" }),

        // Accesorios
        new Paragraph({
          children: [new TextRun({ text: "ACCESORIOS", bold: true, size: 20, color: "662D91" })],
        }),
        new Paragraph(`☑ Cargador: ${acta.accesorio_cargador ? 'Sí' : 'No'}  |  ☑ Teclado: ${acta.accesorio_teclado ? 'Sí' : 'No'}  |  ☑ Office: ${acta.accesorio_office ? 'Sí' : 'No'}`),
        new Paragraph(`☑ Antivirus: ${acta.accesorio_antivirus ? 'Sí' : 'No'}  |  ☑ SSD: ${acta.accesorio_ssd ? 'Sí' : 'No'}  |  ☑ HDD: ${acta.accesorio_hdd ? 'Sí' : 'No'}`),

        new Paragraph({ text: "" }),

        // Observaciones
        ...(acta.observaciones_equipo ? [
          new Paragraph({
            children: [new TextRun({ text: "Observaciones:", bold: true })],
          }),
          new Paragraph(acta.observaciones_equipo),
          new Paragraph({ text: "" }),
        ] : []),

        // Políticas resumidas
        new Paragraph({
          children: [new TextRun({ text: "POLÍTICAS DE USO", bold: true, size: 20, color: "662D91" })],
        }),
        new Paragraph("El equipo es de uso exclusivo para funciones laborales. El usuario es responsable de su cuidado, mantenimiento y seguridad."),
        new Paragraph("• Verificar estado inicial • Reportar daños/robos al IT • No instalar software no autorizado"),
        new Paragraph("• Realizar copias de seguridad • Mantener privacidad • Al retiro, entregar equipos al IT"),

        new Paragraph({ text: "" }),

        // Aceptación
        new Paragraph(`Acepto las políticas: ${acta.acepta_politica ? '☑ SÍ' : '☐ NO'}`),

        new Paragraph({ text: "" }),

        // Estado y firmas
        new Paragraph({
          children: [new TextRun({ text: `ESTADO: ${acta.estado_equipo_entrega || 'N/A'}`, bold: true })],
        }),
        ...(acta.observaciones_entrega ? [new Paragraph(`Observaciones: ${acta.observaciones_entrega}`)] : []),

        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),

        // Tabla de firmas
        new Table({
          width: { size: 100, type: WidthType.PERCENTAGE },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "RECIBE", bold: true })], alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "____________________", alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: acta.usuarioRecibe?.name || 'N/A', alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: acta.cargo_recibe || 'N/A', alignment: AlignmentType.CENTER }),
                  ],
                }),
                new TableCell({
                  children: [
                    new Paragraph({ children: [new TextRun({ text: "ENTREGA", bold: true })], alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: "" }),
                    new Paragraph({ text: "____________________", alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: acta.usuarioEntrega?.name || 'N/A', alignment: AlignmentType.CENTER }),
                    new Paragraph({ text: acta.usuarioEntrega?.role?.name || 'N/A', alignment: AlignmentType.CENTER }),
                  ],
                }),
              ],
            }),
          ],
        }),

        // Pie de página
        new Paragraph({ text: "" }),
        new Paragraph({ text: "" }),
        new Paragraph({
          children: [
            new TextRun({
              text: "Documento generado automáticamente por el sistema de gestión DuvyClass",
              size: 16,
              italics: true,
              color: "95A5A6",
            }),
          ],
          alignment: AlignmentType.CENTER,
        }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const url = window.URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = `acta-entrega-${acta.id}.docx`;
  link.click();
  window.URL.revokeObjectURL(url);
};

export const printActa = (acta, equipo) => {
  const printWindow = window.open('', '_blank');
  const html = generateActaHTML(acta, equipo);
  printWindow.document.write(html);
  printWindow.document.close();
  printWindow.print();
};

const generateActaHTML = (acta, equipo) => {
  return `
    <!DOCTYPE html>
    <html>
    <head>
      <title>Acta de Entrega - ${acta.id}</title>
      <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        body {
          font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
          line-height: 1.4;
          color: #2c3e50;
        }
        .page {
          width: 210mm;
          min-height: 297mm;
          padding: 10mm;
          margin: 0 auto;
          background: white;
          page-break-after: auto;
        }
        .header {
          background: #662d91;
          color: white;
          padding: 15px;
          margin: -10mm -10mm 10px -10mm;
          display: flex;
          justify-content: space-between;
          align-items: center;
          border-bottom: 3px solid #8e4dbf;
        }
        .header-left h1 {
          font-size: 24px;
          font-weight: bold;
          margin-bottom: 5px;
        }
        .header-left p {
          font-size: 12px;
          opacity: 0.9;
        }
        .header-right {
          text-align: right;
          font-size: 11px;
        }
        .title {
          text-align: center;
          margin: 15px 0;
          color: #34495e;
        }
        .title h2 {
          font-size: 16px;
          font-weight: bold;
          margin-bottom: 4px;
        }
        .title p {
          font-size: 12px;
          color: #7f8c8d;
        }
        .divider {
          height: 3px;
          background: linear-gradient(90deg, transparent, #662d91, transparent);
          margin: 10px auto;
          width: 60%;
        }
        .info-box {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          margin-bottom: 10px;
          border-left: 3px solid #662d91;
        }
        .info-row {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 8px;
        }
        .info-row:last-child {
          margin-bottom: 0;
        }
        .info-item {
          font-size: 11px;
        }
        .info-item strong {
          color: #2c3e50;
          font-weight: 600;
        }
        .section {
          margin-bottom: 10px;
          page-break-inside: avoid;
        }
        .section-title {
          font-size: 13px;
          font-weight: bold;
          color: #662d91;
          margin-bottom: 8px;
          padding-bottom: 5px;
          border-bottom: 2px solid #ecf0f1;
        }
        .equipment-table {
          width: 100%;
          border-collapse: collapse;
          font-size: 9px;
          margin-bottom: 8px;
        }
        .equipment-table td {
          padding: 6px;
          border-bottom: 1px solid #ecf0f1;
        }
        .equipment-table td:first-child {
          font-weight: 600;
          color: #34495e;
          width: 30%;
        }
        .equipment-table td:nth-child(3) {
          font-weight: 600;
          color: #34495e;
          width: 20%;
        }
        .accessories {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 6px;
          font-size: 9px;
          margin-top: 6px;
        }
        .checkbox-item {
          display: flex;
          align-items: center;
          gap: 5px;
        }
        .checkbox {
          width: 14px;
          height: 14px;
          border: 2px solid #34495e;
          display: inline-flex;
          align-items: center;
          justify-content: center;
          border-radius: 3px;
        }
        .checkbox.checked {
          background: #662d91;
          color: white;
          font-weight: bold;
        }
        .policies {
          background: #f8f9fa;
          padding: 8px;
          border-radius: 4px;
          font-size: 8px;
          line-height: 1.4;
          margin-top: 6px;
        }
        .policies ul {
          margin: 5px 0;
          padding-left: 15px;
        }
        .policies li {
          margin-bottom: 3px;
        }
        .acceptance {
          display: flex;
          align-items: center;
          gap: 20px;
          font-size: 10px;
          font-weight: 600;
          margin: 10px 0;
        }
        .signatures {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 20px;
          margin-top: 15px;
          page-break-inside: avoid;
        }
        .signature-box {
          text-align: center;
        }
        .signature-title {
          font-weight: bold;
          font-size: 11px;
          margin-bottom: 5px;
          color: #662d91;
        }
        .signature-line {
          border-bottom: 1px solid #662d91;
          margin: 15px 15px 8px 15px;
        }
        .signature-name {
          font-size: 10px;
          margin: 5px 0;
        }
        .signature-role {
          font-size: 9px;
          color: #7f8c8d;
        }
        .footer {
          background: #662d91;
          color: white;
          padding: 8px;
          margin: 15px -10mm 0 -10mm;
          text-align: center;
          font-size: 8px;
          position: fixed;
          bottom: 0;
          width: 100%;
          border-top: 2px solid #8e4dbf;
        }
        .devolution-page {
          page-break-before: always;
        }
        @media print {
          body { margin: 0; -webkit-print-color-adjust: exact; print-color-adjust: exact; }
          .page { margin: 0; padding: 10mm; page-break-after: auto; }
          @page { margin: 5mm; size: A4; }
          .devolution-page { page-break-before: always; }
          .footer { position: fixed; bottom: 0; width: 100%; }
          .header, .footer, .divider, .info-box, .section-title, .checkbox.checked, .signature-line {
            -webkit-print-color-adjust: exact !important;
            print-color-adjust: exact !important;
          }
        }
      </style>
    </head>
    <body>
      <div class="page">
        <!-- Encabezado -->
        <div class="header">
          <div class="header-left">
            <h1>DuvyClass S.A.S</h1>
            <p>NIT: 901.456.789-1</p>
          </div>
          <div class="header-right">
            <p>${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} | ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
            <p>Acta de Entrega</p>
          </div>
        </div>

        <!-- Título -->
        <div class="title">
          <h2>ACTA DE ENTREGA DE EQUIPOS</h2>
          <p>Comunicación y Cómputo</p>
          <div class="divider"></div>
        </div>

        <!-- Información del receptor -->
        <div class="info-box">
          <div class="info-row">
            <div class="info-item">
              <strong>RECEPTOR:</strong> ${acta.usuarioRecibe?.name || 'N/A'}
            </div>
            <div class="info-item">
              <strong>FECHA:</strong> ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}
            </div>
          </div>
          <div class="info-row">
            <div class="info-item">
              <strong>CARGO:</strong> ${acta.cargo_recibe || 'N/A'}
            </div>
            <div class="info-item">
              <strong>ESTADO:</strong> ${acta.estado_equipo_entrega || 'N/A'}
            </div>
          </div>
        </div>

        <!-- Información del equipo -->
        <div class="section">
          <div class="section-title">INFORMACIÓN DEL EQUIPO</div>
          <table class="equipment-table">
            <tr>
              <td>Equipo:</td>
              <td>${equipo ? `${equipo.it || 'N/A'} - ${equipo.marca || 'N/A'} (${equipo.serial || 'N/A'})` : 'N/A'}</td>
              <td>Modelo:</td>
              <td>${acta.modelo_equipo || equipo?.propiedad || equipo?.equipo_celular || 'N/A'}</td>
            </tr>
            <tr>
              <td>Serial/IMEI:</td>
              <td>${acta.serial_imei || equipo?.serial || equipo?.imei || 'N/A'}</td>
              <td>Procesador:</td>
              <td>${acta.procesador || equipo?.it || 'N/A'}</td>
            </tr>
            <tr>
              <td>Almacenamiento:</td>
              <td>${acta.almacenamiento || equipo?.capacidad || 'N/A'}</td>
              <td>RAM:</td>
              <td>${acta.ram || equipo?.ram || 'N/A'}</td>
            </tr>
            <tr>
              <td>Sistema Operativo:</td>
              <td>${acta.sistema_operativo || 'N/A'}</td>
              <td>Línea Telefónica:</td>
              <td>${acta.linea_telefonica || 'N/A'}</td>
            </tr>
          </table>
        </div>

        <!-- Accesorios -->
        <div class="section">
          <div class="section-title">ACCESORIOS</div>
          <div class="accessories">
            <div class="checkbox-item">
              <span class="checkbox ${acta.accesorio_cargador ? 'checked' : ''}">${acta.accesorio_cargador ? '✓' : ''}</span>
              <span>Cargador</span>
            </div>
            <div class="checkbox-item">
              <span class="checkbox ${acta.accesorio_teclado ? 'checked' : ''}">${acta.accesorio_teclado ? '✓' : ''}</span>
              <span>Teclado</span>
            </div>
            <div class="checkbox-item">
              <span class="checkbox ${acta.accesorio_office ? 'checked' : ''}">${acta.accesorio_office ? '✓' : ''}</span>
              <span>Office</span>
            </div>
            <div class="checkbox-item">
              <span class="checkbox ${acta.accesorio_antivirus ? 'checked' : ''}">${acta.accesorio_antivirus ? '✓' : ''}</span>
              <span>Antivirus</span>
            </div>
            <div class="checkbox-item">
              <span class="checkbox ${acta.accesorio_ssd ? 'checked' : ''}">${acta.accesorio_ssd ? '✓' : ''}</span>
              <span>SSD</span>
            </div>
            <div class="checkbox-item">
              <span class="checkbox ${acta.accesorio_hdd ? 'checked' : ''}">${acta.accesorio_hdd ? '✓' : ''}</span>
              <span>HDD</span>
            </div>
          </div>
        </div>

        ${acta.observaciones_equipo ? `
          <div class="section">
            <div class="section-title">OBSERVACIONES DEL EQUIPO</div>
            <p style="font-size: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px;">${acta.observaciones_equipo}</p>
          </div>
        ` : ''}

        <!-- Políticas -->
        <div class="section">
          <div class="section-title">POLÍTICAS DE USO</div>
          <div class="policies">
            <p><strong>El equipo es de uso exclusivo para funciones laborales.</strong> El usuario es responsable de su cuidado y mantenimiento.</p>
            <ul>
              <li>Verificar estado inicial del equipo</li>
              <li>Reportar inmediatamente daños, robos o pérdidas al área de IT</li>
              <li>No instalar software no autorizado</li>
              <li>Realizar copias de seguridad según indicaciones del área IT</li>
              <li>Navegar solo en páginas permitidas por la compañía</li>
              <li>Mantener la privacidad de la información</li>
              <li>Al retiro de la compañía, entregar todos los equipos al área IT</li>
            </ul>
          </div>
        </div>

        <!-- Aceptación -->
        <div class="acceptance">
          <span>Acepto las políticas:</span>
          <div class="checkbox-item">
            <span class="checkbox ${acta.acepta_politica ? 'checked' : ''}">${acta.acepta_politica ? '✓' : ''}</span>
            <span>SÍ</span>
          </div>
          <div class="checkbox-item">
            <span class="checkbox ${!acta.acepta_politica ? 'checked' : ''}">${!acta.acepta_politica ? '✓' : ''}</span>
            <span>NO</span>
          </div>
        </div>

        ${acta.observaciones_entrega ? `
          <div class="section">
            <div class="section-title">OBSERVACIONES DE ENTREGA</div>
            <p style="font-size: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px;">${acta.observaciones_entrega}</p>
          </div>
        ` : ''}

        <!-- Firmas -->
        <div class="signatures">
          <div class="signature-box">
            <div class="signature-title">RECIBE</div>
            <div class="signature-line"></div>
            <div class="signature-name">${acta.usuarioRecibe?.name || 'N/A'}</div>
            <div class="signature-role">${acta.cargo_recibe || 'N/A'}</div>
          </div>
          <div class="signature-box">
            <div class="signature-title">ENTREGA</div>
            <div class="signature-line"></div>
            <div class="signature-name">${acta.usuarioEntrega?.name || 'N/A'}</div>
            <div class="signature-role">${acta.usuarioEntrega?.role?.name || 'N/A'}</div>
          </div>
        </div>

        <!-- Pie de página -->
        <div class="footer">
          Documento generado automáticamente por el sistema de gestión DuvyClass
        </div>
      </div>

      ${acta.fecha_devolucion ? `
        <div class="page devolution-page">
          <!-- Encabezado devolución -->
          <div class="header">
            <div class="header-left">
              <h1>DuvyClass S.A.S</h1>
              <p>NIT: 901.456.789-1</p>
            </div>
            <div class="header-right">
              <p>${new Date().toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' })} | ${new Date().toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' })}</p>
              <p>Devolución de Equipo</p>
            </div>
          </div>

          <!-- Título -->
          <div class="title">
            <h2>DEVOLUCIÓN DEL EQUIPO</h2>
            <div class="divider"></div>
          </div>

          <!-- Información de devolución -->
          <div class="info-box">
            <div class="info-row">
              <div class="info-item">
                <strong>Serial:</strong> ${acta.serial_imei || equipo?.serial || equipo?.imei || 'N/A'}
              </div>
              <div class="info-item">
                <strong>Fecha:</strong> ${new Date(acta.fecha_devolucion).toLocaleDateString('es-ES')}
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <strong>Marca:</strong> ${acta.marca || equipo?.marca || 'N/A'}
              </div>
              <div class="info-item">
                <strong>Estado:</strong> ${acta.estado_equipo_devolucion || 'N/A'}
              </div>
            </div>
            <div class="info-row">
              <div class="info-item">
                <strong>Almacenamiento:</strong> ${acta.almacenamiento || equipo?.capacidad || 'N/A'}
              </div>
              <div class="info-item">
                <strong>RAM:</strong> ${acta.ram || equipo?.ram || 'N/A'}
              </div>
            </div>
          </div>

          ${acta.observaciones_devolucion ? `
            <div class="section">
              <div class="section-title">OBSERVACIONES DE DEVOLUCIÓN</div>
              <p style="font-size: 10px; padding: 8px; background: #f8f9fa; border-radius: 4px;">${acta.observaciones_devolucion}</p>
            </div>
          ` : ''}

          <!-- Firmas de devolución -->
          <div class="signatures" style="margin-top: 40px;">
            <div class="signature-box">
              <div class="signature-title">RECIBE (IT)</div>
              <div class="signature-line"></div>
              <div class="signature-name">${acta.usuarioEntrega?.name || 'N/A'}</div>
              <div class="signature-role">${acta.usuarioEntrega?.role?.name || 'N/A'}</div>
            </div>
            <div class="signature-box">
              <div class="signature-title">ENTREGA</div>
              <div class="signature-line"></div>
              <div class="signature-name">${acta.usuarioRecibe?.name || 'N/A'}</div>
              <div class="signature-role">${acta.cargo_recibe || 'N/A'}</div>
            </div>
          </div>

          <p style="font-size: 9px; font-style: italic; color: #7f8c8d; margin-top: 30px; text-align: center;">
            *Este recuadro será diligenciado una vez el usuario asignado se retire de la compañía
          </p>

          <!-- Pie de página -->
          <div class="footer">
            Documento generado automáticamente por el sistema de gestión DuvyClass
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
};