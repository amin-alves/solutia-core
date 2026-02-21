// clientes.js
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
            { nome: "Financeiro", arquivos: ["Relatório Mensal", "Fluxo de Caixa"] },
            { nome: "RH", arquivos: ["Folha de Pagamento", "Contratos"] }
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
            { nome: "Processos", arquivos: ["Processo 0001", "Processo 0002"] },
            { nome: "Despachos", arquivos: ["Despacho Interno", "Despacho Externo"] }
        ]
    }

};