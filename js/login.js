// login.js
document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // CONFIGURAÇÃO DE USUÁRIOS
    // ==============================
    const usuarios = [
        { email: "cliente1@teste.com", senha: "123", cliente: "cliente1" },
        { email: "cliente2@teste.com", senha: "123", cliente: "cliente2" }
    ];

    // ==============================
    // IDENTIFICAR CLIENTE PELO SUBDOMÍNIO SIMULADO
    // ==============================
    function obterSubdominio() {
        const params = new URLSearchParams(window.location.search);
        const clienteURL = params.get("cliente");
        return clienteURL || "cliente1"; // fallback para cliente padrão
    }

    const subdominio = obterSubdominio();

    // ==============================
    // VALIDAR CONFIG DO CLIENTE
    // ==============================
    const clienteAtual = clientesConfig[subdominio] || clientesConfig["cliente1"];
    if (!clienteAtual) {
        alert("Cliente não configurado.");
        return;
    }

    // ==============================
    // APLICAR IDENTIDADE VISUAL
    // ==============================
    const nomeClienteEl = document.getElementById("nomeCliente");
    if (nomeClienteEl) nomeClienteEl.innerText = clienteAtual.nome;

    const logoEl = document.getElementById("logoCliente");
    if (logoEl && clienteAtual.logo) logoEl.src = clienteAtual.logo;

    if (clienteAtual.corPrimaria) document.body.style.backgroundColor = clienteAtual.corPrimaria;

    document.title = `${clienteAtual.nome} - Login`;

    // ==============================
    // LOGIN
    // ==============================
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();

        if (!email || !senha) {
            document.getElementById("msgErro").innerText = "Preencha todos os campos.";
            return;
        }

        // 🔒 Validação segura: encontra usuário
        const usuarioValido = usuarios.find(u => u.email === email && u.senha === senha);

        if (!usuarioValido) {
            document.getElementById("msgErro").innerText = "Usuário ou senha incorretos";
            return;
        }

        // 🔐 Salvar sessão
        const sessao = {
            email: usuarioValido.email,
            cliente: usuarioValido.cliente,
            loginEm: Date.now()
        };
        sessionStorage.setItem("sessaoSolutia", JSON.stringify(sessao));

        // Redirecionar para dashboard do cliente
        window.location.href = `dashboard.html?cliente=${usuarioValido.cliente}`;
    });

});