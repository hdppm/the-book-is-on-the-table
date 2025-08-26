const form = document.getElementById('loginForm');

form.addEventListener('submit', function(e) {
    e.preventDefault();

    const username = document.getElementById('username').value.trim();
    const password = document.getElementById('password').value.trim();

    if(username === "" || password === "") {
        alert("Por favor, preencha todos os campos!");
        return;
    }
    alert(`Bem-vindo, ${username}!`);
    form.reset();
});
const botao = document.getElementById("botaoTema");
const body = document.body;

if (localStorage.getItem("tema") === "escuro") {
    body.classList.add("tema-escuro");
}

botao.addEventListener("click", () => {
    body.classList.toggle("tema-escuro");
    if (body.classList.contains("tema-escuro")) {
        localStorage.setItem("tema", "escuro");
    } else {
        localStorage.setItem("tema", "claro");
    }
});