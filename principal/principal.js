// Verifica se há usuário logado
const usuario = JSON.parse(localStorage.getItem("usuarioLogado"));
const userNameSpan = document.getElementById("userName");
const logoutBtn = document.getElementById("logoutBtn");

if (!usuario) {
  // Se não houver usuário logado, redireciona para login
  alert("Você precisa estar logado para acessar esta página!");
  window.location.href = "../login/login.html";
} else {
  // Exibe nome do usuário logado
  userNameSpan.textContent = usuario.nome;
}

// Logout com validação
logoutBtn.addEventListener("click", () => {
  if (confirm("Deseja realmente sair?")) {
    localStorage.removeItem("usuarioLogado");
    window.location.href = "../login/login.html";
  }
});
