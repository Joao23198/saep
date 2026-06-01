const form = document.getElementById('loginForm');
const errorMsg = document.getElementById('errorMsg');

form.addEventListener('submit', function(e) {
  e.preventDefault();
  const user = document.getElementById('username').value;
  const pass = document.getElementById('password').value;

  if(user === "admin" && pass === "1234") {
    window.location.href = "../principal/principal.html"; // caminho relativo
  } else {
    errorMsg.textContent = "Login ou senha inválidos!";
  }
});
