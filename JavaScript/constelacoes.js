
const constelacoes = {
    orion: {
        nome: "Órion",
        popular: "O Caçador",
        epoca: "Verão",
        estrela: "Betelgeuse",
        descricao: "Órion é uma das constelações mais conhecidas do céu. Suas estrelas formam a figura de um caçador, com destaque para as três estrelas alinhadas do cinturão.",
        curiosidade: "O cinturão de Órion é formado por Alnitak, Alnilam e Mintaka.",
        estrelas: [[250, 50], [180, 150], [320, 150], [220, 200], [280, 200], [180, 300], [320, 300]],
        linhas: [[0,1],[0,2],[1,3],[3,4],[4,2],[3,5],[4,6]]
    },
    ursa: {
        nome: "Ursa Maior",
        popular: "A Grande Ursa",
        epoca: "Primavera",
        estrela: "Alioth",
        descricao: "A Ursa Maior é famosa pelo asterismo conhecido como Grande Carro ou Big Dipper, muito utilizado para localizar outras estrelas.",
        curiosidade: "As estrelas Dubhe e Merak ajudam a encontrar a Estrela Polar.",
        estrelas: [[100,100],[180,80],[250,130],[330,180],[380,260],[280,300],[180,250]],
        linhas: [[0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,0]]
    },
    crux: {
        nome: "Crux",
        popular: "Cruzeiro do Sul",
        epoca: "Outono",
        estrela: "Acrux",
        descricao: "Crux é uma pequena constelação do hemisfério celestial sul. Seu formato de cruz a torna uma referência importante para observadores do hemisfério sul.",
        curiosidade: "O Cruzeiro do Sul aparece na bandeira do Brasil.",
        estrelas: [[250,60],[250,170],[250,320],[120,190],[380,190]],
        linhas: [[0,1],[1,2],[3,1],[1,4]]
    },
    cassiopeia: {
        nome: "Cassiopeia",
        popular: "A Rainha",
        epoca: "Outono",
        estrela: "Schedar",
        descricao: "Cassiopeia é conhecida por seu formato semelhante à letra W ou M, dependendo da posição no céu.",
        curiosidade: "Cassiopeia recebeu o nome de uma rainha da mitologia grega.",
        estrelas: [[80,180],[160,100],[250,200],[340,100],[420,180]],
        linhas: [[0,1],[1,2],[2,3],[3,4]]
    }
};

const botoes = document.querySelectorAll(".cartao-constelacao");
const mapa = document.getElementById("mapa-estrelas");

function desenharConstelacao(chave) {
    const constelacao = constelacoes[chave];

    mapa.innerHTML = "";

    const ns = "http://www.w3.org/2000/svg";

    const linhas = document.createElementNS(ns, "g");

    const constelacaoLinhas = constelacao.linhas;

    constelacaoLinhas.forEach(([a, b]) => {
        const linha = document.createElementNS(ns, "line");

        linha.setAttribute("x1", constelacao.estrelas[a][0]);
        linha.setAttribute("y1", constelacao.estrelas[a][1]);
        linha.setAttribute("x2", constelacao.estrelas[b][0]);
        linha.setAttribute("y2", constelacao.estrelas[b][1]);

        linhas.appendChild(linha);
    });

    mapa.appendChild(linhas);

    const estrelas = document.createElementNS(ns, "g");

    constelacao.estrelas.forEach(([x, y]) => {
        const estrela = document.createElementNS(ns, "circle");

        estrela.setAttribute("cx", x);
        estrela.setAttribute("cy", y);
        estrela.setAttribute("r", 4);

        estrelas.appendChild(estrela);
    });

    mapa.appendChild(estrelas);

    document.getElementById("nome-constelacao").textContent = constelacao.nome;
    document.getElementById("nome-popular").textContent = constelacao.popular;
    document.getElementById("epoca").textContent = constelacao.epoca;
    document.getElementById("estrela").textContent = constelacao.estrela;
    document.getElementById("descricao").textContent = constelacao.descricao;

    document.getElementById("curiosidade").textContent = constelacao.curiosidade;
    document.getElementById("curiosidade").classList.add("escondido");
}

botoes.forEach(botao => {
    botao.addEventListener("click", () => {
        botoes.forEach(b => b.classList.remove("ativo"));

        botao.classList.add("ativo");

        desenharConstelacao(botao.dataset.constelacao);
    });
});

document.getElementById("botao-curiosidade").addEventListener("click", () => {
    document.getElementById("curiosidade").classList.toggle("escondido");
});

desenharConstelacao("orion");
