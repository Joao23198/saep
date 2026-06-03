const form = document.getElementById('produtoForm');
const tabelaBody = document.querySelector('#tabelaProdutos tbody');
const buscaInput = document.getElementById('busca');

let produtos = [];

// Carregar produtos ao abrir a página
async function carregarProdutos() {
  try {
    const response = await fetch("http://localhost:3000/api/produtos");
    produtos = await response.json();
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
      <td>${p.descricao}</td>
      <td>${p.estoque_minimo}</td>
      <td>${p.quantidade_atual}</td>
      <td>
        <button onclick="editarProduto(${p.id_produto})">Editar</button>
        <button onclick="excluirProduto(${p.id_produto})">Excluir</button>
      </td>
    `;
    tabelaBody.appendChild(row);
  });
}

// Buscar produto
buscaInput.addEventListener("input", () => {
  const termo = buscaInput.value.toLowerCase();
  const filtrados = produtos.filter(p =>
    p.nome.toLowerCase().includes(termo) ||
    p.descricao.toLowerCase().includes(termo)
  );
  atualizarTabela(filtrados);
});

// Cadastrar novo produto com validações
form.addEventListener("submit", async function(e) {
  e.preventDefault();

  const nome = document.getElementById("nome").value.trim();
  const descricao = document.getElementById("descricao").value.trim();
  const estoqueMinimo = parseInt(document.getElementById("estoqueMinimo").value);
  const quantidadeAtual = parseInt(document.getElementById("quantidadeAtual").value);

  // Validações
  if (!nome) {
    alert("O nome do produto é obrigatório!");
    return;
  }
  if (isNaN(estoqueMinimo) || estoqueMinimo < 0) {
    alert("Estoque mínimo deve ser um número maior ou igual a zero!");
    return;
  }
  if (isNaN(quantidadeAtual) || quantidadeAtual < 0) {
    alert("Quantidade atual deve ser um número maior ou igual a zero!");
    return;
  }

  const produto = { nome, descricao, estoqueMinimo, quantidadeAtual };

  try {
    const response = await fetch("http://localhost:3000/api/produtos", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(produto)
    });
    const result = await response.json();
    alert(result.message);
    form.reset();
    carregarProdutos();
  } catch (error) {
    console.error("Erro ao cadastrar produto:", error);
  }
});

// Editar produto (PUT)
async function editarProduto(id) {
  const produto = produtos.find(p => p.id_produto === id);
  if (!produto) return;

  const novoNome = prompt("Novo nome:", produto.nome);
  const novaDescricao = prompt("Nova descrição:", produto.descricao);
  const novoEstoqueMinimo = parseInt(prompt("Novo estoque mínimo:", produto.estoque_minimo));
  const novaQuantidadeAtual = parseInt(prompt("Nova quantidade atual:", produto.quantidade_atual));

  if (!novoNome || novoNome.trim() === "") {
    alert("Nome do produto é obrigatório!");
    return;
  }
  if (isNaN(novoEstoqueMinimo) || novoEstoqueMinimo < 0) {
    alert("Estoque mínimo inválido!");
    return;
  }
  if (isNaN(novaQuantidadeAtual) || novaQuantidadeAtual < 0) {
    alert("Quantidade atual inválida!");
    return;
  }

  try {
    const response = await fetch(`http://localhost:3000/api/produtos/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        nome: novoNome,
        descricao: novaDescricao,
        estoqueMinimo: novoEstoqueMinimo,
        quantidadeAtual: novaQuantidadeAtual
      })
    });
    const result = await response.json();
    alert(result.message);
    carregarProdutos();
  } catch (error) {
    console.error("Erro ao editar produto:", error);
  }
}

// Excluir produto (DELETE)
async function excluirProduto(id) {
  if (!confirm("Deseja realmente excluir este produto?")) return;
  try {
    const response = await fetch(`http://localhost:3000/api/produtos/${id}`, {
      method: "DELETE"
    });
    const result = await response.json();
    alert(result.message);
    carregarProdutos();
  } catch (error) {
    console.error("Erro ao excluir produto:", error);
  }
}

// Inicializa
carregarProdutos();
