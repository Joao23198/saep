const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', async function(e) {
  e.preventDefault();

  const login = document.getElementById('username').value.trim();
  const senha = document.getElementById('password').value.trim();

  // Validações no front-end
  if (!login) {
    errorMsg.textContent = "O campo usuário é obrigatório!";
    return;
  }
  if (!senha) {
    errorMsg.textContent = "O campo senha é obrigatório!";
    return;
  }

  try {
    const response = await fetch("http://localhost:3000/api/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ login, senha })
    });

    const result = await response.json();

    if (result.success) {
      // Salva usuário logado no localStorage para usar na interface principal
      localStorage.setItem("usuarioLogado", JSON.stringify(result.usuario));
      window.location.href = "../principal/principal.html";
    } else {
      errorMsg.textContent = result.message || "Login ou senha inválidos!";
    }
  } catch (error) {
    console.error("Erro na requisição:", error);
    errorMsg.textContent = "Erro de conexão com o servidor.";
  }
});
