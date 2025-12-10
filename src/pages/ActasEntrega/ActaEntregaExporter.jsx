import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableCell, TableRow, WidthType } from 'docx';

export const exportToPDF = async (acta, equipo) => {
  const pdf = new jsPDF();

  // Configurar fuente
  pdf.setFont('helvetica');

  // Título
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ACTA DE ENTREGA DE EQUIPOS CORPORATIVOS', 105, 30, { align: 'center' });

  // Información del receptor
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACIÓN DEL RECEPTOR', 20, 60);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nombre: ${acta.usuarioRecibe?.name || 'N/A'}`, 20, 75);
  pdf.text(`Cargo: ${acta.cargo_recibe || 'N/A'}`, 20, 85);

  // Información del entregador
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACIÓN DEL ENTREGADOR', 110, 60);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nombre: ${acta.usuarioEntrega?.name || 'N/A'}`, 110, 75);
  pdf.text(`Cargo: ${acta.usuarioEntrega?.role?.name || 'N/A'}`, 110, 85);

  // Detalles del equipo
  pdf.setFont('helvetica', 'bold');
  pdf.text('DETALLES DEL EQUIPO', 20, 110);
  pdf.setFont('helvetica', 'normal');

  let yPos = 125;
  if (equipo) {
    if (acta.tipo_equipo === 'inventory') {
      pdf.text(`Tipo: Computadora/Laptop`, 20, yPos);
      pdf.text(`Marca: ${equipo.marca || 'N/A'}`, 20, yPos + 10);
      pdf.text(`Modelo: ${equipo.propiedad || 'N/A'}`, 20, yPos + 20);
      pdf.text(`Serial: ${equipo.serial || 'N/A'}`, 20, yPos + 30);
      pdf.text(`Procesador: ${equipo.it || 'N/A'}`, 20, yPos + 40);
      pdf.text(`RAM: ${equipo.ram || 'N/A'}`, 20, yPos + 50);
      pdf.text(`Almacenamiento: ${equipo.capacidad || 'N/A'}`, 20, yPos + 60);
      yPos += 80;
    } else {
      pdf.text(`Tipo: Teléfono Celular`, 20, yPos);
      pdf.text(`Marca/Modelo: ${equipo.equipo_celular || 'N/A'}`, 20, yPos + 10);
      pdf.text(`IMEI: ${equipo.imei || 'N/A'}`, 20, yPos + 20);
      pdf.text(`Número: ${equipo.numero_celular || 'N/A'}`, 20, yPos + 30);
      yPos += 50;
    }
  }

  // Fecha y motivo
  pdf.text(`Fecha de Entrega: ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}`, 20, yPos);
  pdf.text(`Motivo: ${acta.motivo_entrega}`, 20, yPos + 10);
  yPos += 30;

  // Estado del equipo
  pdf.setFont('helvetica', 'bold');
  pdf.text('ESTADO DEL EQUIPO AL ENTREGAR', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  const estadoLines = pdf.splitTextToSize(acta.estado_equipo_entrega, 170);
  pdf.text(estadoLines, 20, yPos + 15);

  // Políticas
  yPos += 40;
  pdf.setFont('helvetica', 'bold');
  pdf.text('POLÍTICAS DE USO', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  const politicas = [
    '• Usar el equipo exclusivamente para fines laborales',
    '• No instalar software malicioso sin autorización',
    '• Reportar inmediatamente pérdidas, daños o robos',
    '• Realizar copias de seguridad en rutas designadas',
    '• Navegar solo por sitios permitidos por la compañía',
    '• No compartir información confidencial'
  ];
  politicas.forEach((politica, index) => {
    pdf.text(politica, 20, yPos + 15 + (index * 8));
  });

  // Firmas
  yPos += 80;
  pdf.setFont('helvetica', 'bold');
  pdf.text('FIRMAS', 20, yPos);
  pdf.line(20, yPos + 50, 90, yPos + 50); // Línea para firma receptor
  pdf.line(110, yPos + 50, 180, yPos + 50); // Línea para firma entregador
  pdf.setFont('helvetica', 'normal');
  pdf.setFontSize(10);
  pdf.text('Firma del Receptor', 35, yPos + 60);
  pdf.text('Firma del Entregador', 125, yPos + 60);

  // Devolución si existe
  if (acta.fecha_devolucion) {
    pdf.addPage();
    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DEVOLUCIÓN DEL EQUIPO', 105, 30, { align: 'center' });

    pdf.setFontSize(12);
    pdf.text(`Fecha de Devolución: ${new Date(acta.fecha_devolucion).toLocaleDateString('es-ES')}`, 20, 60);
    pdf.text('Estado del Equipo al Devolver:', 20, 80);
    const devolucionLines = pdf.splitTextToSize(acta.estado_equipo_devolucion || 'N/A', 170);
    pdf.text(devolucionLines, 20, 90);

    if (acta.observaciones_devolucion) {
      pdf.text('Observaciones:', 20, 120);
      const obsLines = pdf.splitTextToSize(acta.observaciones_devolucion, 170);
      pdf.text(obsLines, 20, 130);
    }

    // Firmas devolución
    pdf.setFont('helvetica', 'bold');
    pdf.text('FIRMAS DE DEVOLUCIÓN', 20, 180);
    pdf.line(20, yPos + 50, 90, yPos + 50);
    pdf.line(110, yPos + 50, 180, yPos + 50);
    pdf.setFont('helvetica', 'normal');
    pdf.setFontSize(10);
    pdf.text('Firma del Receptor', 35, yPos + 60);
    pdf.text('Firma del Entregador', 125, yPos + 60);
  }

  // Guardar PDF
  pdf.save(`acta-entrega-${acta.id}.pdf`);
};

export const exportToWord = async (acta, equipo) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        new Paragraph({
          text: 'ACTA DE ENTREGA DE EQUIPOS CORPORATIVOS',
          heading: HeadingLevel.TITLE,
          alignment: 'center'
        }),
        new Paragraph({ text: '' }),

        // Información del receptor y entregador
        new Paragraph({
          children: [
            new TextRun({ text: 'INFORMACIÓN DEL RECEPTOR', bold: true }),
          ]
        }),
        new Paragraph(`Nombre: ${acta.usuarioRecibe?.name || 'N/A'}`),
        new Paragraph(`Cargo: ${acta.cargo_recibe || 'N/A'}`),
        new Paragraph({ text: '' }),

        new Paragraph({
          children: [
            new TextRun({ text: 'INFORMACIÓN DEL ENTREGADOR', bold: true }),
          ]
        }),
        new Paragraph(`Nombre: ${acta.usuarioEntrega?.name || 'N/A'}`),
        new Paragraph(`Cargo: ${acta.usuarioEntrega?.role?.name || 'N/A'}`),
        new Paragraph({ text: '' }),

        // Detalles del equipo
        new Paragraph({
          children: [
            new TextRun({ text: 'DETALLES DEL EQUIPO', bold: true }),
          ]
        }),

        ...(equipo ? (acta.tipo_equipo === 'inventory' ? [
          new Paragraph(`Tipo: Computadora/Laptop`),
          new Paragraph(`Marca: ${equipo.marca || 'N/A'}`),
          new Paragraph(`Modelo: ${equipo.propiedad || 'N/A'}`),
          new Paragraph(`Serial: ${equipo.serial || 'N/A'}`),
          new Paragraph(`Procesador: ${equipo.it || 'N/A'}`),
          new Paragraph(`RAM: ${equipo.ram || 'N/A'}`),
          new Paragraph(`Almacenamiento: ${equipo.capacidad || 'N/A'}`)
        ] : [
          new Paragraph(`Tipo: Teléfono Celular`),
          new Paragraph(`Marca/Modelo: ${equipo.equipo_celular || 'N/A'}`),
          new Paragraph(`IMEI: ${equipo.imei || 'N/A'}`),
          new Paragraph(`Número: ${equipo.numero_celular || 'N/A'}`)
        ]) : []),

        new Paragraph(`Fecha de Entrega: ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}`),
        new Paragraph(`Motivo: ${acta.motivo_entrega}`),
        new Paragraph({ text: '' }),

        // Estado del equipo
        new Paragraph({
          children: [
            new TextRun({ text: 'ESTADO DEL EQUIPO AL ENTREGAR', bold: true }),
          ]
        }),
        new Paragraph(acta.estado_equipo_entrega),
        new Paragraph({ text: '' }),

        // Políticas
        new Paragraph({
          children: [
            new TextRun({ text: 'POLÍTICAS DE USO', bold: true }),
          ]
        }),
        new Paragraph('• Usar el equipo exclusivamente para fines laborales'),
        new Paragraph('• No instalar software malicioso sin autorización'),
        new Paragraph('• Reportar inmediatamente pérdidas, daños o robos'),
        new Paragraph('• Realizar copias de seguridad en rutas designadas'),
        new Paragraph('• Navegar solo por sitios permitidos por la compañía'),
        new Paragraph('• No compartir información confidencial'),
        new Paragraph({ text: '' }),

        // Firmas
        new Paragraph({
          children: [
            new TextRun({ text: 'FIRMAS', bold: true }),
          ]
        }),
        new Table({
          width: {
            size: 100,
            type: WidthType.PERCENTAGE,
          },
          rows: [
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph('Firma del Receptor: ____________________')],
                }),
                new TableCell({
                  children: [new Paragraph('Firma del Entregador: ____________________')],
                }),
              ],
            }),
            new TableRow({
              children: [
                new TableCell({
                  children: [new Paragraph(`Cargo: ${acta.cargo_recibe || 'N/A'}`)],
                }),
                new TableCell({
                  children: [new Paragraph(`Cargo: ${acta.usuarioEntrega?.role?.name || 'N/A'}`)],
                }),
              ],
            }),
          ],
        }),

        // Devolución si existe
        ...(acta.fecha_devolucion ? [
          new Paragraph({ text: '', pageBreakBefore: true }),
          new Paragraph({
            text: 'DEVOLUCIÓN DEL EQUIPO',
            heading: HeadingLevel.HEADING_1,
            alignment: 'center'
          }),
          new Paragraph(`Fecha de Devolución: ${new Date(acta.fecha_devolucion).toLocaleDateString('es-ES')}`),
          new Paragraph('Estado del Equipo al Devolver:'),
          new Paragraph(acta.estado_equipo_devolucion || 'N/A'),
          ...(acta.observaciones_devolucion ? [
            new Paragraph('Observaciones:'),
            new Paragraph(acta.observaciones_devolucion)
          ] : []),
          new Paragraph({ text: '' }),
          new Paragraph({
            children: [
              new TextRun({ text: 'FIRMAS DE DEVOLUCIÓN', bold: true }),
            ]
          }),
          new Table({
            width: {
              size: 100,
              type: WidthType.PERCENTAGE,
            },
            rows: [
              new TableRow({
                children: [
                  new TableCell({
                    children: [new Paragraph('Firma del Receptor: ____________________')],
                  }),
                  new TableCell({
                    children: [new Paragraph('Firma del Entregador: ____________________')],
                  }),
                ],
              }),
            ],
          })
        ] : [])
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
        body { font-family: Arial, sans-serif; margin: 20px; }
        .header { text-align: center; margin-bottom: 30px; }
        .section { margin-bottom: 20px; }
        .section h3 { border-bottom: 1px solid #ccc; padding-bottom: 5px; }
        .firmas { display: flex; justify-content: space-around; margin-top: 50px; }
        .firma { text-align: center; }
        .firma-line { border-bottom: 1px solid #000; width: 200px; margin: 40px auto 10px; }
        table { width: 100%; border-collapse: collapse; margin: 20px 0; }
        th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
        .politicas { background: #f9f9f9; padding: 15px; border-radius: 5px; }
        .politicas ul { margin: 0; padding-left: 20px; }
        @media print { body { margin: 0; } }
      </style>
    </head>
    <body>
      <div class="header">
        <h1>ACTA DE ENTREGA DE EQUIPOS CORPORATIVOS</h1>
      </div>

      <div class="section">
        <h3>INFORMACIÓN DEL RECEPTOR</h3>
        <p><strong>Nombre:</strong> ${acta.usuarioRecibe?.name || 'N/A'}</p>
        <p><strong>Cargo:</strong> ${acta.cargo_recibe || 'N/A'}</p>
      </div>

      <div class="section">
        <h3>INFORMACIÓN DEL ENTREGADOR</h3>
        <p><strong>Nombre:</strong> ${acta.usuarioEntrega?.name || 'N/A'}</p>
        <p><strong>Cargo:</strong> ${acta.usuarioEntrega?.role?.name || 'N/A'}</p>
      </div>

      <div class="section">
        <h3>DETALLES DEL EQUIPO</h3>
        ${equipo ? (acta.tipo_equipo === 'inventory' ? `
          <p><strong>Tipo:</strong> Computadora/Laptop</p>
          <p><strong>Marca:</strong> ${equipo.marca || 'N/A'}</p>
          <p><strong>Modelo:</strong> ${equipo.propiedad || 'N/A'}</p>
          <p><strong>Serial:</strong> ${equipo.serial || 'N/A'}</p>
          <p><strong>Procesador:</strong> ${equipo.it || 'N/A'}</p>
          <p><strong>RAM:</strong> ${equipo.ram || 'N/A'}</p>
          <p><strong>Almacenamiento:</strong> ${equipo.capacidad || 'N/A'}</p>
        ` : `
          <p><strong>Tipo:</strong> Teléfono Celular</p>
          <p><strong>Marca/Modelo:</strong> ${equipo.equipo_celular || 'N/A'}</p>
          <p><strong>IMEI:</strong> ${equipo.imei || 'N/A'}</p>
          <p><strong>Número:</strong> ${equipo.numero_celular || 'N/A'}</p>
        `) : ''}
        <p><strong>Fecha de Entrega:</strong> ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}</p>
        <p><strong>Motivo:</strong> ${acta.motivo_entrega}</p>
      </div>

      <div class="section">
        <h3>ESTADO DEL EQUIPO AL ENTREGAR</h3>
        <p>${acta.estado_equipo_entrega}</p>
      </div>

      <div class="section">
        <h3>POLÍTICAS DE USO</h3>
        <div class="politicas">
          <ul>
            <li>Usar el equipo exclusivamente para fines laborales</li>
            <li>No instalar software malicioso sin autorización</li>
            <li>Reportar inmediatamente pérdidas, daños o robos</li>
            <li>Realizar copias de seguridad en rutas designadas</li>
            <li>Navegar solo por sitios permitidos por la compañía</li>
            <li>No compartir información confidencial</li>
          </ul>
        </div>
      </div>

      <div class="firmas">
        <div class="firma">
          <div class="firma-line"></div>
          <p><strong>Firma del Receptor</strong></p>
          <p>Cargo: ${acta.cargo_recibe || 'N/A'}</p>
        </div>
        <div class="firma">
          <div class="firma-line"></div>
          <p><strong>Firma del Entregador</strong></p>
          <p>Cargo: ${acta.usuarioEntrega?.role?.name || 'N/A'}</p>
        </div>
      </div>

      ${acta.fecha_devolucion ? `
        <div style="page-break-before: always;">
          <div class="header">
            <h1>DEVOLUCIÓN DEL EQUIPO</h1>
          </div>

          <div class="section">
            <p><strong>Fecha de Devolución:</strong> ${new Date(acta.fecha_devolucion).toLocaleDateString('es-ES')}</p>
            <h3>Estado del Equipo al Devolver</h3>
            <p>${acta.estado_equipo_devolucion || 'N/A'}</p>
            ${acta.observaciones_devolucion ? `
              <h3>Observaciones</h3>
              <p>${acta.observaciones_devolucion}</p>
            ` : ''}
          </div>

          <div class="firmas">
            <div class="firma">
              <div class="firma-line"></div>
              <p><strong>Firma del Receptor</strong></p>
            </div>
            <div class="firma">
              <div class="firma-line"></div>
              <p><strong>Firma del Entregador</strong></p>
            </div>
          </div>
        </div>
      ` : ''}
    </body>
    </html>
  `;
};