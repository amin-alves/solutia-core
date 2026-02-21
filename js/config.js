const CONFIG_CLIENTES = {

    cliente1: {
        nome: "Empresa Alpha",

        tema: {
            corPrimaria: "#1f2d3d",
            corSecundaria: "#16222f",
            larguraSidebar: "250px",
            alturaBI: 2,
            alturaWorkflow: 1
        },

        pastas: [
            {
                nome: "Financeiro",
                arquivos: [
                    { nome: "Relatório Mensal", tipo: "relatorio" },
                    { nome: "Fluxo de Caixa", tipo: "planilha" }
                ]
            },
            {
                nome: "RH",
                arquivos: [
                    { nome: "Folha de Pagamento", tipo: "planilha" },
                    { nome: "Contratos", tipo: "documento" }
                ]
            }
        ]
    },


    cliente2: {
        nome: "Tribunal Beta",

        tema: {
            corPrimaria: "#37225f",
            corSecundaria: "#2a1747",
            larguraSidebar: "250px",
            alturaBI: 2,
            alturaWorkflow: 1
        },

        pastas: [
            {
                nome: "Processos",
                arquivos: [
                    { nome: "Processo 0001", tipo: "processo" },
                    { nome: "Processo 0002", tipo: "processo" }
                ]
            },
            {
                nome: "Despachos",
                arquivos: [
                    { nome: "Despacho Interno", tipo: "documento" },
                    { nome: "Despacho Externo", tipo: "documento" }
                ]
            }
        ]
    }

};