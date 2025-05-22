import { obterIdeb, obterProjecoesIdeb, obterAprovacoesIdeb } from "./api/endpoints/ideb.js";
import { obterDadosEnem } from "./api/endpoints/enem.js";

// Mapeamento de IDs dos estados para nomes
const ESTADOS = {
    11: "Rondônia",
    12: "Acre",
    13: "Amazonas",
    14: "Roraima",
    15: "Pará",
    16: "Amapá",
    17: "Tocantins",
    21: "Maranhão",
    22: "Piauí",
    23: "Ceará",
    24: "Rio Grande do Norte",
    25: "Paraíba",
    26: "Pernambuco",
    27: "Alagoas",
    28: "Sergipe",
    29: "Bahia",
    31: "Minas Gerais",
    32: "Espírito Santo",
    33: "Rio de Janeiro",
    35: "São Paulo",
    41: "Paraná",
    42: "Santa Catarina",
    43: "Rio Grande do Sul",
    50: "Mato Grosso do Sul",
    51: "Mato Grosso",
    52: "Goiás",
    53: "Distrito Federal"
};

// Mapeamento de IDs dos estados para nomes das capitais
const NOMES_CAPITAIS = {
    11: "Porto Velho",
    12: "Rio Branco",
    13: "Manaus",
    14: "Boa Vista",
    15: "Belém",
    16: "Macapá",
    17: "Palmas",
    21: "São Luís",
    22: "Teresina",
    23: "Fortaleza",
    24: "Natal",
    25: "João Pessoa",
    26: "Recife",
    27: "Maceió",
    28: "Aracaju",
    29: "Salvador",
    31: "Belo Horizonte",
    32: "Vitória",
    33: "Rio de Janeiro",
    35: "São Paulo",
    41: "Curitiba",
    42: "Florianópolis",
    43: "Porto Alegre",
    50: "Campo Grande",
    51: "Cuiabá",
    52: "Goiânia",
    53: "Brasília"
};

// Função para limpar os campos
function limparCampos() {
    document.getElementById("ideb_em").textContent = "...";
    document.getElementById("projecoes").textContent = "...";
    document.getElementById("aprovacoes").textContent = "...";
    document.getElementById("media_enem").textContent = "...";
    document.getElementById("media_linguagens").textContent = "...";
    document.getElementById("media_matematica").textContent = "...";
    document.getElementById("media_redacao").textContent = "...";
    document.getElementById("nome_capital").textContent = "...";
    document.getElementById("nome_estado_enem").textContent = "...";
}

// Função para atualizar os dados do estado
async function atualizarDadosEstado(ibgeId) {
    try {
        // Limpa os campos antes de começar o carregamento
        limparCampos();

        // Atualiza os nomes da capital e do estado
        document.getElementById("nome_capital").textContent = NOMES_CAPITAIS[ibgeId] || "...";
        document.getElementById("nome_estado_enem").textContent = ESTADOS[ibgeId] || "...";

        // Busca o IDEB
        const response = await obterIdeb(2019, ibgeId);
        const dadosIdeb = response.data;

        // Encontra o IDEB estadual do Ensino Médio
        const idebEstadualEM = dadosIdeb.find(item => 
            item.dependencia_id === 2 && // dependência estadual
            item.ciclo_id === "EM" // Ensino Médio
        );

        // Atualiza o elemento HTML com o valor do IDEB formatado com 2 casas decimais
        if (idebEstadualEM) {
            const elementoIdeb = document.getElementById("ideb_em");
            const valorFormatado = Number(idebEstadualEM.ideb).toFixed(2);
            elementoIdeb.textContent = valorFormatado;
        }

        // Busca e exibe as projeções do IDEB
        const responseProjecoes = await obterProjecoesIdeb(ibgeId, 2);

        // Encontra a projeção do EM para 2021
        if (responseProjecoes && responseProjecoes.data) {
            const projecaoEM = responseProjecoes.data.find(item => 
                item.ciclo_id === "EM" && // Ensino Médio
                item.dependencia_id === 2 && // dependência estadual
                item.ano === 2021 // Ano específico
            );

            // Atualiza o elemento HTML com o valor da projeção formatado com 2 casas decimais
            if (projecaoEM) {
                const elementoProjecao = document.getElementById("projecoes");
                const valorFormatado = Number(projecaoEM.projecao).toFixed(2);
                elementoProjecao.textContent = valorFormatado;
            }
        }

        // Busca e exibe as aprovações do IDEB
        const responseAprovacoes = await obterAprovacoesIdeb(ibgeId, 2, 2019);

        // Encontra a aprovação total do EM em 2019
        if (responseAprovacoes && responseAprovacoes.data) {
            const aprovacaoEM = responseAprovacoes.data.find(item => 
                item.ciclo_id === "EM" && // Ensino Médio
                item.ano === 2019 && // Ano específico
                item.serie === "Total" // Pega o total do EM
            );

            // Atualiza o elemento HTML com o valor da aprovação formatado com 0 casas decimais
            if (aprovacaoEM) {
                const elementoAprovacao = document.getElementById("aprovacoes");
                const valorFormatado = Math.round(Number(aprovacaoEM.taxa_aprovacao)) + "%";
                elementoAprovacao.textContent = valorFormatado;
            }
        }

        // Busca e exibe os dados do ENEM
        const responseEnem = await obterDadosEnem(ibgeId, 2019);

        // Atualiza os elementos HTML com os dados do ENEM
        if (responseEnem && responseEnem.data && responseEnem.data[0]) {
            const dados = responseEnem.data[0];
            
            // Atualiza cada métrica arredondando para números inteiros
            document.getElementById("media_enem").textContent = Math.round(dados.media_geral);
            document.getElementById("media_linguagens").textContent = Math.round(dados.media_linguagens);
            document.getElementById("media_matematica").textContent = Math.round(dados.media_matematica);
            document.getElementById("media_redacao").textContent = Math.round(dados.media_redacao);
        } else {
            // Caso não tenha dados, exibe N/A em todos os campos
            document.getElementById("media_enem").textContent = "N/A";
            document.getElementById("media_linguagens").textContent = "N/A";
            document.getElementById("media_matematica").textContent = "N/A";
            document.getElementById("media_redacao").textContent = "N/A";
        }

    } catch (erro) {
        console.error('Erro ao atualizar dados:', erro);
        // Em caso de erro, mantém os campos com reticências
        limparCampos();
    }
}

// Função para resetar os títulos para o estado inicial
function resetarTitulos() {
    const tituloPrincipal = document.getElementById('titulo_principal');
    const subtituloDashboard = document.getElementById('subtitulo_dashboard');
    
    tituloPrincipal.textContent = 'ÍNDICES DA EDUCAÇÃO BRASILEIRA (2019)';
    subtituloDashboard.textContent = 'Principais estatísticas da educação básica: Estaduais - Brasil';
}

// Carrega os dados iniciais para Maranhão (ID 21)
window.addEventListener('DOMContentLoaded', () => {
    resetarTitulos();
    atualizarDadosEstado(21);
});

// Exporta as funções para serem usadas pelo highcharts.js
window.atualizarDadosEstado = atualizarDadosEstado;
window.resetarTitulos = resetarTitulos;