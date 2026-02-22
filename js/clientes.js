// clientes.js

// ==============================
// MAPEAMENTO DE DOMÍNIOS
// Permite que o sistema identifique qual cliente carregar
// pela URL do navegador (ex: regulasnp-solutiacore.vercel.app -> cliente1)
// ==============================
const MAPA_DOMINIOS = {
    // Vercel Free Tier (com hífen) / Configurações locais
    "localhost": "cliente1",
    "127.0.0.1": "cliente1",
    "regulasnp-solutiacore.vercel.app": "cliente1",

    // Domínio próprio (aceita ponto antes e depois do subdomínio)
    // "regulasnp.seudominio.com.br": "cliente1",

    // Cliente 2 no Vercel (sem domínio próprio)
    "tribunalbeta-solutiacore.vercel.app": "cliente2"
};

const CONFIG_CLIENTES = {

    cliente1: {
        nome: "Empresa Alpha",
        logo: "assets/logos/cliente1.png", // substitua pela sua logo real
        corPrimaria: "#1f2d3d",
        corSecundaria: "#16222f",
        tema: {
            corPrimaria: "#1f2d3d",
            corSecundaria: "#16222f",
            larguraSidebar: "250px",
            alturaBI: "2",
            alturaWorkflow: "1"
        },
        pastas: [
            {
                nome: "Financeiro",
                arquivos: [
                    { nome: "Relatório Mensal", tipo: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                    { nome: "Fluxo de Caixa", tipo: "xlsx", url: "https://file-examples.com/wp-content/storage/2017/02/file_example_XLSX_10.xlsx" }
                ]
            },
            {
                nome: "Engenharia",
                arquivos: [
                    { nome: "Planta Baixa", tipo: "dwg", url: "#" },
                    { nome: "Mapa Topográfico", tipo: "gis", url: "https://raw.githubusercontent.com/johan/world.geo.json/master/countries/BRA.geo.json" },
                    { nome: "Projeto Estrutural", tipo: "img", url: "https://picsum.photos/800/600" }
                ]
            },
            {
                nome: "Contratos",
                arquivos: [
                    { nome: "Contrato de Prestação", tipo: "docx", url: "https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.docx" }
                ]
            }
        ]
    },

    cliente2: {
        nome: "Tribunal Beta",
        logo: "assets/logos/cliente2.png", // substitua pela sua logo real
        corPrimaria: "#37225f",
        corSecundaria: "#2a1747",
        tema: {
            corPrimaria: "#37225f",
            corSecundaria: "#2a1747",
            larguraSidebar: "250px",
            alturaBI: "2",
            alturaWorkflow: "1"
        },
        pastas: [
            {
                nome: "Processos",
                arquivos: [
                    { nome: "Processo 0001", tipo: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                    { nome: "Processo 0002", tipo: "docx", url: "https://file-examples.com/wp-content/storage/2017/02/file-sample_100kB.docx" }
                ]
            },
            {
                nome: "Despachos",
                arquivos: [
                    { nome: "Despacho Interno", tipo: "pdf", url: "https://www.w3.org/WAI/ER/tests/xhtml/testfiles/resources/pdf/dummy.pdf" },
                    { nome: "Mapa Cartorial", tipo: "img", url: "https://picsum.photos/800/600" }
                ]
            }
        ]
    }

};