
const elementoCena = document.getElementById("cena-exploracao");

const cena3D = new THREE.Scene();


const quantidadeEstrelas = 1800;

const posicoesEstrelas = [];

for (let i = 0; i < quantidadeEstrelas; i++) {
    const x = (Math.random() - 0.5) * 180;
    const y = (Math.random() - 0.5) * 120;
    const z = -20 - Math.random() * 80;

    posicoesEstrelas.push(x, y, z);
}

const geometriaEstrelas = new THREE.BufferGeometry();

geometriaEstrelas.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(posicoesEstrelas, 3)
);

const materialEstrelas = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.12,
    transparent: true,
    opacity: 0.85,
    sizeAttenuation: true,
    depthWrite: false
});

const estrelas = new THREE.Points(
    geometriaEstrelas,
    materialEstrelas
);

cena3D.add(estrelas);


const camera = new THREE.PerspectiveCamera(
    45,
    elementoCena.clientWidth / elementoCena.clientHeight,
    0.1,
    100
);

camera.position.set(0, 0, 9);

const renderizador = new THREE.WebGLRenderer({
    antialias: true,
    alpha: true
});

renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));

renderizador.setSize(
    elementoCena.clientWidth,
    elementoCena.clientHeight
);

elementoCena.appendChild(renderizador.domElement);

const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.25);
cena3D.add(luzAmbiente);

const luzPrincipal = new THREE.DirectionalLight(0xffffff, 2.5);
luzPrincipal.position.set(5, 3, 5);
cena3D.add(luzPrincipal);

const luzSecundaria = new THREE.DirectionalLight(0x4169e1, 0.6);

luzSecundaria.position.set(-5, -2, -3);

cena3D.add(luzSecundaria);

const dadosPlanetas = [
    {
        identificador: "mercurio",
        nome: "Mercúrio",
        descricao: "O menor planeta do Sistema Solar e o mais próximo do Sol. Sua superfície possui milhares de crateras.",
        textura: texturaMercurioBase64,
        pagina: "mercurio.html",
        tamanho: 1.25,
        diametro: "4.879 km",
        distanciaSol: "57,9 milhões km",
        duracaoDia: "58,6 dias",
        temperatura: "167 °C"
    },
    {
        identificador: "venus",
        nome: "Vênus",
        descricao: "O planeta mais quente do Sistema Solar, conhecido por sua atmosfera extremamente densa.",
        textura: texturaVenusBase64,
        pagina: "venus.html",
        tamanho: 1.7,
        diametro: "12.104 km",
        distanciaSol: "108,2 milhões km",
        duracaoDia: "243 dias",
        temperatura: "464 °C"
    },
    {
        identificador: "terra",
        nome: "Terra",
        descricao: "Nosso lar no Universo. O único planeta conhecido por abrigar vida e possuir oceanos de água líquida na superfície.",
        textura: texturaTerraBase64,
        pagina: "terra.html",
        tamanho: 1.8,
        diametro: "12.742 km",
        distanciaSol: "149,6 milhões de km",
        duracaoDia: "23h 56min",
        temperatura: "15 °C"
    },
    {
        identificador: "marte",
        nome: "Marte",
        descricao: "O famoso Planeta Vermelho, conhecido por seus desertos, vulcões e possibilidades de exploração humana.",
        textura: texturaMarteBase64,
        pagina: "marte.html",
        tamanho: 1.5,
        diametro: "6.779 km",
        distanciaSol: "227,9 milhões km",
        duracaoDia: "24h 37min",
        temperatura: "−65 °C"
    },
    {
        identificador: "jupiter",
        nome: "Júpiter",
        descricao: "O maior planeta do Sistema Solar. Possui tempestades gigantescas, incluindo a Grande Mancha Vermelha.",
        textura: texturaJupiterBase64,
        pagina: "jupiter.html",
        tamanho: 2.5,
        diametro: "139.820 km",
        distanciaSol: "778,6 milhões km",
        duracaoDia: "9h 56min",
        temperatura: "−110 °C"
    },
    {
        identificador: "saturno",
        nome: "Saturno",
        descricao: "Um gigante gasoso famoso por seus impressionantes anéis formados principalmente por partículas de gelo e rocha.",
        textura: texturaSaturnoBase64,
        pagina: "saturno.html",
        tamanho: 2.1,
        diametro: "116.460 km",
        distanciaSol: "1,43 bilhão km",
        duracaoDia: "10h 33min",
        temperatura: "−140 °C"
    },
    {
        identificador: "urano",
        nome: "Urano",
        descricao: "Um gigante de gelo azul-esverdeado que possui um eixo de rotação extremamente inclinado.",
        textura: texturaUranoBase64,
        pagina: "urano.html",
        tamanho: 1.9,
        diametro: "50.724 km",
        distanciaSol: "2,87 bilhões km",
        duracaoDia: "17h 14min",
        temperatura: "−195 °C"
    },
    {
        identificador: "netuno",
        nome: "Netuno",
        descricao: "O planeta mais distante do Sol, conhecido por sua coloração azul e seus ventos extremamente rápidos.",
        textura: texturaNeptunoBase64,
        pagina: "netuno.html",
        tamanho: 1.9,
        diametro: "49.244 km",
        distanciaSol: "4,50 bilhões km",
        duracaoDia: "16h 6min",
        temperatura: "−200 °C"
    }
];

const carregadorTexturas = new THREE.TextureLoader();

const texturasPlanetas = dadosPlanetas.map(function (dados) {
    return carregadorTexturas.load(dados.textura);
});

const geometriaPlaneta = new THREE.SphereGeometry(1, 96, 96);

const materialPlaneta = new THREE.MeshStandardMaterial({
    map: texturasPlanetas[0],
    roughness: 1
});

const planeta3D = new THREE.Mesh(
    geometriaPlaneta,
    materialPlaneta
);

let arrastandoPlaneta = false;
let posicaoAnteriorMouse = 0;
let velocidadeRotacao = 0.003;

planeta3D.scale.setScalar(dadosPlanetas[0].tamanho);

cena3D.add(planeta3D);

const geometriaAneis = new THREE.RingGeometry(1.35, 2.15, 128);

const materialAneis = new THREE.MeshStandardMaterial({
    color: 0xcbb991,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.8,
    roughness: 1
});

const aneisSaturno = new THREE.Mesh(
    geometriaAneis,
    materialAneis
);

aneisSaturno.rotation.x = -Math.PI / 2.5;
aneisSaturno.visible = false;

planeta3D.add(aneisSaturno);

const tituloPlaneta = document.getElementById("titulo-planeta");
const descricaoPlaneta = document.getElementById("descricao-planeta");
const linkPlaneta = document.getElementById("link-planeta");
const diametroPlaneta = document.getElementById("diametro-planeta");
const distanciaPlaneta = document.getElementById("distancia-planeta");
const diaPlaneta = document.getElementById("dia-planeta");
const temperaturaPlaneta = document.getElementById("temperatura-planeta");

const botoesPlanetas = document.querySelectorAll(".botao-planeta");

let indiceAtual = 0;
let indiceDestino = 0;
let etapaTransicao = "normal";
let progressoTransicao = 0;


function atualizarInformacoes(indice) {
    const dados = dadosPlanetas[indice];

    tituloPlaneta.textContent = dados.nome;
    descricaoPlaneta.textContent = dados.descricao;
    linkPlaneta.href = dados.pagina;

    diametroPlaneta.textContent = dados.diametro;
    distanciaPlaneta.textContent = dados.distanciaSol;
    diaPlaneta.textContent = dados.duracaoDia;
    temperaturaPlaneta.textContent = dados.temperatura;

    botoesPlanetas.forEach(function (botao) {
        botao.classList.toggle(
            "ativo",
            botao.dataset.planeta === dados.identificador
        );
    });
}

function selecionarPlaneta(indice) {
    if (indice === indiceDestino) {
        return;
    }

    indiceDestino = indice;
    etapaTransicao = "saindo";
    progressoTransicao = 0;
}




renderizador.domElement.addEventListener("pointerdown", function (evento) {
    arrastandoPlaneta = true;
    posicaoAnteriorMouse = evento.clientX;

    renderizador.domElement.setPointerCapture(evento.pointerId);
});

renderizador.domElement.addEventListener("pointermove", function (evento) {
    if (!arrastandoPlaneta) {
        return;
    }

    const movimentoMouse = evento.clientX - posicaoAnteriorMouse;

    planeta3D.rotation.y += movimentoMouse * 0.008;

    posicaoAnteriorMouse = evento.clientX;
});

renderizador.domElement.addEventListener("pointerup", function () {
    arrastandoPlaneta = false;
});

renderizador.domElement.addEventListener("pointercancel", function () {
    arrastandoPlaneta = false;
});

renderizador.domElement.addEventListener("lostpointercapture", function () {
    arrastandoPlaneta = false;
});


botoesPlanetas.forEach(function (botao) {
    botao.addEventListener("click", function () {
        const indice = dadosPlanetas.findIndex(function (dados) {
            return dados.identificador === botao.dataset.planeta;
        });

        if (indice !== -1) {
            selecionarPlaneta(indice);
        }
    });
});


function animar() {
    requestAnimationFrame(animar);

    if (!arrastandoPlaneta) {
    planeta3D.rotation.y += velocidadeRotacao;
}
    estrelas.rotation.z += 0.000015;

    if (etapaTransicao === "saindo") {
        progressoTransicao = Math.min(progressoTransicao + 0.025, 1);

        const suavizacao = progressoTransicao * progressoTransicao *
            (3 - 2 * progressoTransicao);

        planeta3D.position.x = -5 * suavizacao;

        if (progressoTransicao >= 1) {
            indiceAtual = indiceDestino;

            const dados = dadosPlanetas[indiceAtual];

            materialPlaneta.map = texturasPlanetas[indiceAtual];
            materialPlaneta.needsUpdate = true;

            aneisSaturno.visible = dados.identificador === "saturno";

            planeta3D.rotation.y = 0;
            planeta3D.position.x = 5;
            planeta3D.scale.setScalar(dados.tamanho);

            atualizarInformacoes(indiceAtual);

            progressoTransicao = 0;
            etapaTransicao = "entrando";
        }
    }

    if (etapaTransicao === "entrando") {
        progressoTransicao = Math.min(progressoTransicao + 0.025, 1);

        const suavizacao = progressoTransicao * progressoTransicao *
            (3 - 2 * progressoTransicao);

        planeta3D.position.x = 5 * (1 - suavizacao);

        if (progressoTransicao >= 1) {
            planeta3D.position.x = 0;
            etapaTransicao = "normal";
        }
    }

    renderizador.render(cena3D, camera);
}

atualizarInformacoes(indiceAtual);
animar();

window.addEventListener("resize", function () {
    camera.aspect =
        elementoCena.clientWidth / elementoCena.clientHeight;

    camera.updateProjectionMatrix();

    renderizador.setSize(
        elementoCena.clientWidth,
        elementoCena.clientHeight
    );
});
