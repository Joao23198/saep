const tabela = document.getElementById('tabelaHistorico').querySelector('tbody');

// Exemplo de movimentações (em sistema real viria do banco)
let historico = [
  { data: "01/06/2026 10:00", produto: "Caneta", tipo: "Entrada", quantidade: 20, responsavel: "admin" },
  { data: "01/06/2026 10:15", produto: "Caderno", tipo: "Saída", quantidade: 5, responsavel: "admin" },
  { data: "01/06/2026 10:20", produto: "Borracha", tipo: "Entrada", quantidade: 10, responsavel: "joao" }
];

function atualizarTabela() {
  tabela.innerHTML = "";
  historico.forEach(m => {
    const row = `<tr>
      <td>${m.data}</td>
      <td>${m.produto}</td>
      <td>${m.tipo}</td>
      <td>${m.quantidade}</td>
      <td>${m.responsavel}</td>
    </tr>`;
    tabela.innerHTML += row;
  });
}

// Inicializa tabela
atualizarTabela();
