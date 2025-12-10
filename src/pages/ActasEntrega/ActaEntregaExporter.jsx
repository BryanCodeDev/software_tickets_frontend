import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import { Document, Packer, Paragraph, TextRun, HeadingLevel, Table, TableCell, TableRow, WidthType } from 'docx';

export const exportToPDF = async (acta, equipo) => {
  const pdf = new jsPDF();

  // Configurar fuente
  pdf.setFont('helvetica');

  // Encabezado con logo y título
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'normal');
  pdf.text('DuvyClass S.A.S', 20, 20);
  pdf.text('NIT: 901.456.789-1', 20, 25);
  pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 160, 20);
  pdf.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`, 160, 25);

  // Línea separadora
  pdf.setDrawColor(0, 0, 0);
  pdf.setLineWidth(0.5);
  pdf.line(20, 30, 190, 30);

  // Título principal
  pdf.setFontSize(20);
  pdf.setFont('helvetica', 'bold');
  pdf.text('ACTA DE ENTREGA DE EQUIPOS DE COMUNICACIÓN Y DE CÓMPUTO', 105, 45, { align: 'center' });

  // Información del receptor y fecha
  pdf.setFontSize(12);
  pdf.setFont('helvetica', 'normal');
  pdf.text(`Nombre: ${acta.usuarioRecibe?.name || 'N/A'}`, 20, 60);
  pdf.text(`Cargo: ${acta.cargo_recibe || 'N/A'}`, 20, 68);
  pdf.text(`Fecha: ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}`, 160, 60);

  // Información del equipo con formato de tabla
  pdf.setFont('helvetica', 'bold');
  pdf.text('INFORMACIÓN DEL EQUIPO', 20, 85);
  pdf.setFont('helvetica', 'normal');

  let yPos = 95;

  // Usar los nuevos campos del modelo extendido
  pdf.text(`Marca: ${acta.marca || equipo?.marca || 'N/A'}`, 20, yPos);
  pdf.text(`SERIAL/IMEI: ${acta.serial_imei || equipo?.serial || equipo?.imei || 'N/A'}`, 120, yPos);
  yPos += 10;

  pdf.text(`Procesador: ${acta.procesador || equipo?.it || 'N/A'}`, 20, yPos);
  pdf.text(`MODELO: ${acta.modelo_equipo || equipo?.propiedad || equipo?.equipo_celular || 'N/A'}`, 120, yPos);
  yPos += 10;

  pdf.text(`LÍNEA TELEFÓNICA: ${acta.linea_telefonica || 'N/A'}`, 20, yPos);
  pdf.text(`CELULAR: ${acta.tipo_equipo_detallado === 'celular' ? 'X' : ''}`, 120, yPos);
  yPos += 10;

  pdf.text(`ALMACENAMIENTO: ${acta.almacenamiento || equipo?.capacidad || 'N/A'}`, 20, yPos);
  pdf.text(`RAM: ${acta.ram || equipo?.ram || 'N/A'}`, 120, yPos);
  yPos += 10;

  pdf.text(`S.O: ${acta.sistema_operativo || 'N/A'}`, 20, yPos);
  pdf.text(`IMEI: ${acta.serial_imei || equipo?.imei || 'N/A'}`, 120, yPos);
  yPos += 10;

  // Accesorios
  pdf.setFont('helvetica', 'bold');
  pdf.text('ACCESORIOS:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  yPos += 10;

  const accesorioCargador = acta.accesorio_cargador ? 'X' : '';
  const accesorioTeclado = acta.accesorio_teclado ? 'X' : '';
  const accesorioOffice = acta.accesorio_office ? 'X' : '';
  const accesorioAntivirus = acta.accesorio_antivirus ? 'X' : '';
  const accesorioSsd = acta.accesorio_ssd ? 'X' : '';
  const accesorioHdd = acta.accesorio_hdd ? 'X' : '';

  pdf.text(`Cargador: ${accesorioCargador}`, 20, yPos);
  pdf.text(`Teclado: ${accesorioTeclado}`, 120, yPos);
  yPos += 10;

  pdf.text(`OFFICE: ${accesorioOffice}`, 20, yPos);
  pdf.text(`ANTIVIRUS: ${accesorioAntivirus}`, 120, yPos);
  yPos += 10;

  pdf.text(`SSD: ${accesorioSsd}`, 20, yPos);
  pdf.text(`HDD: ${accesorioHdd}`, 120, yPos);
  yPos += 10;

  // Observaciones del equipo
  pdf.setFont('helvetica', 'bold');
  pdf.text('OBSERVACIONES DEL EQUIPO:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  yPos += 10;

  const observacionesLines = pdf.splitTextToSize(acta.observaciones_equipo || 'N/A', 170);
  pdf.text(observacionesLines, 20, yPos);
  yPos += 20;

  // Políticas completas
  pdf.setFont('helvetica', 'bold');
  pdf.text('POLÍTICAS DE USO', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  yPos += 10;

  const politicas = [
    'De los equipos de cómputo:',
    'Es importante: utilizar los equipos especialmente para desempeñar sus funciones dentro de la empresa,',
    'el equipo recibido queda bajo la responsabilidad de cada usuario, teniendo en cuenta las siguientes instrucciones:',
    '• Verificar el estado en el que es entregado el equipo',
    '• Cuidar: mantener en buen estado los elementos asignados',
    '• No instalar software ni aplicaciones maliciosas teniendo en cuenta que si se requieren para el uso de actividad diaria debe ser autorizado por el área de IT',
    '• En caso de pérdida, daño, o robo se debe reportar al área de IT para el respectivo bloqueo y remplazo del mismo.',
    '• Salvo guardar la información entregada y la generada: realizando copias de seguridad en las rutas designadas por el área de IT o el encargado del área.',
    '• Navegar por las páginas permitidas por la compañía.',
    '• Verificar la información enviada: para evitar ataques de intrusión o de virus en el dispositivo.',
    '• No Modificar: los accesos o cuentas entregadas en los dispositivos.',
    '• Mantener la privacidad: de la información en custodia, (No compartir a menos de que sea requerido.)',
    '• En caso de retiro de la compañía: se debe realizar la entrega de todas las herramientas asignadas al área de IT para su respectiva revisión, si entregan a otra área debe ser informado',
    '',
    'De los equipos de comunicación:',
    '• Verificar el estado de entrega de equipo',
    '• Cuidar y mantener en buen estado los elementos asignados',
    '• En caso de pérdida, daño, o robo se debe reportar al área de IT para el respectivo bloqueo y remplazo del mismo'
  ];

  politicas.forEach((politica, index) => {
    pdf.text(politica, 20, yPos + (index * 7));
  });

  yPos += politicas.length * 7 + 10;

  // Aceptación de políticas
  pdf.setFont('helvetica', 'bold');
  pdf.text('Yo _____________________________ Acepto y entiendo la POLÍTICA DE ASIGNACION Y ENTREGA DE EQUIPOS Y HERRAMIENTAS DE COMPUTO:', 20, yPos);
  yPos += 10;

  pdf.text(`SI: ${acta.acepta_politica ? 'X' : ''}`, 20, yPos);
  pdf.text(`NO: ${!acta.acepta_politica ? 'X' : ''}`, 80, yPos);
  yPos += 20;

  // Entrega del equipo
  pdf.setFont('helvetica', 'bold');
  pdf.text('Entrega del equipo', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  yPos += 10;

  pdf.text(`Usuario quien recibe: ${acta.usuarioRecibe?.name || 'N/A'}`, 20, yPos);
  pdf.text(`Fecha: ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}`, 160, yPos);
  yPos += 10;

  pdf.text(`Estado: ${acta.estado_equipo_entrega || 'N/A'}`, 20, yPos);
  yPos += 10;

  pdf.text(`Observaciones: ${acta.observaciones_entrega || 'N/A'}`, 20, yPos);
  yPos += 20;

  // Firmas de entrega
  pdf.setFont('helvetica', 'bold');
  pdf.text('FIRMAS:', 20, yPos);
  pdf.setFont('helvetica', 'normal');
  yPos += 10;

  pdf.text('Firma de quien recibe: ____________________', 20, yPos);
  pdf.text('Firma de quien entrega: ____________________', 120, yPos);
  yPos += 15;

  pdf.text(`Cargo de quien recibe: ${acta.cargo_recibe || 'N/A'}`, 20, yPos);
  pdf.text(`Cargo de quien entrega: ${acta.usuarioEntrega?.role?.name || 'N/A'}`, 120, yPos);
  yPos += 20;

  // Devolución si existe
  if (acta.fecha_devolucion) {
    pdf.addPage();

    // Encabezado en página de devolución
    pdf.setFontSize(10);
    pdf.text('DuvyClass S.A.S', 20, 20);
    pdf.text('NIT: 901.456.789-1', 20, 25);
    pdf.text(`Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`, 160, 20);
    pdf.text(`Hora: ${new Date().toLocaleTimeString('es-ES')}`, 160, 25);
    pdf.line(20, 30, 190, 30);

    pdf.setFontSize(16);
    pdf.setFont('helvetica', 'bold');
    pdf.text('DEVOLUCIÓN DEL EQUIPO', 105, 45, { align: 'center' });

    pdf.setFontSize(12);
    pdf.setFont('helvetica', 'normal');

    pdf.text(`Serial: ${acta.serial_imei || equipo?.serial || equipo?.imei || 'N/A'}`, 20, 60);
    pdf.text(`Marca: ${acta.marca || equipo?.marca || 'N/A'}`, 120, 60);

    pdf.text(`ALMACENAMIENTO: ${acta.almacenamiento || equipo?.capacidad || 'N/A'}`, 20, 70);
    pdf.text(`RAM: ${acta.ram || equipo?.ram || 'N/A'}`, 120, 70);

    pdf.text(`Usuario quien recibe: ${acta.usuarioEntrega?.name || 'N/A'}`, 20, 80);
    pdf.text(`Fecha: ${new Date(acta.fecha_devolucion).toLocaleDateString('es-ES')}`, 160, 80);

    pdf.text(`Estado: ${acta.estado_equipo_devolucion || 'N/A'}`, 20, 90);
    yPos = 100;

    if (acta.observaciones_devolucion) {
      pdf.text(`Observaciones: ${acta.observaciones_devolucion}`, 20, yPos);
      yPos += 10;
    }

    yPos += 10;
    pdf.text('Firma de quien recibe: ____________________', 20, yPos);
    pdf.text('Firma de quien entrega: ____________________', 120, yPos);
    yPos += 15;

    pdf.text(`Cargo de quien recibe: ${acta.usuarioEntrega?.role?.name || 'N/A'}`, 20, yPos);
    pdf.text(`Cargo de quien entrega: ${acta.cargo_recibe || 'N/A'}`, 120, yPos);
    yPos += 20;

    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'italic');
    pdf.text('*Este recuadro será diligenciado una vez el usuario asignado se retire de la compañía', 20, yPos);
  }

  // Pie de página
  pdf.setFontSize(10);
  pdf.setFont('helvetica', 'bold');
  pdf.text('Elabora: _____________________', 20, 280);
  pdf.text('Revisa: _____________________', 80, 280);
  pdf.text('Aprueba: _____________________', 140, 280);

  pdf.setFont('helvetica', 'normal');
  pdf.text('Cargo: _____________________', 20, 285);
  pdf.text('Cargo: _____________________', 80, 285);
  pdf.text('Cargo: _____________________', 140, 285);

  // Guardar PDF
  pdf.save(`acta-entrega-${acta.id}.pdf`);
};

export const exportToWord = async (acta, equipo) => {
  const doc = new Document({
    sections: [{
      properties: {},
      children: [
        // Encabezado
        new Paragraph({
          text: 'DuvyClass S.A.S',
          alignment: 'left',
          size: 20
        }),
        new Paragraph({
          text: 'NIT: 901.456.789-1',
          alignment: 'left',
          size: 20
        }),
        new Paragraph({
          text: `Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`,
          alignment: 'right',
          size: 20
        }),
        new Paragraph({
          text: `Hora: ${new Date().toLocaleTimeString('es-ES')}`,
          alignment: 'right',
          size: 20
        }),
        new Paragraph({ text: '' }),

        // Título principal
        new Paragraph({
          text: 'ACTA DE ENTREGA DE EQUIPOS DE COMUNICACIÓN Y DE CÓMPUTO',
          heading: HeadingLevel.TITLE,
          alignment: 'center'
        }),
        new Paragraph({ text: '' }),

        // Información del receptor y fecha
        new Paragraph(`Nombre: ${acta.usuarioRecibe?.name || 'N/A'}`),
        new Paragraph(`Cargo: ${acta.cargo_recibe || 'N/A'}`),
        new Paragraph(`Fecha: ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}`),
        new Paragraph({ text: '' }),

        // Información del equipo con formato extendido
        new Paragraph({
          children: [
            new TextRun({ text: 'INFORMACIÓN DEL EQUIPO', bold: true }),
          ]
        }),
        new Paragraph({ text: '' }),

        new Paragraph(`Marca: ${acta.marca || equipo?.marca || 'N/A'}`),
        new Paragraph(`SERIAL/IMEI: ${acta.serial_imei || equipo?.serial || equipo?.imei || 'N/A'}`),
        new Paragraph(`Procesador: ${acta.procesador || equipo?.it || 'N/A'}`),
        new Paragraph(`MODELO: ${acta.modelo_equipo || equipo?.propiedad || equipo?.equipo_celular || 'N/A'}`),
        new Paragraph(`LÍNEA TELEFÓNICA: ${acta.linea_telefonica || 'N/A'}`),
        new Paragraph(`CELULAR: ${acta.tipo_equipo_detallado === 'celular' ? 'X' : ''}`),
        new Paragraph(`ALMACENAMIENTO: ${acta.almacenamiento || equipo?.capacidad || 'N/A'}`),
        new Paragraph(`RAM: ${acta.ram || equipo?.ram || 'N/A'}`),
        new Paragraph(`S.O: ${acta.sistema_operativo || 'N/A'}`),
        new Paragraph(`IMEI: ${acta.serial_imei || equipo?.imei || 'N/A'}`),
        new Paragraph({ text: '' }),

        // Accesorios
        new Paragraph({
          children: [
            new TextRun({ text: 'ACCESORIOS:', bold: true }),
          ]
        }),
        new Paragraph(`CARGADOR: ${acta.accesorio_cargador ? 'X' : ''}`),
        new Paragraph(`Teclado: ${acta.accesorio_teclado ? 'X' : ''}`),
        new Paragraph(`OFFICE: ${acta.accesorio_office ? 'X' : ''}`),
        new Paragraph(`ANTIVIRUS: ${acta.accesorio_antivirus ? 'X' : ''}`),
        new Paragraph(`SSD: ${acta.accesorio_ssd ? 'X' : ''}`),
        new Paragraph(`HDD: ${acta.accesorio_hdd ? 'X' : ''}`),
        new Paragraph({ text: '' }),

        // Observaciones del equipo
        new Paragraph({
          children: [
            new TextRun({ text: 'OBSERVACIONES DEL EQUIPO:', bold: true }),
          ]
        }),
        new Paragraph(acta.observaciones_equipo || 'N/A'),
        new Paragraph({ text: '' }),

        // Políticas completas
        new Paragraph({
          children: [
            new TextRun({ text: 'POLÍTICAS DE USO', bold: true }),
          ]
        }),
        new Paragraph('De los equipos de cómputo:'),
        new Paragraph('Es importante: utilizar los equipos especialmente para desempeñar sus funciones dentro de la empresa,'),
        new Paragraph('el equipo recibido queda bajo la responsabilidad de cada usuario, teniendo en cuenta las siguientes instrucciones:'),
        new Paragraph('• Verificar el estado en el que es entregado el equipo'),
        new Paragraph('• Cuidar: mantener en buen estado los elementos asignados'),
        new Paragraph('• No instalar software ni aplicaciones maliciosas teniendo en cuenta que si se requieren para el uso de actividad diaria debe ser autorizado por el área de IT'),
        new Paragraph('• En caso de pérdida, daño, o robo se debe reportar al área de IT para el respectivo bloqueo y remplazo del mismo.'),
        new Paragraph('• Salvo guardar la información entregada y la generada: realizando copias de seguridad en las rutas designadas por el área de IT o el encargado del área.'),
        new Paragraph('• Navegar por las páginas permitidas por la compañía.'),
        new Paragraph('• Verificar la información enviada: para evitar ataques de intrusión o de virus en el dispositivo.'),
        new Paragraph('• No Modificar: los accesos o cuentas entregadas en los dispositivos.'),
        new Paragraph('• Mantener la privacidad: de la información en custodia, (No compartir a menos de que sea requerido.)'),
        new Paragraph('• En caso de retiro de la compañía: se debe realizar la entrega de todas las herramientas asignadas al área de IT para su respectiva revisión, si entregan a otra área debe ser informado'),
        new Paragraph(''),
        new Paragraph('De los equipos de comunicación:'),
        new Paragraph('• Verificar el estado de entrega de equipo'),
        new Paragraph('• Cuidar y mantener en buen estado los elementos asignados'),
        new Paragraph('• En caso de pérdida, daño, o robo se debe reportar al área de IT para el respectivo bloqueo y remplazo del mismo'),
        new Paragraph({ text: '' }),

        // Aceptación de políticas
        new Paragraph(`Yo _____________________________ Acepto y entiendo la POLÍTICA DE ASIGNACION Y ENTREGA DE EQUIPOS Y HERRAMIENTAS DE COMPUTO: SI: ${acta.acepta_politica ? 'X' : ''} NO: ${!acta.acepta_politica ? 'X' : ''}`),
        new Paragraph({ text: '' }),

        // Entrega del equipo
        new Paragraph({
          children: [
            new TextRun({ text: 'Entrega del equipo', bold: true }),
          ]
        }),
        new Paragraph(`Usuario quien recibe: ${acta.usuarioRecibe?.name || 'N/A'}`),
        new Paragraph(`Fecha: ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}`),
        new Paragraph(`Estado: ${acta.estado_equipo_entrega || 'N/A'}`),
        new Paragraph(`Observaciones: ${acta.observaciones_entrega || 'N/A'}`),
        new Paragraph({ text: '' }),

        // Firmas de entrega
        new Paragraph({
          children: [
            new TextRun({ text: 'FIRMAS:', bold: true }),
          ]
        }),
        new Paragraph('Firma de quien recibe: ____________________'),
        new Paragraph('Firma de quien entrega: ____________________'),
        new Paragraph(`Cargo de quien recibe: ${acta.cargo_recibe || 'N/A'}`),
        new Paragraph(`Cargo de quien entrega: ${acta.usuarioEntrega?.role?.name || 'N/A'}`),
        new Paragraph({ text: '' }),

        // Devolución si existe
        ...(acta.fecha_devolucion ? [
          new Paragraph({ text: '', pageBreakBefore: true }),
          new Paragraph({
            text: 'DEVOLUCIÓN DEL EQUIPO',
            heading: HeadingLevel.HEADING_1,
            alignment: 'center'
          }),
          new Paragraph({ text: '' }),

          // Encabezado en página de devolución
          new Paragraph({
            text: 'DuvyClass S.A.S',
            alignment: 'left',
            size: 20
          }),
          new Paragraph({
            text: 'NIT: 901.456.789-1',
            alignment: 'left',
            size: 20
          }),
          new Paragraph({
            text: `Fecha de generación: ${new Date().toLocaleDateString('es-ES')}`,
            alignment: 'right',
            size: 20
          }),
          new Paragraph({
            text: `Hora: ${new Date().toLocaleTimeString('es-ES')}`,
            alignment: 'right',
            size: 20
          }),
          new Paragraph({ text: '' }),

          new Paragraph(`Serial: ${acta.serial_imei || equipo?.serial || equipo?.imei || 'N/A'}`),
          new Paragraph(`Marca: ${acta.marca || equipo?.marca || 'N/A'}`),
          new Paragraph(`ALMACENAMIENTO: ${acta.almacenamiento || equipo?.capacidad || 'N/A'}`),
          new Paragraph(`RAM: ${acta.ram || equipo?.ram || 'N/A'}`),
          new Paragraph(`Usuario quien recibe: ${acta.usuarioEntrega?.name || 'N/A'}`),
          new Paragraph(`Fecha: ${new Date(acta.fecha_devolucion).toLocaleDateString('es-ES')}`),
          new Paragraph(`Estado: ${acta.estado_equipo_devolucion || 'N/A'}`),
          ...(acta.observaciones_devolucion ? [
            new Paragraph(`Observaciones: ${acta.observaciones_devolucion}`)
          ] : []),
          new Paragraph({ text: '' }),

          new Paragraph('Firma de quien recibe: ____________________'),
          new Paragraph('Firma de quien entrega: ____________________'),
          new Paragraph(`Cargo de quien recibe: ${acta.usuarioEntrega?.role?.name || 'N/A'}`),
          new Paragraph(`Cargo de quien entrega: ${acta.cargo_recibe || 'N/A'}`),
          new Paragraph({ text: '' }),

          new Paragraph({
            text: '*Este recuadro será diligenciado una vez el usuario asignado se retire de la compañía',
            italics: true
          }),

          new Paragraph({ text: '' }),
          new Paragraph('Elabora: _____________________'),
          new Paragraph('Revisa: _____________________'),
          new Paragraph('Aprueba: _____________________'),
          new Paragraph({ text: '' }),
          new Paragraph('Cargo: _____________________'),
          new Paragraph('Cargo: _____________________'),
          new Paragraph('Cargo: _____________________')
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
        .encabezado { display: flex; justify-content: space-between; margin-bottom: 20px; font-size: 12px; }
        .pie-pagina { display: flex; justify-content: space-between; margin-top: 50px; font-size: 12px; }
      </style>
    </head>
    <body>
      <div class="encabezado">
        <div>
          <p>DuvyClass S.A.S</p>
          <p>NIT: 901.456.789-1</p>
        </div>
        <div>
          <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
          <p>Hora: ${new Date().toLocaleTimeString('es-ES')}</p>
        </div>
      </div>

      <div class="header">
        <h1>ACTA DE ENTREGA DE EQUIPOS DE COMUNICACIÓN Y DE CÓMPUTO</h1>
      </div>

      <div class="section">
        <p><strong>Nombre:</strong> ${acta.usuarioRecibe?.name || 'N/A'}</p>
        <p><strong>Cargo:</strong> ${acta.cargo_recibe || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}</p>
      </div>

      <div class="section">
        <h3>INFORMACIÓN DEL EQUIPO</h3>
        <p><strong>Marca:</strong> ${acta.marca || equipo?.marca || 'N/A'}</p>
        <p><strong>SERIAL/IMEI:</strong> ${acta.serial_imei || equipo?.serial || equipo?.imei || 'N/A'}</p>
        <p><strong>Procesador:</strong> ${acta.procesador || equipo?.it || 'N/A'}</p>
        <p><strong>MODELO:</strong> ${acta.modelo_equipo || equipo?.propiedad || equipo?.equipo_celular || 'N/A'}</p>
        <p><strong>LÍNEA TELEFÓNICA:</strong> ${acta.linea_telefonica || 'N/A'}</p>
        <p><strong>CELULAR:</strong> ${acta.tipo_equipo_detallado === 'celular' ? 'X' : ''}</p>
        <p><strong>ALMACENAMIENTO:</strong> ${acta.almacenamiento || equipo?.capacidad || 'N/A'}</p>
        <p><strong>RAM:</strong> ${acta.ram || equipo?.ram || 'N/A'}</p>
        <p><strong>S.O:</strong> ${acta.sistema_operativo || 'N/A'}</p>
        <p><strong>IMEI:</strong> ${acta.serial_imei || equipo?.imei || 'N/A'}</p>
      </div>

      <div class="section">
        <h3>ACCESORIOS</h3>
        <p><strong>CARGADOR:</strong> ${acta.accesorio_cargador ? 'X' : ''}</p>
        <p><strong>Teclado:</strong> ${acta.accesorio_teclado ? 'X' : ''}</p>
        <p><strong>OFFICE:</strong> ${acta.accesorio_office ? 'X' : ''}</p>
        <p><strong>ANTIVIRUS:</strong> ${acta.accesorio_antivirus ? 'X' : ''}</p>
        <p><strong>SSD:</strong> ${acta.accesorio_ssd ? 'X' : ''}</p>
        <p><strong>HDD:</strong> ${acta.accesorio_hdd ? 'X' : ''}</p>
      </div>

      <div class="section">
        <h3>OBSERVACIONES DEL EQUIPO</h3>
        <p>${acta.observaciones_equipo || 'N/A'}</p>
      </div>

      <div class="section">
        <h3>POLÍTICAS DE USO</h3>
        <div class="politicas">
          <p>De los equipos de cómputo:</p>
          <p>Es importante: utilizar los equipos especialmente para desempeñar sus funciones dentro de la empresa,</p>
          <p>el equipo recibido queda bajo la responsabilidad de cada usuario, teniendo en cuenta las siguientes instrucciones:</p>
          <ul>
            <li>Verificar el estado en el que es entregado el equipo</li>
            <li>Cuidar: mantener en buen estado los elementos asignados</li>
            <li>No instalar software ni aplicaciones maliciosas teniendo en cuenta que si se requieren para el uso de actividad diaria debe ser autorizado por el área de IT</li>
            <li>En caso de pérdida, daño, o robo se debe reportar al área de IT para el respectivo bloqueo y remplazo del mismo.</li>
            <li>Salvo guardar la información entregada y la generada: realizando copias de seguridad en las rutas designadas por el área de IT o el encargado del área.</li>
            <li>Navegar por las páginas permitidas por la compañía.</li>
            <li>Verificar la información enviada: para evitar ataques de intrusión o de virus en el dispositivo.</li>
            <li>No Modificar: los accesos o cuentas entregadas en los dispositivos.</li>
            <li>Mantener la privacidad: de la información en custodia, (No compartir a menos de que sea requerido.)</li>
            <li>En caso de retiro de la compañía: se debe realizar la entrega de todas las herramientas asignadas al área de IT para su respectiva revisión, si entregan a otra área debe ser informado</li>
          </ul>
          <p>De los equipos de comunicación:</p>
          <ul>
            <li>Verificar el estado de entrega de equipo</li>
            <li>Cuidar y mantener en buen estado los elementos asignados</li>
            <li>En caso de pérdida, daño, o robo se debe reportar al área de IT para el respectivo bloqueo y remplazo del mismo</li>
          </ul>
        </div>
      </div>

      <div class="section">
        <p>Yo _____________________________ Acepto y entiendo la POLÍTICA DE ASIGNACION Y ENTREGA DE EQUIPOS Y HERRAMIENTAS DE COMPUTO:</p>
        <p>SI: ${acta.acepta_politica ? 'X' : ''} NO: ${!acta.acepta_politica ? 'X' : ''}</p>
      </div>

      <div class="section">
        <h3>Entrega del equipo</h3>
        <p><strong>Usuario quien recibe:</strong> ${acta.usuarioRecibe?.name || 'N/A'}</p>
        <p><strong>Fecha:</strong> ${new Date(acta.fecha_entrega).toLocaleDateString('es-ES')}</p>
        <p><strong>Estado:</strong> ${acta.estado_equipo_entrega || 'N/A'}</p>
        <p><strong>Observaciones:</strong> ${acta.observaciones_entrega || 'N/A'}</p>
      </div>

      <div class="section">
        <h3>FIRMAS</h3>
        <div class="firmas">
          <div class="firma">
            <div class="firma-line"></div>
            <p><strong>Firma de quien recibe</strong></p>
            <p>Cargo: ${acta.cargo_recibe || 'N/A'}</p>
          </div>
          <div class="firma">
            <div class="firma-line"></div>
            <p><strong>Firma de quien entrega</strong></p>
            <p>Cargo: ${acta.usuarioEntrega?.role?.name || 'N/A'}</p>
          </div>
        </div>
      </div>

      ${acta.fecha_devolucion ? `
        <div style="page-break-before: always;">
          <div class="encabezado">
            <div>
              <p>DuvyClass S.A.S</p>
              <p>NIT: 901.456.789-1</p>
            </div>
            <div>
              <p>Fecha de generación: ${new Date().toLocaleDateString('es-ES')}</p>
              <p>Hora: ${new Date().toLocaleTimeString('es-ES')}</p>
            </div>
          </div>

          <div class="header">
            <h1>DEVOLUCIÓN DEL EQUIPO</h1>
          </div>

          <div class="section">
            <p><strong>Serial:</strong> ${acta.serial_imei || equipo?.serial || equipo?.imei || 'N/A'}</p>
            <p><strong>Marca:</strong> ${acta.marca || equipo?.marca || 'N/A'}</p>
            <p><strong>ALMACENAMIENTO:</strong> ${acta.almacenamiento || equipo?.capacidad || 'N/A'}</p>
            <p><strong>RAM:</strong> ${acta.ram || equipo?.ram || 'N/A'}</p>
            <p><strong>Usuario quien recibe:</strong> ${acta.usuarioEntrega?.name || 'N/A'}</p>
            <p><strong>Fecha:</strong> ${new Date(acta.fecha_devolucion).toLocaleDateString('es-ES')}</p>
            <p><strong>Estado:</strong> ${acta.estado_equipo_devolucion || 'N/A'}</p>
            ${acta.observaciones_devolucion ? `
              <p><strong>Observaciones:</strong> ${acta.observaciones_devolucion}</p>
            ` : ''}
          </div>

          <div class="section">
            <h3>FIRMAS DE DEVOLUCIÓN</h3>
            <div class="firmas">
              <div class="firma">
                <div class="firma-line"></div>
                <p><strong>Firma de quien recibe</strong></p>
              </div>
              <div class="firma">
                <div class="firma-line"></div>
                <p><strong>Firma de quien entrega</strong></p>
              </div>
            </div>
          </div>

          <div class="section">
            <p><em>*Este recuadro será diligenciado una vez el usuario asignado se retire de la compañía</em></p>
          </div>

          <div class="pie-pagina">
            <div>
              <p>Elabora: _____________________</p>
              <p>Cargo: _____________________</p>
            </div>
            <div>
              <p>Revisa: _____________________</p>
              <p>Cargo: _____________________</p>
            </div>
            <div>
              <p>Aprueba: _____________________</p>
              <p>Cargo: _____________________</p>
            </div>
          </div>
        </div>
      ` : ''}

      <div class="pie-pagina">
        <div>
          <p>Elabora: _____________________</p>
          <p>Cargo: _____________________</p>
        </div>
        <div>
          <p>Revisa: _____________________</p>
          <p>Cargo: _____________________</p>
        </div>
        <div>
          <p>Aprueba: _____________________</p>
          <p>Cargo: _____________________</p>
        </div>
      </div>
    </body>
    </html>
  `;
};