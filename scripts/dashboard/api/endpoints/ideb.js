import api from '../axios.js';

export async function obterIdeb(ano = 2019, id) {
    return api.get('/ideb', {
        params: {ano: ano, id: id}
    }).then(response => {
        return response.data;
    });
}

export async function obterProjecoesIdeb(id, dependencia_id) {
    return api.get('/ideb/projecoes', {
        params: {
            id: id,
            dependencia_id: dependencia_id
        }
    }).then(response => {
        return response.data;
    });
}

export async function obterAprovacoesIdeb(id, dependencia_id, ano = 2019) {
    return api.get('/ideb/aprovacoes', {
        params: {
            id: id,
            dependencia_id: dependencia_id,
            ano: ano
        }
    }).then(response => {
        ('Resposta completa:', response.data);
        return response.data;
    });
}
