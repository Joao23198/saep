document.getElementById('logoutBtn').addEventListener('click', function(e) {
  e.preventDefault();
  alert("Logout realizado com sucesso!");
  window.location.href = "../login/login.html";
});
