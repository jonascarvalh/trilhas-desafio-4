import api from '../axios.js';

// Mapeamento do ID do estado para o ID da capital
const CAPITAIS = {
    11: 1100205, // Porto Velho
    12: 1200401, // Rio Branco
    13: 1302603, // Manaus
    14: 1400100, // Boa Vista
    15: 1501402, // Belém
    16: 1600303, // Macapá
    17: 1721000, // Palmas
    21: 2111300, // São Luís
    22: 2211001, // Teresina
    23: 2304400, // Fortaleza
    24: 2408102, // Natal
    25: 2507507, // João Pessoa
    26: 2611606, // Recife
    27: 2704302, // Maceió
    28: 2800308, // Aracaju
    29: 2927408, // Salvador
    31: 3106200, // Belo Horizonte
    32: 3205309, // Vitória
    33: 3304557, // Rio de Janeiro
    35: 3550308, // São Paulo
    41: 4106902, // Curitiba
    42: 4205407, // Florianópolis
    43: 4314902, // Porto Alegre
    50: 5002704, // Campo Grande
    51: 5103403, // Cuiabá
    52: 5208707, // Goiânia
    53: 5300108  // Brasília
};

// Função para calcular média ponderada
function calcularMediaPonderada(dados, campo) {
    let somaPonderada = 0;
    let totalAlunos = 0;

    dados.forEach(escola => {
        const valor = parseFloat(escola[campo]);
        const alunos = parseInt(escola.alunos);
        
        if (!isNaN(valor) && !isNaN(alunos)) {
            somaPonderada += valor * alunos;
            totalAlunos += alunos;
        }
    });

    return totalAlunos === 0 ? null : (somaPonderada / totalAlunos).toFixed(2);
}

// Função para processar os dados do ENEM
function processarDadosEnem(response) {
    if (!response || !response.data || !Array.isArray(response.data)) return null;

    const dados = response.data;
    if (dados.length === 0) return null;

    // Calcula as médias ponderadas para cada área
    const mediaGeral = calcularMediaPonderada(dados, 'media_geral');
    const mediaLC = calcularMediaPonderada(dados, 'media_LC');
    const mediaMT = calcularMediaPonderada(dados, 'media_MT');
    const mediaCH = calcularMediaPonderada(dados, 'media_CH');
    const mediaCN = calcularMediaPonderada(dados, 'media_CN');
    const mediaRedacao = calcularMediaPonderada(dados, 'media_redacao');

    // Calcula a taxa média de participação
    const taxaParticipacao = calcularMediaPonderada(dados, 'taxa_participacao');

    // Calcula o total de alunos
    const totalAlunos = dados.reduce((soma, escola) => soma + parseInt(escola.alunos || 0), 0);

    return {
        media_geral: mediaGeral || "N/A",
        media_linguagens: mediaLC || "N/A",
        media_matematica: mediaMT || "N/A",
        media_humanas: mediaCH || "N/A",
        media_natureza: mediaCN || "N/A",
        media_redacao: mediaRedacao || "N/A",
        taxa_participacao: taxaParticipacao ? taxaParticipacao + "%" : "N/A",
        total_alunos: totalAlunos || "N/A"
    };
}

export async function obterDadosEnem(idEstado = 21, ano = 2019) {
    try {
        // Obtém o ID da capital correspondente ao estado
        const idCapital = CAPITAIS[idEstado];
        
        if (!idCapital) {
            console.error('ID da capital não encontrado para o estado:', idEstado);
            return null;
        }

        const response = await api.get('/enem', {
            params: {
                id: idCapital,
                ano: ano
            }
        });

        // Processa os dados e retorna o objeto com todas as métricas
        const metricas = processarDadosEnem(response.data);
        return {
            data: [metricas]
        };
    } catch (erro) {
        console.error('Erro ao obter dados do ENEM:', erro);
        return null;
    }
} 