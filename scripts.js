
  // Datos de ejemplo (en un caso real, estos vendrían de una API)
  const sampleData = [
    { fecha: '2023-06-15 08:30', tipo: 'Humedad del Suelo', valor: '45%', sector: 'Norte', cultivo: 'Maíz', estado: 'Normal', bateria: '82%' },
    { fecha: '2023-06-15 08:30', tipo: 'Humedad Ambiental', valor: '72%', sector: 'Norte', cultivo: 'Maíz', estado: 'Alerta', bateria: '75%' },
    { fecha: '2023-06-15 08:15', tipo: 'Humedad del Suelo', valor: '38%', sector: 'Sur', cultivo: 'Soja', estado: 'Alerta', bateria: '68%' },
    { fecha: '2023-06-15 08:15', tipo: 'Temperatura', valor: '24.5°C', sector: 'Central', cultivo: 'Hortalizas', estado: 'Normal', bateria: '90%' },
    { fecha: '2023-06-15 08:00', tipo: 'Luminosidad', valor: '850 lux', sector: 'Este', cultivo: 'Trigo', estado: 'Normal', bateria: '88%' },
    { fecha: '2023-06-15 08:00', tipo: 'Humedad del Suelo', valor: '52%', sector: 'Oeste', cultivo: 'Maíz', estado: 'Normal', bateria: '79%' },
    { fecha: '2023-06-15 07:45', tipo: 'Humedad Ambiental', valor: '65%', sector: 'Central', cultivo: 'Hortalizas', estado: 'Normal', bateria: '72%' },
    { fecha: '2023-06-15 07:45', tipo: 'Temperatura', valor: '22.1°C', sector: 'Norte', cultivo: 'Maíz', estado: 'Normal', bateria: '85%' },
    { fecha: '2023-06-14 16:30', tipo: 'Humedad del Suelo', valor: '40%', sector: 'Sur', cultivo: 'Soja', estado: 'Normal', bateria: '78%' },
    { fecha: '2023-06-14 16:30', tipo: 'Temperatura', valor: '26.3°C', sector: 'Este', cultivo: 'Trigo', estado: 'Alerta', bateria: '82%' },
    { fecha: '2023-06-14 16:15', tipo: 'Luminosidad', valor: '1200 lux', sector: 'Norte', cultivo: 'Maíz', estado: 'Normal', bateria: '90%' },
    { fecha: '2023-06-14 16:15', tipo: 'Humedad Ambiental', valor: '70%', sector: 'Oeste', cultivo: 'Maíz', estado: 'Normal', bateria: '76%' },
    { fecha: '2023-06-14 16:00', tipo: 'Humedad del Suelo', valor: '48%', sector: 'Central', cultivo: 'Hortalizas', estado: 'Normal', bateria: '85%' },
    { fecha: '2023-06-14 16:00', tipo: 'Temperatura', valor: '25.7°C', sector: 'Sur', cultivo: 'Soja', estado: 'Alerta', bateria: '72%' },
    { fecha: '2023-06-14 15:45', tipo: 'Luminosidad', valor: '1100 lux', sector: 'Este', cultivo: 'Trigo', estado: 'Normal', bateria: '88%' },
    { fecha: '2023-06-14 15:45', tipo: 'Humedad Ambiental', valor: '68%', sector: 'Norte', cultivo: 'Maíz', estado: 'Normal', bateria: '80%' }
  ];

  // Variables de estado
  let currentPage = 1;
  const rowsPerPage = 8;
  let filteredData = [...sampleData];

  // Elementos del DOM
  const tableBody = document.querySelector('.data-table tbody');
  const paginationContainer = document.querySelector('.pagination');
  const filterButton = document.querySelector('.filter-button');
  const fechaInicioInput = document.getElementById('fecha-inicio');
  const fechaFinInput = document.getElementById('fecha-fin');
  const tipoSensorSelect = document.getElementById('tipo-sensor');
  const sectorSelect = document.getElementById('sector');
  const cultivoSelect = document.getElementById('cultivo');
  const exportCsvButton = document.querySelector('.export-button:nth-child(1)');
  const exportExcelButton = document.querySelector('.export-button:nth-child(2)');
  const printButton = document.querySelector('.export-button:nth-child(3)');

  // Inicialización
  document.addEventListener('DOMContentLoaded', () => {
    renderTable();
    setupPagination();
    
    // Event listeners
    filterButton.addEventListener('click', applyFilters);
    exportCsvButton.addEventListener('click', exportToCsv);
    exportExcelButton.addEventListener('click', exportToExcel);
    printButton.addEventListener('click', printTable);
    
    // Configurar fechas por defecto (últimos 7 días)
    const today = new Date();
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(today.getDate() - 7);
    
    fechaInicioInput.valueAsDate = sevenDaysAgo;
    fechaFinInput.valueAsDate = today;
  });

  // Función para renderizar la tabla
  function renderTable() {
    // Limpiar tabla
    tableBody.innerHTML = '';
    
    // Calcular índices para la paginación
    const startIndex = (currentPage - 1) * rowsPerPage;
    const endIndex = startIndex + rowsPerPage;
    const paginatedData = filteredData.slice(startIndex, endIndex);
    
    // Llenar tabla con datos
    paginatedData.forEach(item => {
      const row = document.createElement('tr');
      
      // Determinar clase de estado
      let estadoClass = 'status-normal';
      if (item.estado === 'Alerta') {
        estadoClass = 'status-warning';
      } else if (item.estado === 'Crítico') {
        estadoClass = 'status-alert';
      }
      
      row.innerHTML = `
        <td>${item.fecha}</td>
        <td>${item.tipo}</td>
        <td>${item.valor}</td>
        <td>${item.sector}</td>
        <td>${item.cultivo}</td>
        <td><span class="status-badge ${estadoClass}">${item.estado}</span></td>
        <td>${item.bateria}</td>
      `;
      
      tableBody.appendChild(row);
    });
    
    // Actualizar paginación
    setupPagination();
  }

  // Función para configurar la paginación
  function setupPagination() {
    const pageCount = Math.ceil(filteredData.length / rowsPerPage);
    
    // Limpiar botones existentes
    paginationContainer.innerHTML = '';
    
    // Botón Anterior
    const prevButton = document.createElement('button');
    prevButton.className = 'page-button';
    prevButton.innerHTML = '&laquo;';
    prevButton.addEventListener('click', () => {
      if (currentPage > 1) {
        currentPage--;
        renderTable();
      }
    });
    paginationContainer.appendChild(prevButton);
    
    // Botones de página
    for (let i = 1; i <= pageCount; i++) {
      const pageButton = document.createElement('button');
      pageButton.className = `page-button ${i === currentPage ? 'active' : ''}`;
      pageButton.textContent = i;
      pageButton.addEventListener('click', () => {
        currentPage = i;
        renderTable();
      });
      paginationContainer.appendChild(pageButton);
    }
    
    // Botón Siguiente
    const nextButton = document.createElement('button');
    nextButton.className = 'page-button';
    nextButton.innerHTML = '&raquo;';
    nextButton.addEventListener('click', () => {
      if (currentPage < pageCount) {
        currentPage++;
        renderTable();
      }
    });
    paginationContainer.appendChild(nextButton);
  }

  // Función para aplicar filtros
  function applyFilters() {
    const fechaInicio = fechaInicioInput.value;
    const fechaFin = fechaFinInput.value;
    const tipoSensor = tipoSensorSelect.value;
    const sector = sectorSelect.value;
    const cultivo = cultivoSelect.value;
    
    // Resetear a la primera página
    currentPage = 1;
    
    // Aplicar filtros
    filteredData = sampleData.filter(item => {
      // Filtro por fecha
      if (fechaInicio || fechaFin) {
        const itemDate = new Date(item.fecha.split(' ')[0]).getTime();
        
        if (fechaInicio) {
          const filterStartDate = new Date(fechaInicio).getTime();
          if (itemDate < filterStartDate) return false;
        }
        
        if (fechaFin) {
          const filterEndDate = new Date(fechaFin).getTime();
          if (itemDate > filterEndDate) return false;
        }
      }
      
      // Filtro por tipo de sensor (mejorado para coincidencia parcial)
      if (tipoSensor) {
        const tipoMap = {
          'humedad-suelo': 'Humedad del Suelo',
          'humedad-ambiental': 'Humedad Ambiental',
          'temperatura': 'Temperatura',
          'luminosidad': 'Luminosidad'
        };
        
        const tipoBuscado = tipoMap[tipoSensor];
        if (!item.tipo.includes(tipoBuscado)) return false;
      }
      
      // Filtro por sector (case insensitive)
      if (sector && item.sector.toLowerCase() !== sector.toLowerCase()) return false;
      
      // Filtro por cultivo (case insensitive)
      if (cultivo && item.cultivo.toLowerCase() !== cultivo.toLowerCase()) return false;
      
      return true;
    });
    
    renderTable();
    
    // Mostrar mensaje si no hay resultados
    if (filteredData.length === 0) {
      alert('No se encontraron registros con los filtros aplicados');
    }
}

  // Función para exportar a CSV
  function exportToCsv() {
    let csvContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    csvContent += "Fecha y Hora,Tipo de Sensor,Valor,Sector,Cultivo,Estado,Batería\n";
    
    // Datos
    filteredData.forEach(item => {
      const row = [
        item.fecha,
        item.tipo,
        item.valor,
        item.sector,
        item.cultivo,
        item.estado,
        item.bateria
      ].join(',');
      csvContent += row + "\n";
    });
    
    // Descargar archivo
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registros_simca.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Función para exportar a Excel (simulada con CSV)
  function exportToExcel() {
    // En un entorno real, usarías una librería como SheetJS
    // Esta es una simulación que exporta CSV con extensión .xls
    let excelContent = "data:text/csv;charset=utf-8,";
    
    // Encabezados
    excelContent += "Fecha y Hora,Tipo de Sensor,Valor,Sector,Cultivo,Estado,Batería\n";
    
    // Datos
    filteredData.forEach(item => {
      const row = [
        item.fecha,
        item.tipo,
        item.valor,
        item.sector,
        item.cultivo,
        item.estado,
        item.bateria
      ].join(',');
      excelContent += row + "\n";
    });
    
    // Descargar archivo
    const encodedUri = encodeURI(excelContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "registros_simca.xls");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  // Función para imprimir la tabla
  function printTable() {
    const printWindow = window.open('', '_blank');
    printWindow.document.write(`
      <html>
        <head>
          <title>Registros Históricos SIMCA</title>
          <style>
            body { font-family: Arial, sans-serif; }
            table { width: 100%; border-collapse: collapse; margin-top: 20px; }
            th, td { border: 1px solid #ddd; padding: 8px; text-align: left; }
            th { background-color: #f2f2f2; }
            .status-badge { padding: 2px 8px; border-radius: 12px; font-size: 0.8em; }
            .status-normal { background-color: #e6ffed; color: #22863a; }
            .status-warning { background-color: #fff5b1; color: #735c0f; }
            .status-alert { background-color: #ffeef0; color: #cb2431; }
            h1 { color: #333; }
            @media print {
              .no-print { display: none; }
              body { padding: 20px; }
            }
          </style>
        </head>
        <body>
          <h1>Registros Históricos SIMCA</h1>
          <p>Fecha de generación: ${new Date().toLocaleString()}</p>
          <table>
            <thead>
              <tr>
                <th>Fecha y Hora</th>
                <th>Tipo de Sensor</th>
                <th>Valor</th>
                <th>Sector</th>
                <th>Cultivo</th>
                <th>Estado</th>
                <th>Batería</th>
              </tr>
            </thead>
            <tbody>
              ${filteredData.map(item => `
                <tr>
                  <td>${item.fecha}</td>
                  <td>${item.tipo}</td>
                  <td>${item.valor}</td>
                  <td>${item.sector}</td>
                  <td>${item.cultivo}</td>
                  <td><span class="status-badge ${item.estado === 'Normal' ? 'status-normal' : item.estado === 'Alerta' ? 'status-warning' : 'status-alert'}">${item.estado}</span></td>
                  <td>${item.bateria}</td>
                </tr>
              `).join('')}
            </tbody>
          </table>
          <script>
            window.onload = function() {
              setTimeout(function() {
                window.print();
                window.close();
              }, 200);
            };
          </script>
        </body>
      </html>
    `);
    printWindow.document.close();
  }