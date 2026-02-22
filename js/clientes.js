// clientes.js

// ==============================
// MAPEAMENTO DE DOMÍNIOS
// Permite que o sistema identifique qual cliente carregar
// pela URL do navegador (ex: regulasnp-solutiacore.vercel.app -> cliente1)
// ==============================
const MAPA_DOMINIOS = {
    // Ambientes Locais
    "localhost": "agersinop",
    "127.0.0.1": "agersinop",

    // Domínio principal no Vercel
    // Se a pessoa entrar direto sem o ?cliente= na URL
    "ami-eng.vercel.app": "agersinop"
};

// ==============================
// BUSCA DINÂMICA DE CLIENTE (Supabase API)
// ==============================
async function carregarConfigCliente(slug) {
    if (!slug) return null;

    try {
        const { data, error } = await db
            .from('clientes')
            .select('*')
            .eq('slug', slug)
            .single();

        if (error || !data) {
            console.error("Erro ao buscar configurações do cliente:", error);
            return null;
        }

        // Mapeia o resultado do banco para o padrão esperado pelo FrontEnd
        return {
            nome: data.nome,
            logo: data.logo_url || "assets/logos/default.png", // Fallback pra garantir renderização
            corPrimaria: data.tema_primario,
            corSecundaria: data.tema_secundario,
            tema: {
                corPrimaria: data.tema_primario,
                corSecundaria: data.tema_secundario,
                larguraSidebar: data.largura_sidebar || "250px",
                alturaBI: data.altura_bi || "60%",
                alturaWorkflow: data.altura_workflow || "40%"
            },
            // TODO: Migrar estrutura de pastas para uma Tabela Relacional futura (pastas/arquivos no Storage)
            // Por enquanto, manteremos mockado na memória apenas para este MVP
            pastas: slug === 'stoantleste' ? [
                {
                    nome: "Processos e Despachos",
                    arquivos: [
                        { nome: "Guia Judicial", tipo: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
                    ]
                }
            ] : [
                {
                    nome: "Engenharia (Padrão)",
                    arquivos: [
                        { nome: "Projeto Demo", tipo: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" }
                    ]
                }
            ]
        };
    } catch (err) {
        console.error("Falha crítica ao obter tenant:", err);
        return null;
    }
}