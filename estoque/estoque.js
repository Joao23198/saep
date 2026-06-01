const form = document.getElementById('movForm');
const tabela = document.getElementById('tabelaEstoque').querySelector('tbody');
const alerta = document.getElementById('alerta');

// Exemplo de produtos cadastrados (em sistema real viria do banco)
let produtos = [
  { nome: "Caneta", quantidadeAtual: 10, estoqueMinimo: 5 },
  { nome: "Caderno", quantidadeAtual: 3, estoqueMinimo: 5 },
  { nome: "Borracha", quantidadeAtual: 8, estoqueMinimo: 2 }
];

// Preenche select de produtos
const selectProduto = document.getElementById('produto');
produtos.forEach(p => {
  const opt = document.createElement('option');
  opt.value = p.nome;
  opt.textContent = p.nome;
  selectProduto.appendChild(opt);
});

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = selectProduto.value;
  const tipo = document.getElementById('tipoMov').value;
  const qtd = parseInt(document.getElementById('quantidade').value);

  const produto = produtos.find(p => p.nome === nome);
  if(tipo === "entrada") {
    produto.quantidadeAtual += qtd;
  } else {
    produto.quantidadeAtual -= qtd;
  }

  atualizarTabela();
  verificarAlerta(produto);
  form.reset();
});

function atualizarTabela() {
  tabela.innerHTML = "";
  produtos
    .sort((a, b) => a.nome.localeCompare(b.nome))
    .forEach(p => {
      const row = `<tr>
        <td>${p.nome}</td>
        <td>${p.quantidadeAtual}</td>
        <td>${p.estoqueMinimo}</td>
      </tr>`;
      tabela.innerHTML += row;
    });
}

function verificarAlerta(produto) {
  if(produto.quantidadeAtual < produto.estoqueMinimo) {
    alerta.textContent = `⚠️ Atenção: estoque de ${produto.nome} abaixo do mínimo!`;
  } else {
    alerta.textContent = "";
  }
}

// Inicializa tabela
atualizarTabela();
