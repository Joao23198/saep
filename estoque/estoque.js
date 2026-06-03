const form = document.getElementById("movForm");
const tabelaBody = document.querySelector("#tabelaEstoque tbody");
const alertaDiv = document.getElementById("alerta");
const produtoSelect = document.getElementById("produto");

let produtos = [];

// Carregar produtos ao abrir a página
async function carregarProdutos() {
  try {
    const response = await fetch("http://localhost:3000/api/produtos");
    produtos = await response.json();

    // Ordena alfabeticamente
    produtos.sort((a, b) => a.nome.localeCompare(b.nome));

    // Preenche select
    produtoSelect.innerHTML = '<option value="">Selecione um produto</option>';
    produtos.forEach(p => {
      const option = document.createElement("option");
      option.value = p.id_produto;
      option.textContent = p.nome;
      produtoSelect.appendChild(option);
    });

    atualizarTabela(produtos);
  } catch (error) {
    console.error("Erro ao carregar produtos:", error);
  }
}

// Atualizar tabela
function atualizarTabela(lista) {
  tabelaBody.innerHTML = "";
  lista.forEach(p => {
    const row = document.createElement("tr");
    row.innerHTML = `
      <td>${p.nome}</td>
      <td>${p.quantidade_atual}</td>
      <td>${p.estoque_minimo}</td>
    `;
    tabelaBody.appendChild(row);
  });
}

// Registrar movimentação com validações
form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const id_produto = produtoSelect.value;
  const tipo = document.getElementById("tipoMov").value;
  const quantidade = parseInt(document.getElementById("quantidade").value);
  const dataMov = document.getElementById("dataMov").value; // campo de data no formulário
  const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));

  // Validações
  if (!id_produto) {
    alertaDiv.textContent = "Selecione um produto!";
    return;
  }
  if (!tipo || (tipo !== "entrada" && tipo !== "saida")) {
    alertaDiv.textContent = "Tipo inválido! Escolha 'entrada' ou 'saida'.";
    return;
  }
  if (isNaN(quantidade) || quantidade <= 0) {
    alertaDiv.textContent = "Quantidade deve ser maior que zero!";
    return;
  }
  if (!dataMov) {
    alertaDiv.textContent = "Informe a data da movimentação!";
    return;
  }
  if (!usuario) {
    alertaDiv.textContent = "Usuário não identificado. Faça login novamente.";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/movimentacoes", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        id_produto,
        id_usuario: usuario.id_usuario,
        tipo,
        quantidade,
        data_movimentacao: dataMov
      })
    });

    const result = await response.json();
    alert(result.message);

    // Recarregar produtos para atualizar tabela
    await carregarProdutos();

    // Verificar estoque mínimo
    const produto = produtos.find(p => p.id_produto == id_produto);
    if (produto && produto.quantidade_atual < produto.estoque_minimo) {
      alertaDiv.textContent = `⚠️ Atenção: o produto "${produto.nome}" está abaixo do estoque mínimo!`;
    } else {
      alertaDiv.textContent = "";
    }

    form.reset();
  } catch (error) {
    console.error("Erro ao registrar movimentação:", error);
    alertaDiv.textContent = "Erro ao registrar movimentação.";
  }
});

// Inicializa
carregarProdutos();
