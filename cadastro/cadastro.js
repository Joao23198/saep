const form = document.getElementById('produtoForm');
const tabela = document.getElementById('tabelaProdutos').querySelector('tbody');
const busca = document.getElementById('busca');

let produtos = [];

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const nome = document.getElementById('nome').value;
  const descricao = document.getElementById('descricao').value;
  const estoqueMinimo = document.getElementById('estoqueMinimo').value;
  const quantidadeAtual = document.getElementById('quantidadeAtual').value;

  const produto = { nome, descricao, estoqueMinimo, quantidadeAtual };
  produtos.push(produto);
  atualizarTabela();
  form.reset();
});

document.getElementById('excluirBtn').addEventListener('click', function() {
  const nome = document.getElementById('nome').value;
  produtos = produtos.filter(p => p.nome !== nome);
  atualizarTabela();
});

busca.addEventListener('input', function() {
  atualizarTabela(busca.value);
});

function atualizarTabela(filtro = "") {
  tabela.innerHTML = "";
  produtos
    .filter(p => p.nome.toLowerCase().includes(filtro.toLowerCase()))
    .forEach(p => {
      const row = `<tr>
        <td>${p.nome}</td>
        <td>${p.descricao}</td>
        <td>${p.estoqueMinimo}</td>
        <td>${p.quantidadeAtual}</td>
      </tr>`;
      tabela.innerHTML += row;
    });
}
