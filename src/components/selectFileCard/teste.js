document.getElementById('btnProcessCSV').addEventListener('click', processCSV);

function processCSV() {
    const fileInput = document.getElementById('csvFile');
    const csvTable = document.getElementById('csvTable');

    // Verifica se um arquivo foi selecionado
    if (fileInput.files.length === 0) {
        alert('Nenhum arquivo selecionado.');
        return;
    }

    const file = fileInput.files[0];

    // Verifica se o arquivo selecionado é um arquivo CSV
    if (!file.name.endsWith('.csv')) {
        alert('Por favor, selecione um arquivo CSV válido.');
        return;
    }

    Papa.parse(file, {
        header: false,
        dynamicTyping: true,
        skipEmptyLines: true,
        complete: function(results) {
            const data = results.data;
            const columns = results.meta.fields;

            // Cria o cabeçalho da tabela
            const thead = document.querySelector('#csvTable thead');
            const headerRow = document.createElement('tr');
            columns.forEach(column => {
                const th = document.createElement('th');
                th.textContent = column;
                headerRow.appendChild(th);
            });
            thead.appendChild(headerRow);

            // Cria o corpo da tabela com as 5 primeiras linhas
            const tbody = document.querySelector('#csvTable tbody');
            tbody.innerHTML = '';
            for (let i = 0; i < 5 && i < data.length; i++) {
                const row = document.createElement('tr');
                columns.forEach(column => {
                    const td = document.createElement('td');
                    td.textContent = data[i][column];
                    row.appendChild(td);
                });
                tbody.appendChild(row);
            }
        }
    });