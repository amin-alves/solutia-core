// ==============================
// IDENTIFICAR CLIENTE PELO "SUBDOMÍNIO" SIMULADO OU URL
// ==============================
function obterSubdominio() {
    // Lê cliente da URL: ?cliente=cliente1
    const params = new URLSearchParams(window.location.search);
    const clienteURL = params.get("cliente");
    if (clienteURL) return clienteURL;

    // Se não houver URL, tenta pegar da sessão
    const sessaoString = sessionStorage.getItem("sessaoSolutia");
    if (sessaoString) {
        const sessao = JSON.parse(sessaoString);
        return sessao.cliente;
    }

    // fallback padrão
    return "cliente1";
}

const clienteAtualSubdominio = obterSubdominio();


// ==============================
// VALIDAÇÃO DE SESSÃO
// ==============================
function validarSessao() {
    const sessaoString = sessionStorage.getItem("sessaoSolutia");

    if (!sessaoString || !clienteAtualSubdominio) {
        window.location.href = "index.html";
        return null;
    }

    const sessao = JSON.parse(sessaoString);

    // Bloqueia troca manual de cliente
    if (sessao.cliente !== clienteAtualSubdominio) {
        sessionStorage.clear();
        window.location.href = "index.html";
        return null;
    }

    return sessao;
}

const sessao = validarSessao();


// ==============================
// CARREGAMENTO DO DASHBOARD
// ==============================
document.addEventListener("DOMContentLoaded", () => {

    if (!sessao) return;

    const config = CONFIG_CLIENTES[clienteAtualSubdominio];

    if (!config) {
        alert("Cliente não configurado.");
        sessionStorage.clear();
        window.location.href = "index.html";
        return;
    }

    // Aplica tema do cliente
    aplicarTema(config.tema);

    // Mostra nome do cliente no topo
    const nomeClienteEl = document.getElementById("nomeCliente");
    if (nomeClienteEl) nomeClienteEl.innerText = config.nome;

    // Mostra email do usuário
    const usuarioEl = document.getElementById("usuarioEmail");
    if (usuarioEl) usuarioEl.innerText = sessao.email;

    // Monta a estrutura de pastas
    if (config.pastas) montarEstruturaPastas(config.pastas);

    // Botão de logout
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            sessionStorage.removeItem("sessaoSolutia");
            window.location.href = "index.html";
        });
    }
});


// ==============================
// MONTAR ESTRUTURA DE PASTAS
// ==============================
function montarEstruturaPastas(pastas) {
    const ul = document.getElementById("estruturaPastas");
    if (!ul) return;

    ul.innerHTML = "";

    pastas.forEach(pasta => {
        // Pasta principal
        const liPasta = document.createElement("li");
        liPasta.innerText = pasta.nome;
        liPasta.style.fontWeight = "bold";
        liPasta.style.marginTop = "10px";
        ul.appendChild(liPasta);

        // Arquivos dentro da pasta
        if (pasta.arquivos && pasta.arquivos.length > 0) {
            pasta.arquivos.forEach(arquivo => {
                const liArquivo = document.createElement("li");
                liArquivo.innerText = "— " + arquivo;
                liArquivo.style.paddingLeft = "15px";
                liArquivo.style.fontSize = "14px";
                liArquivo.style.cursor = "pointer";

                liArquivo.addEventListener("click", () => {
                    const preview = document.getElementById("previewArquivo");
                    if (preview) preview.innerText = "Visualizando: " + arquivo;
                });

                ul.appendChild(liArquivo);
            });
        }
    });
}


// ==============================
// APLICAR TEMA DINÂMICO
// ==============================
function aplicarTema(tema) {
    const sidebar = document.getElementById("sidebar");
    const biArea = document.getElementById("biArea");
    const workflowArea = document.getElementById("workflowArea");

    if (!sidebar) return;

    sidebar.style.backgroundColor = tema.corPrimaria;

    const logoArea = sidebar.querySelector(".logo-area");
    if (logoArea) logoArea.style.backgroundColor = tema.corSecundaria;

    sidebar.style.width = tema.larguraSidebar;

    if (biArea) biArea.style.flex = tema.alturaBI;
    if (workflowArea) workflowArea.style.flex = tema.alturaWorkflow;
}