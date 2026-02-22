// login.js
document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // CONFIGURAÇÃO DE USUÁRIOS (Simulando Banco de Dados)
    // Níveis: admin, editor, leitor
    // ==============================
    const usuarios = [
        // Cliente 1
        { email: "gestor@cliente1.com", senha: "123", cliente: "cliente1", nivel: "admin", nome: "Gestor Alpha" },
        { email: "gerente@cliente1.com", senha: "123", cliente: "cliente1", nivel: "admin", nome: "Gerente Operacional" },
        { email: "operaca1@cliente1.com", senha: "123", cliente: "cliente1", nivel: "editor", nome: "Operador A" },
        { email: "operaca2@cliente1.com", senha: "123", cliente: "cliente1", nivel: "editor", nome: "Operador B" },
        { email: "consulta@cliente1.com", senha: "123", cliente: "cliente1", nivel: "leitor", nome: "Consultor Externo" },
        { email: "publico@cliente1.com", senha: "123", cliente: "cliente1", nivel: "leitor", nome: "Cliente Final" },

        // Cliente 2
        { email: "cliente2@teste.com", senha: "123", cliente: "cliente2", nivel: "admin", nome: "Admin Beta" }
    ];

    // ==============================
    // SISTEMA DE LOGS (Mock Supabase via LocalStorage)
    // ==============================
    function registrarLog(acao, usuario, cliente, detalhes = {}) {
        const logs = JSON.parse(localStorage.getItem('solutiaLogs')) || [];
        logs.push({
            data: new Date().toISOString(),
            acao: acao,
            usuario: usuario,
            cliente: cliente,
            detalhes: detalhes
        });
        localStorage.setItem('solutiaLogs', JSON.stringify(logs));
        console.log(`[Log registrado] ${acao} - ${usuario}`);
    }

    // ==============================
    // IDENTIFICAR CLIENTE PELO PATH DA URL OU DOMÍNIO
    // ==============================
    function obterSubdominio() {
        // 1. Tenta identificar pelo PATH da URL (ex: ami-eng.vercel.app/agersinop)
        const pathSegments = window.location.pathname.split('/').filter(Boolean);
        if (pathSegments.length > 0) {
            const pathInfo = pathSegments[0];
            // Verifica se o path bate com alguma chave do CONFIG_CLIENTES no clientes.js
            if (typeof CONFIG_CLIENTES !== 'undefined' && CONFIG_CLIENTES[pathInfo]) {
                return pathInfo;
            }
        }

        // 2. (PRIORIDADE PARA TESTES) Tenta ler cliente da URL (ex: ?cliente=cliente2)
        const params = new URLSearchParams(window.location.search);
        const clienteURL = params.get("cliente");

        if (clienteURL) {
            return clienteURL;
        }

        // 3. Tenta identificar pelo domínio atual do navegador (Retrocompatibilidade)
        const hostnameAtual = window.location.hostname;
        if (typeof MAPA_DOMINIOS !== 'undefined') {
            const clienteMapeado = MAPA_DOMINIOS[hostnameAtual];
            if (clienteMapeado) {
                return clienteMapeado;
            }
        }

        return "agersinop"; // fallback final para cliente padrão
    }

    const subdominio = obterSubdominio();

    // ==============================
    // VALIDAR CONFIG DO CLIENTE
    // ==============================
    const clienteAtual = CONFIG_CLIENTES[subdominio] || CONFIG_CLIENTES["agersinop"];
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

        // 🔒 Validação segura: encontra usuário e verifica o cliente
        const usuarioValido = usuarios.find(u => u.email === email && u.senha === senha && u.cliente === subdominio);

        if (!usuarioValido) {
            document.getElementById("msgErro").innerText = "Usuário ou senha incorretos";
            return;
        }

        // 🔐 Salvar sessão
        const sessao = {
            email: usuarioValido.email,
            nome: usuarioValido.nome,
            nivel: usuarioValido.nivel,
            cliente: usuarioValido.cliente,
            loginEm: Date.now()
        };
        sessionStorage.setItem("sessaoSolutia", JSON.stringify(sessao));

        // 📝 Registrar o histórico do login no "Banco de Dados"
        registrarLog('LOGIN', usuarioValido.email, usuarioValido.cliente, {
            mensagem: 'Usuário iniciou sessão com sucesso.',
            ip: '127.0.0.1' // Será pego pela API no futuro
        });

        // Redirecionar para dashboard do cliente usando rotas (Vercel)
        window.location.href = `/${usuarioValido.cliente}/dashboard`;
    });

});