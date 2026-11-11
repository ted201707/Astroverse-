
const CHAVE_USUARIO = "astroverse_usuario_logado";
const CHAVE_RESULTADOS = "astroverse_resultados";

const usuario = JSON.parse(localStorage.getItem(CHAVE_USUARIO));

const nomePerfil = document.getElementById("nome-perfil");
const emailPerfil = document.getElementById("email-perfil");
const melhorPontuacao = document.getElementById("melhor-pontuacao");
const totalQuizzes = document.getElementById("total-quizzes");
const mediaAcertos = document.getElementById("media-acertos");
const listaHistorico = document.getElementById("lista-historico");
const botaoSair = document.getElementById("botao-sair");

if (!usuario) {
    window.location.href = "login.html";
} else {
    carregarPerfil();
}

function carregarPerfil() {
    nomePerfil.textContent = usuario.nome;
    emailPerfil.textContent = usuario.email;

    const resultados = JSON.parse(
        localStorage.getItem(CHAVE_RESULTADOS)
    ) || [];

    const resultadosUsuario = resultados.filter(resultado => {
        const pontuacao = Number(resultado.pontuacao);
        const total = Number(resultado.total);

        return (
            resultado.email === usuario.email &&
            Number.isFinite(pontuacao) &&
            Number.isFinite(total) &&
            total > 0 &&
            pontuacao >= 0 &&
            pontuacao <= total
        );
    });

    if (resultadosUsuario.length === 0) {
        melhorPontuacao.textContent = "0/8";
        totalQuizzes.textContent = "0";
        mediaAcertos.textContent = "0%";

        listaHistorico.innerHTML = `
            <p class="historico-vazio">
                Você ainda não realizou nenhum quiz.
                Que tal começar sua jornada?
            </p>
        `;

        return;
    }

    const melhorResultado = resultadosUsuario.reduce((melhor, atual) => {
        return Number(atual.pontuacao) / Number(atual.total) >
            Number(melhor.pontuacao) / Number(melhor.total)
            ? atual
            : melhor;
    });

    const somaPorcentagens = resultadosUsuario.reduce((soma, resultado) => {
        return soma +
            (Number(resultado.pontuacao) / Number(resultado.total)) * 100;
    }, 0);

    const media = somaPorcentagens / resultadosUsuario.length;

    melhorPontuacao.textContent =
        `${melhorResultado.pontuacao}/${melhorResultado.total}`;

    totalQuizzes.textContent = resultadosUsuario.length;
    mediaAcertos.textContent = `${Math.round(media)}%`;

    mostrarHistorico(resultadosUsuario);
}

function mostrarHistorico(resultados) {
    listaHistorico.innerHTML = "";

    const historicoOrdenado = [...resultados].reverse();

    historicoOrdenado.forEach((resultado, indice) => {
        const item = document.createElement("article");
        item.classList.add("historico-item");

        const informacoes = document.createElement("div");

        const titulo = document.createElement("h3");
        titulo.textContent = `Quiz ${historicoOrdenado.length - indice}`;

        const data = document.createElement("p");
        data.textContent = `Realizado em ${resultado.data || "Data não informada"}`;

        const pontuacao = document.createElement("span");
        pontuacao.classList.add("historico-pontuacao");
        pontuacao.textContent =
            `${Number(resultado.pontuacao)}/${Number(resultado.total)} pontos`;

        informacoes.appendChild(titulo);
        informacoes.appendChild(data);

        item.appendChild(informacoes);
        item.appendChild(pontuacao);

        listaHistorico.appendChild(item);
    });
}

botaoSair.addEventListener("click", function () {
    localStorage.removeItem(CHAVE_USUARIO);
    window.location.href = "login.html";
});
