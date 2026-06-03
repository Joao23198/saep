const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(bodyParser.json());

// Conexão com MySQL
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'root',
  database: 'saep_db'
});

// ---------------- ROTAS DA API ----------------

// LOGIN
app.post('/api/login', (req, res) => {
  const { login, senha } = req.body;
  if (!login || !senha) {
    return res.status(400).json({ message: 'Login e senha são obrigatórios!' });
  }

  db.query('SELECT * FROM usuario WHERE login=? AND senha=?', [login, senha], (err, results) => {
    if (err) return res.status(500).send(err);
    if (results.length > 0) {
      res.json({ success: true, usuario: results[0] });
    } else {
      res.json({ success: false, message: 'Login inválido' });
    }
  });
});

// PRODUTOS
app.post('/api/produtos', (req, res) => {
  const { nome, descricao, estoqueMinimo, quantidadeAtual } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ message: 'Nome do produto é obrigatório!' });
  }
  if (estoqueMinimo == null || quantidadeAtual == null) {
    return res.status(400).json({ message: 'Estoque mínimo e quantidade atual são obrigatórios!' });
  }
  if (estoqueMinimo < 0 || quantidadeAtual < 0) {
    return res.status(400).json({ message: 'Valores de estoque não podem ser negativos!' });
  }

  db.query(
    'INSERT INTO produto (nome, descricao, estoque_minimo, quantidade_atual) VALUES (?, ?, ?, ?)',
    [nome, descricao, estoqueMinimo, quantidadeAtual],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Produto cadastrado com sucesso!' });
    }
  );
});

app.get('/api/produtos', (req, res) => {
  db.query('SELECT * FROM produto', (err, results) => {
    if (err) return res.status(500).send(err);
    res.json(results);
  });
});

// MOVIMENTAÇÕES
app.post('/api/movimentacoes', (req, res) => {
  const { id_produto, id_usuario, tipo, quantidade, data_movimentacao } = req.body;

  if (!id_produto || !id_usuario || !tipo || !quantidade) {
    return res.status(400).json({ message: 'Todos os campos são obrigatórios!' });
  }
  if (quantidade <= 0) {
    return res.status(400).json({ message: 'Quantidade deve ser maior que zero!' });
  }
  if (tipo !== 'entrada' && tipo !== 'saida') {
    return res.status(400).json({ message: 'Tipo inválido! Use "entrada" ou "saida".' });
  }

  const data = data_movimentacao || new Date().toISOString().split('T')[0];

  db.query(
    'INSERT INTO movimentacao (id_produto, id_usuario, tipo, quantidade, data_movimentacao) VALUES (?, ?, ?, ?, ?)',
    [id_produto, id_usuario, tipo, quantidade, data],
    (err) => {
      if (err) return res.status(500).send(err);

      const updateSql = tipo === 'entrada'
        ? 'UPDATE produto SET quantidade_atual = quantidade_atual + ? WHERE id_produto = ?'
        : 'UPDATE produto SET quantidade_atual = quantidade_atual - ? WHERE id_produto = ?';

      db.query(updateSql, [quantidade, id_produto], (err2) => {
        if (err2) return res.status(500).send(err2);
        res.json({ message: 'Movimentação registrada com sucesso!' });
      });
    }
  );
});

// HISTÓRICO DE MOVIMENTAÇÕES
app.get('/api/movimentacoes', (req, res) => {
  const sql = `
    SELECT m.id_movimentacao, m.data_movimentacao, m.tipo, m.quantidade,
           p.nome AS produto, u.nome AS usuario
    FROM movimentacao m
    LEFT JOIN produto p ON m.id_produto = p.id_produto
    LEFT JOIN usuario u ON m.id_usuario = u.id_usuario
    ORDER BY m.data_movimentacao DESC
  `;
  db.query(sql, (err, results) => {
    if (err) {
      console.error("Erro ao buscar movimentações:", err.sqlMessage);
      return res.status(500).json({ message: "Erro ao buscar movimentações", error: err.sqlMessage });
    }
    res.json(results);
  });
});

// EDITAR produto (PUT)
app.put('/api/produtos/:id', (req, res) => {
  const { id } = req.params;
  const { nome, descricao, estoqueMinimo, quantidadeAtual } = req.body;

  if (!nome || nome.trim() === '') {
    return res.status(400).json({ message: 'Nome do produto é obrigatório!' });
  }
  if (estoqueMinimo < 0 || quantidadeAtual < 0) {
    return res.status(400).json({ message: 'Valores de estoque não podem ser negativos!' });
  }

  db.query(
    'UPDATE produto SET nome=?, descricao=?, estoque_minimo=?, quantidade_atual=? WHERE id_produto=?',
    [nome, descricao, estoqueMinimo, quantidadeAtual, id],
    (err) => {
      if (err) return res.status(500).send(err);
      res.json({ message: 'Produto atualizado com sucesso!' });
    }
  );
});

// EXCLUIR produto (DELETE)
app.delete('/api/produtos/:id', (req, res) => {
  const { id } = req.params;

  db.query('DELETE FROM produto WHERE id_produto=?', [id], (err) => {
    if (err) return res.status(500).send(err);
    res.json({ message: 'Produto excluído com sucesso!' });
  });
});

// ---------------- SERVIR HTML ----------------

// Servir todos os arquivos estáticos (HTML, CSS, JS)
app.use(express.static(__dirname));

// Rota padrão "/" → login.html
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'login', 'login.html'));
});

// Inicializa servidor
app.listen(3000, () => console.log('Servidor rodando na porta 3000'));
