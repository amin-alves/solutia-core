// login.js
document.addEventListener("DOMContentLoaded", () => {

    // ==============================
    // CONFIGURAÇÃO DE USUÁRIOS (Migrado para Supabase)
    // ==============================

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
    // IDENTIFICAR CLIENTE PELO DOMÍNIO OU QUERY STRING
    // ==============================
    function obterSubdominio() {
        const urlRaw = window.location.search || window.location.href; // Busca forçada na Query String

        // Remove codificações e pega só os caracteres alfanuméricos
        const urlLimpa = decodeURIComponent(urlRaw).toLowerCase().replace(/[^a-z0-9]/g, '');

        if (urlLimpa.includes("stoantleste")) return "stoantleste";
        if (urlLimpa.includes("agersinop")) return "agersinop";

        // Fallback apenas de Hostname
        const hostnameAtual = window.location.hostname;
        if (typeof MAPA_DOMINIOS !== 'undefined') {
            const clienteMapeado = MAPA_DOMINIOS[hostnameAtual];
            if (clienteMapeado) return clienteMapeado;
        }

        return "agersinop"; // fallback absoluto
    }

    const subdominio = obterSubdominio();

    // ==============================
    // APLICAR IDENTIDADE VISUAL IMEDIATAMENTE VIA SUPABASE
    // ==============================
    async function inicializarVisualStore() {
        const clienteAtual = await carregarConfigCliente(subdominio);

        if (!clienteAtual) {
            console.warn("Cliente não encontrado na API ou não configurado.");
            return;
        }

        const nomeClienteEl = document.getElementById("nomeCliente");
        if (nomeClienteEl) {
            nomeClienteEl.innerText = clienteAtual.nome;
        }

        const logoEl = document.getElementById("logoCliente");
        if (logoEl && clienteAtual.logo) {
            // Garantir que a imagem atualize e apareça
            logoEl.src = clienteAtual.logo;
            logoEl.style.display = "block";
        }

        if (clienteAtual.corPrimaria) {
            document.body.style.backgroundColor = clienteAtual.corPrimaria;

            // Se houver um container de login, podemos dar um toque da cor secundária nele ou bordas
            const loginContainer = document.querySelector('.login-container');
            if (loginContainer && clienteAtual.corSecundaria) {
                loginContainer.style.borderTop = `5px solid ${clienteAtual.corSecundaria}`;
            }
        }

        document.title = `${clienteAtual.nome} - Login`;
    }

    // Aciona a renderização visual isoladamente sem bloquear a lógica principal
    inicializarVisualStore();

    // ==============================
    // LOGIN
    // ==============================
    const form = document.getElementById("loginForm");
    form.addEventListener("submit", async function (e) {
        e.preventDefault();

        const email = document.getElementById("email").value.trim();
        const senha = document.getElementById("senha").value.trim();
        const msgErro = document.getElementById("msgErro");

        if (!email || !senha) {
            msgErro.innerText = "Preencha todos os campos.";
            return;
        }

        msgErro.innerText = "Autenticando no servidor...";
        msgErro.style.color = "#333";

        try {
            // 1. Tenta logar via Supabase Auth
            const { data: authData, error: authError } = await db.auth.signInWithPassword({
                email: email,
                password: senha
            });

            if (authError || !authData.user) {
                msgErro.style.color = "red";
                msgErro.innerText = "Usuário ou senha incorretos.";
                console.error("Auth ERROR:", authError);
                return;
            }

            // 2. Busca o perfil do usuário logado na tabela 'perfis' para descobrir seu cliente
            const userId = authData.user.id;
            const { data: perfilData, error: perfilError } = await db
                .from('perfis')
                .select('nome, nivel_acesso, clientes(slug)')
                .eq('id', userId)
                .single();

            if (perfilError || !perfilData) {
                msgErro.style.color = "red";
                msgErro.innerText = "Erro ao carregar perfil de acesso.";
                await db.auth.signOut();
                return;
            }

            // 3. Verifica se o usuário pertence à URL (Subdomínio/Tenant) atual
            const clienteSlug = perfilData.clientes ? perfilData.clientes.slug : null;
            if (clienteSlug !== subdominio) {
                msgErro.style.color = "red";
                msgErro.innerText = "Acesso Negado: Você não pertence a esta empresa.";
                await db.auth.signOut();
                return;
            }

            // 4. Salvar sessão localmente (Retrocompatibilidade com Dashboard Atual)
            const sessao = {
                email: authData.user.email,
                nome: perfilData.nome || authData.user.email,
                nivel: perfilData.nivel_acesso || 'leitor',
                cliente: subdominio,
                loginEm: Date.now()
            };
            sessionStorage.setItem("sessaoSolutia", JSON.stringify(sessao));

            // Registro de Log Local Mock (A ser convertido para o banco em breve)
            registrarLog('LOGIN_SUPABASE', authData.user.email, subdominio, {
                mensagem: 'Usuário iniciou sessão via Supabase Auth com sucesso.'
            });

            // Sucesso! Continua para o Dashboard
            msgErro.style.color = "green";
            msgErro.innerText = "Acesso liberado. Redirecionando...";
            window.location.href = `dashboard.html?cliente=${subdominio}`;

        } catch (err) {
            console.error("Critical Engine Auth Error:", err);
            msgErro.style.color = "red";
            msgErro.innerText = "Erro interno no servidor de autenticação.";
        }
    });

});