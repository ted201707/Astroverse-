
const perguntas = [
    {
        categoria: "Sistema Solar",
        pergunta: "Qual é o maior planeta do Sistema Solar?",
        opcoes: ["Terra", "Júpiter", "Saturno", "Netuno"],
        correta: 1,
        explicacao: "Júpiter é o maior planeta do Sistema Solar."
    },
    {
        categoria: "Sistema Solar",
        pergunta: "Qual planeta é conhecido como Planeta Vermelho?",
        opcoes: ["Vênus", "Mercúrio", "Marte", "Urano"],
        correta: 2,
        explicacao: "Marte recebe esse nome devido à aparência avermelhada de sua superfície."
    },
    {
        categoria: "Astronomia",
        pergunta: "Qual é a estrela mais próxima da Terra?",
        opcoes: ["Sirius", "Sol", "Alpha Centauri", "Betelgeuse"],
        correta: 1,
        explicacao: "O Sol é a estrela mais próxima da Terra."
    },
    {
        categoria: "Sistema Solar",
        pergunta: "Qual planeta possui os anéis mais conhecidos?",
        opcoes: ["Saturno", "Marte", "Terra", "Mercúrio"],
        correta: 0,
        explicacao: "Saturno é famoso por seu grande e brilhante sistema de anéis."
    },
    {
        categoria: "Lua",
        pergunta: "Qual é o satélite natural da Terra?",
        opcoes: ["Europa", "Titã", "Lua", "Fobos"],
        correta: 2,
        explicacao: "A Lua é o único satélite natural da Terra."
    },
    {
        categoria: "Sistema Solar",
        pergunta: "Qual é o planeta mais próximo do Sol?",
        opcoes: ["Vênus", "Terra", "Marte", "Mercúrio"],
        correta: 3,
        explicacao: "Mercúrio é o planeta mais próximo do Sol."
    },
    {
        categoria: "Astronomia",
        pergunta: "Como se chama a galáxia onde está localizado o Sistema Solar?",
        opcoes: ["Andrômeda", "Via Láctea", "Galáxia do Sombrero", "Triângulo"],
        correta: 1,
        explicacao: "Nosso Sistema Solar está localizado na galáxia Via Láctea."
    },
    {
        categoria: "Astronomia",
        pergunta: "O que é um buraco negro?",
        opcoes: [
            "Um planeta sem atmosfera",
            "Uma estrela muito brilhante",
            "Uma região com gravidade extremamente intensa",
            "Uma galáxia pequena"
        ],
        correta: 2,
        explicacao: "Um buraco negro é uma região do espaço com gravidade tão intensa que nem a luz consegue escapar de seu interior."
    }
];

const perguntaElemento = document.getElementById("pergunta");
const categoriaElemento = document.getElementById("categoria");
const opcoesElemento = document.getElementById("opcoes");
const mensagemElemento = document.getElementById("mensagem");
const pontuacaoElemento = document.getElementById("pontuacao");
const contadorElemento = document.getElementById("contador");
const progressoElemento = document.getElementById("progresso");

const botaoProximo = document.getElementById("proximo");
const areaPergunta = document.getElementById("area-pergunta");
const resultadoElemento = document.getElementById("resultado");

const iconeResultado = document.getElementById("icone");
const tituloResultado = document.getElementById("titulo-resultado");
const textoResultado = document.getElementById("texto-resultado");
const pontuacaoFinal = document.getElementById("pontuacao-final");
const botaoReiniciar = document.getElementById("reiniciar");

const CHAVE_USUARIO = "astroverse_usuario_logado";
const CHAVE_RESULTADOS = "astroverse_resultados";

let indiceAtual = 0;
let pontos = 0;
let respondida = false;

function identificarUsuario() {
    const usuarioElemento = document.getElementById("usuario-atual");
    const usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO));

    if (usuarioElemento) {
        usuarioElemento.textContent = usuario ? usuario.nome : "Visitante";
    }
}

function mostrarPergunta() {
    respondida = false;

    const perguntaAtual = perguntas[indiceAtual];

    categoriaElemento.textContent = perguntaAtual.categoria;
    perguntaElemento.textContent = perguntaAtual.pergunta;
    contadorElemento.textContent = `Pergunta ${indiceAtual + 1} de ${perguntas.length}`;

    progressoElemento.style.width =
        `${((indiceAtual + 1) / perguntas.length) * 100}%`;

    opcoesElemento.innerHTML = "";
    mensagemElemento.textContent = "";
    botaoProximo.disabled = true;

    perguntaAtual.opcoes.forEach((opcao, indice) => {
        const botao = document.createElement("button");

        botao.textContent = opcao;
        botao.classList.add("opcao");

        botao.addEventListener("click", () => {
            selecionarResposta(indice);
        });

        opcoesElemento.appendChild(botao);
    });

    pontuacaoElemento.textContent = pontos;
}

function selecionarResposta(indiceSelecionado) {
    if (respondida) return;

    respondida = true;

    const perguntaAtual = perguntas[indiceAtual];
    const botoes = opcoesElemento.querySelectorAll("button");

    botoes.forEach(botao => {
        botao.disabled = true;
    });

    if (indiceSelecionado === perguntaAtual.correta) {
        pontos++;
        mensagemElemento.textContent = "Resposta correta! " + perguntaAtual.explicacao;
        mensagemElemento.className = "mensagem correta";
        botoes[indiceSelecionado].classList.add("correta");
    } else {
        mensagemElemento.textContent =
            "Resposta incorreta! " + perguntaAtual.explicacao;

        mensagemElemento.className = "mensagem incorreta";
        botoes[indiceSelecionado].classList.add("incorreta");
        botoes[perguntaAtual.correta].classList.add("correta");
    }

    pontuacaoElemento.textContent = pontos;
    botaoProximo.disabled = false;

    botaoProximo.textContent =
        indiceAtual === perguntas.length - 1
            ? "Ver resultado"
            : "Próxima pergunta";
}

function avancarPergunta() {
    if (!respondida) return;

    indiceAtual++;

    if (indiceAtual < perguntas.length) {
        mostrarPergunta();
    } else {
        mostrarResultado();
    }
}

function salvarResultadoQuiz() {
    const usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO));

    if (!usuario) return;

    const resultados = JSON.parse(
        localStorage.getItem(CHAVE_RESULTADOS)
    ) || [];

    const novoResultado = {
        nome: usuario.nome,
        email: usuario.email,
        pontuacao: pontos,
        total: perguntas.length,
        data: new Date().toLocaleDateString("pt-BR")
    };

    resultados.push(novoResultado);

    localStorage.setItem(
        CHAVE_RESULTADOS,
        JSON.stringify(resultados)
    );
}


function mostrarRanking() {
    const lista = document.getElementById("lista-ranking");

    if (!lista) return;

    const resultados = JSON.parse(
        localStorage.getItem(CHAVE_RESULTADOS)
    ) || [];

    const melhoresResultados = {};

    resultados.forEach(resultado => {
        const email = resultado.email;
        const pontuacao = Number(resultado.pontuacao);
        const total = Number(resultado.total);

        if (
            !email ||
            !Number.isFinite(pontuacao) ||
            !Number.isFinite(total) ||
            total <= 0 ||
            pontuacao < 0 ||
            pontuacao > total
        ) {
            return;
        }

        if (
            !melhoresResultados[email] ||
            pontuacao > melhoresResultados[email].pontuacao
        ) {
            melhoresResultados[email] = {
                nome: resultado.nome || "Explorador",
                email: email,
                pontuacao: pontuacao,
                total: total
            };
        }
    });

    const ranking = Object.values(melhoresResultados)
        .sort((a, b) => b.pontuacao - a.pontuacao);

    lista.innerHTML = "";

    if (ranking.length === 0) {
        lista.innerHTML = "<li>Nenhum resultado registrado ainda.</li>";
        return;
    }

    ranking.slice(0, 10).forEach((resultado, indice) => {
        const item = document.createElement("li");

        item.textContent =
            `${indice + 1}º lugar — ${resultado.nome}: ` +
            `${resultado.pontuacao}/${resultado.total} pontos`;

        lista.appendChild(item);
    });
}


function mostrarResultado() {
    areaPergunta.classList.add("escondido");
    resultadoElemento.classList.remove("escondido");

    const porcentagem = (pontos / perguntas.length) * 100;

    if (porcentagem === 100) {
        iconeResultado.textContent = "🏆";
        tituloResultado.textContent = "Explorador excepcional!";
        textoResultado.textContent = "Você acertou todas as perguntas!";
    } else if (porcentagem >= 70) {
        iconeResultado.textContent = "🌟";
        tituloResultado.textContent = "Muito bem!";
        textoResultado.textContent = "Você conhece bastante sobre o universo!";
    } else if (porcentagem >= 40) {
        iconeResultado.textContent = "🚀";
        tituloResultado.textContent = "Boa tentativa!";
        textoResultado.textContent = "Continue explorando e aprendendo!";
    } else {
        iconeResultado.textContent = "🌌";
        tituloResultado.textContent = "Sua jornada está começando!";
        textoResultado.textContent = "Explore o AstroVerse e tente novamente!";
    }

    pontuacaoFinal.textContent = `${pontos}/${perguntas.length}`;

    salvarResultadoQuiz();
    mostrarRanking();
}

function reiniciarQuiz() {
    indiceAtual = 0;
    pontos = 0;
    respondida = false;

    resultadoElemento.classList.add("escondido");
    areaPergunta.classList.remove("escondido");

    botaoProximo.textContent = "Próxima pergunta";

    mostrarPergunta();
}

botaoProximo.addEventListener("click", avancarPergunta);
botaoReiniciar.addEventListener("click", reiniciarQuiz);

identificarUsuario();
mostrarPergunta();
mostrarRanking();
