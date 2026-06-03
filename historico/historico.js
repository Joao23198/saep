const tabelaBody = document.querySelector("#tabelaHistorico tbody");

// Carregar histórico ao abrir a página
async function carregarHistorico() {
  try {
    const response = await fetch("http://localhost:3000/api/movimentacoes");
    const movimentacoes = await response.json();

    atualizarTabela(movimentacoes);
  } catch (error) {
    console.error("Erro ao carregar histórico:", error);
  }
}

// Atualizar tabela
function atualizarTabela(lista) {
  tabelaBody.innerHTML = "";
  lista.forEach(m => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${new Date(m.data_movimentacao).toLocaleDateString("pt-BR")}</td>
      <td>${m.produto}</td>
      <td>${m.tipo}</td>
      <td>${m.quantidade}</td>
      <td>${m.usuario}</td>
    `;
    tabelaBody.appendChild(row);
  });
}



// Inicializa
carregarHistorico();
