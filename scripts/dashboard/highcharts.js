// Aguarda o DOM estar completamente carregado
document.addEventListener('DOMContentLoaded', () => {
    Highcharts.mapChart('container', {
        chart: {
            map: 'countries/br/br-all', // Mapa do Brasil completo
            backgroundColor: '#B5D291', // Cor de fundo personalizada (verde claro)
        },

        title: {
            text: null // Remover título
        },

        tooltip: {
            headerFormat: '',
            pointFormat: '<b>{point.name}</b><br>IBGE: {point.ibgeId}' // Exibe o nome do estado e o ID do IBGE
        },

        mapNavigation: {
            enabled: true,
            buttonOptions: {
                verticalAlign: 'bottom'
            }
        },

        series: [{
            data: [
                { "hc-key": "br-ac", value: 5.8, ibgeId: 12 },
                { "hc-key": "br-al", value: 4.9, ibgeId: 27 },
                { "hc-key": "br-am", value: 5.4, ibgeId: 13 },
                { "hc-key": "br-ap", value: 6.2, ibgeId: 16 },
                { "hc-key": "br-ba", value: 5.7, ibgeId: 29 },
                { "hc-key": "br-ce", value: 5.1, ibgeId: 23 },
                { "hc-key": "br-df", value: 6.5, ibgeId: 53 },
                { "hc-key": "br-es", value: 5.6, ibgeId: 32 },
                { "hc-key": "br-go", value: 5.3, ibgeId: 52 },
                { "hc-key": "br-ma", value: 4.8, ibgeId: 21 },
                { "hc-key": "br-mt", value: 5.2, ibgeId: 51 },
                { "hc-key": "br-ms", value: 5.0, ibgeId: 50 },
                { "hc-key": "br-mg", value: 6.1, ibgeId: 31 },
                { "hc-key": "br-pa", value: 5.0, ibgeId: 15 },
                { "hc-key": "br-pb", value: 5.4, ibgeId: 25 },
                { "hc-key": "br-pr", value: 6.0, ibgeId: 41 },
                { "hc-key": "br-pe", value: 5.2, ibgeId: 26 },
                { "hc-key": "br-pi", value: 5.0, ibgeId: 22 },
                { "hc-key": "br-rj", value: 6.3, ibgeId: 33 },
                { "hc-key": "br-rn", value: 5.5, ibgeId: 24 },
                { "hc-key": "br-ro", value: 5.3, ibgeId: 11 },
                { "hc-key": "br-rr", value: 5.4, ibgeId: 14 },
                { "hc-key": "br-rs", value: 6.2, ibgeId: 43 },
                { "hc-key": "br-sc", value: 6.4, ibgeId: 42 },
                { "hc-key": "br-se", value: 5.6, ibgeId: 28 },
                { "hc-key": "br-sp", value: 6.8, ibgeId: 35 },
                { "hc-key": "br-to", value: 5.1, ibgeId: 17 }
            ], // Dados fictícios com IBGE real
            mapData: Highcharts.maps['countries/br/br-all'], // Usando o mapa carregado
            joinBy: 'hc-key', // Associando os dados pela chave
            name: 'Estados do Brasil',
            states: {
                hover: {
                    color: '#a4edba'
                }
            },

            // Captura o evento de clique em um estado
            point: {
                events: {
                    mouseOver: function() {
                        // Aplica uma cor ao passar o mouse sobre o estado
                        this.graphic.attr({
                            fill: '#a4edba' // Alteração de cor no hover
                        });
                    },
                    click: function () {
                        // Captura o ID do IBGE após o clique
                        const ibgeId = this.ibgeId;
                        const estadoNome = this.name;
                        
                        // Atualiza os títulos
                        const tituloPrincipal = document.getElementById('titulo_principal');
                        const subtituloDashboard = document.getElementById('subtitulo_dashboard');
                        
                        tituloPrincipal.textContent = `ÍNDICES DA EDUCAÇÃO BRASILEIRA (2019) - ${estadoNome}`;
                        subtituloDashboard.textContent = `Principais estatísticas da educação básica: Estaduais - ${estadoNome}`;
                        
                        // Verifica se a função está disponível antes de chamar
                        if (typeof window.atualizarDadosEstado === 'function') {
                            window.atualizarDadosEstado(ibgeId);
                        } else {
                            console.error('Função atualizarDadosEstado não está disponível');
                        }
                    }
                }
            }
        }]
    });
});