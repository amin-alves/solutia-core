// ==============================
// IDENTIFICAR CLIENTE PELO DOMÍNIO OU QUERY STRING
// ==============================
function obterSubdominio() {
    // 1. (PRIORIDADE) Tenta ler cliente da URL de forma robusta, ignorando codificações como %3D
    const urlCompleta = decodeURIComponent(window.location.href).toLowerCase();
    let clienteEncontrado = null;

    if (urlCompleta.includes("agersinop")) clienteEncontrado = "agersinop";
    if (urlCompleta.includes("stoantleste")) clienteEncontrado = "stoantleste";

    if (clienteEncontrado) {
        return clienteEncontrado;
    }

    // 2. Tenta identificar pelo domínio atual do navegador
    const hostnameAtual = window.location.hostname;
    if (typeof MAPA_DOMINIOS !== 'undefined') {
        const clienteMapeado = MAPA_DOMINIOS[hostnameAtual];
        if (clienteMapeado) {
            return clienteMapeado;
        }
    }

    // 3. Se não houver URL nem domínio mapeado, tenta pegar da sessão
    const sessaoString = sessionStorage.getItem("sessaoSolutia");
    if (sessaoString) {
        const sessao = JSON.parse(sessaoString);
        return sessao.cliente; // Assume o cliente da sessão
    }

    // 4. Fallback padrão
    return "agersinop";
}

const clienteAtualSubdominio = obterSubdominio();


// ==============================
// VALIDAÇÃO DE SESSÃO
// ==============================
function validarSessao() {
    const sessaoString = sessionStorage.getItem("sessaoSolutia");

    if (!sessaoString || !clienteAtualSubdominio) {
        window.location.href = `index.html?cliente=${clienteAtualSubdominio || "agersinop"}`;
        return null;
    }

    const sessao = JSON.parse(sessaoString);

    // Bloqueia troca manual de cliente
    if (sessao.cliente !== clienteAtualSubdominio) {
        sessionStorage.clear();
        window.location.href = `index.html?cliente=${clienteAtualSubdominio || "agersinop"}`;
        return null;
    }

    return sessao;
}

const sessao = validarSessao();


// ==============================
// SISTEMA DE LOGS (Mock Supabase via LocalStorage)
// ==============================
function registrarLog(acao, detalhes = {}) {
    if (!sessao) return;

    const logs = JSON.parse(localStorage.getItem('solutiaLogs')) || [];
    logs.push({
        data: new Date().toISOString(),
        acao: acao,
        usuario: sessao.email,
        nivel: sessao.nivel,
        cliente: sessao.cliente,
        detalhes: detalhes
    });
    localStorage.setItem('solutiaLogs', JSON.stringify(logs));
    console.log(`[Log Registrado] ${acao}`);
}


// ==============================
// CARREGAMENTO DO DASHBOARD
// ==============================
document.addEventListener("DOMContentLoaded", () => {

    if (!sessao) return;

    registrarLog('ACESSO_DASHBOARD', { mensagem: 'Logou no painel inicial.' });

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

    // Mostra o nome e nível do usuário
    const usuarioEl = document.getElementById("usuarioEmail");
    if (usuarioEl) {
        // Exibe Nome (Nível) em vez de apenas o email. Se não tiver nome, usa email.
        usuarioEl.innerText = `${sessao.nome || sessao.email} (${sessao.nivel})`;
    }

    // Verifica permissões do nível de acesso
    aplicarControleDeAcesso();

    // Monta a estrutura de pastas
    if (config.pastas) montarEstruturaPastas(config.pastas);

    // Botão de logout
    const btnLogout = document.getElementById("btnLogout");
    if (btnLogout) {
        btnLogout.addEventListener("click", () => {
            registrarLog('LOGOUT', { mensagem: 'Usuário encerrou sessão.' });
            sessionStorage.removeItem("sessaoSolutia");
            window.location.href = `index.html?cliente=${clienteAtualSubdominio}`;
        });
    }
});


// ==============================
// CONTROLE DE ACESSO (NÍVEIS)
// ==============================
function aplicarControleDeAcesso() {
    // Admin: Acesso total
    // Editor: Pode ler e alterar, mas não excluir e nem acessar configs
    // Leitor: Somente leitura (read-only)

    const nivel = sessao.nivel;

    console.log(`Aplicando permissões para nível: ${nivel}`);

    // Exemplo: Esconder um botão de "Configurações" se não for admin
    // const btnConfig = document.getElementById('btnConfiguracoes');
    // if (btnConfig && nivel !== 'admin') btnConfig.style.display = 'none';

    // Exemplo: Bloquear "Edição de Workflow" para leitores
    // if (nivel === 'leitor') { ... }
}


// ==============================
// MONTAR ESTRUTURA DE PASTAS (Smart Folders + Preview)
// ==============================
function montarEstruturaPastas(pastas) {
    const ul = document.getElementById("estruturaPastas");
    if (!ul) return;

    ul.innerHTML = "";

    pastas.forEach(pasta => {
        // Pasta principal
        const liPasta = document.createElement("li");
        liPasta.innerText = `📁 ${pasta.nome}`;
        liPasta.style.fontWeight = "bold";
        liPasta.style.marginTop = "15px";
        liPasta.style.listStyle = "none";
        ul.appendChild(liPasta);

        // Arquivos dentro da pasta
        if (pasta.arquivos && pasta.arquivos.length > 0) {
            pasta.arquivos.forEach(arquivo => {
                const liArquivo = document.createElement("li");

                // Escolhe um ícone visual baseado no tipo do arquivo
                const icones = {
                    'pdf': '📄', 'docx': '📝', 'xlsx': '📊',
                    'img': '🖼️', 'gis': '🗺️', 'dwg': '📐'
                };
                const icone = icones[arquivo.tipo] || '📄';

                liArquivo.innerText = `   ${icone} ${arquivo.nome} (${arquivo.tipo.toUpperCase()})`;
                liArquivo.style.paddingLeft = "20px";
                liArquivo.style.paddingTop = "5px";
                liArquivo.style.fontSize = "14px";
                liArquivo.style.cursor = "pointer";
                liArquivo.style.listStyle = "none";

                liArquivo.addEventListener("click", () => {
                    const preview = document.getElementById("previewArquivo");
                    if (!preview) return;

                    // Loga a visualização daquele arquivo
                    registrarLog('VISUALIZOU_ARQUIVO', { arquivo: arquivo.nome, tipo: arquivo.tipo });

                    // Monta o visualizador apropriado de acordo com o tipo
                    let iframeSrc = "";
                    let htmlPreview = "";

                    switch (arquivo.tipo) {
                        case 'pdf':
                        case 'img':
                            // Renderiza nativamente no navegador
                            iframeSrc = arquivo.url;
                            htmlPreview = `<iframe src="${iframeSrc}" width="100%" height="100%" style="border:none;"></iframe>`;
                            break;

                        case 'docx':
                        case 'xlsx':
                        case 'pptx':
                            // Usa o Microsoft Office Web Viewer (requer URL pública acessível)
                            iframeSrc = `https://view.officeapps.live.com/op/embed.aspx?src=${encodeURIComponent(arquivo.url)}`;
                            htmlPreview = `<iframe src="${iframeSrc}" width="100%" height="100%" style="border:none;"></iframe>`;
                            break;

                        case 'gis':
                        case 'dwg':
                            // Exemplo de Placeholder até definirmos a API 3D (ex: Autodesk Forge / Leaflet JS)
                            htmlPreview = `
                                <div style="display:flex; flex-direction:column; align-items:center; justify-content:center; height:100%; text-align:center;">
                                    <h1>${icone}</h1>
                                    <h3>Visualizador ${arquivo.tipo.toUpperCase()} em Integração</h3>
                                    <p>O arquivo <b>${arquivo.nome}</b> requer um plugin carregado na nuvem.</p>
                                    <a href="${arquivo.url}" target="_blank" style="padding:10px 20px; background:${sessao.tema?.corPrimaria || '#333'}; color:white; text-decoration:none; border-radius:5px;">Fazer Download</a>
                                </div>`;
                            break;

                        default:
                            htmlPreview = `<p>Formato não suportado para visualização.</p>`;
                    }

                    preview.innerHTML = htmlPreview;
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