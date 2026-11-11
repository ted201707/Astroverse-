
const elementoCena = document.getElementById("cena_3d");
const nomePlaneta = document.getElementById("nome-planeta");
const botaoVoltar = document.getElementById("botao-voltar");
const painelPlaneta = document.getElementById("painel-planeta");
const tituloPlaneta = document.getElementById("titulo-planeta");
const descricaoPlaneta = document.getElementById("descricao-planeta");
const tipoPlaneta = document.getElementById("tipo-planeta");
const diametroPlaneta = document.getElementById("diametro-planeta");
const temperaturaPlaneta = document.getElementById("temperatura-planeta");
const linkPlaneta = document.getElementById("link-planeta");

const cena3D = new THREE.Scene();
cena3D.background = new THREE.Color(0x030611);

const camera = new THREE.PerspectiveCamera(
    48,
    elementoCena.clientWidth / elementoCena.clientHeight,
    0.1,
    300
);

camera.position.set(0, 28, 48);

const renderizador = new THREE.WebGLRenderer({
    antialias: true,
    alpha: false
});

renderizador.setSize(elementoCena.clientWidth, elementoCena.clientHeight);
renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));

if (THREE.SRGBColorSpace) {
    renderizador.outputColorSpace = THREE.SRGBColorSpace;
}

elementoCena.appendChild(renderizador.domElement);

function criarNebulosa(cores) {
    const tela = document.createElement("canvas");
    tela.width = 512;
    tela.height = 512;

    const contexto = tela.getContext("2d");
    const gradiente = contexto.createRadialGradient(256, 256, 10, 256, 256, 250);

    gradiente.addColorStop(0, cores[0]);
    gradiente.addColorStop(0.35, cores[1]);
    gradiente.addColorStop(1, "rgba(0,0,0,0)");

    contexto.fillStyle = gradiente;
    contexto.fillRect(0, 0, 512, 512);

    for (let i = 0; i < 35; i++) {
        const x = Math.random() * 512;
        const y = Math.random() * 512;
        const raio = 20 + Math.random() * 90;

        const mancha = contexto.createRadialGradient(x, y, 0, x, y, raio);

        mancha.addColorStop(
            0,
            cores[Math.floor(Math.random() * cores.length)]
        );

        mancha.addColorStop(1, "rgba(0,0,0,0)");

        contexto.fillStyle = mancha;
        contexto.fillRect(x - raio, y - raio, raio * 2, raio * 2);
    }

    const texturaNebulosa = new THREE.CanvasTexture(tela);

    const materialNebulosa = new THREE.SpriteMaterial({
        map: texturaNebulosa,
        transparent: true,
        opacity: 0.32,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    return new THREE.Sprite(materialNebulosa);
}

const nebulosas = [
    criarNebulosa(["rgba(70,40,180,0.8)", "rgba(35,70,160,0.4)"]),
    criarNebulosa(["rgba(130,40,160,0.8)", "rgba(60,30,120,0.4)"]),
    criarNebulosa(["rgba(30,100,180,0.8)", "rgba(20,50,130,0.4)"])
];

nebulosas[0].position.set(-22, 12, -38);
nebulosas[0].scale.set(35, 25, 1);

nebulosas[1].position.set(22, -8, -42);
nebulosas[1].scale.set(32, 27, 1);

nebulosas[2].position.set(0, 24, -48);
nebulosas[2].scale.set(40, 24, 1);

nebulosas.forEach(nebulosa => cena3D.add(nebulosa));

function criarEstrelas(quantidade, tamanho, opacidade, profundidade) {
    const geometriaEstrelas = new THREE.BufferGeometry();
    const posicoesEstrelas = [];

    for (let i = 0; i < quantidade; i++) {
        posicoesEstrelas.push(
            (Math.random() - 0.5) * 140,
            (Math.random() - 0.5) * 100,
            -Math.random() * profundidade
        );
    }

    geometriaEstrelas.setAttribute(
        "position",
        new THREE.Float32BufferAttribute(posicoesEstrelas, 3)
    );

    const materialEstrelas = new THREE.PointsMaterial({
        color: 0xffffff,
        size: tamanho,
        transparent: true,
        opacity: opacidade,
        sizeAttenuation: true
    });

    return new THREE.Points(geometriaEstrelas, materialEstrelas);
}

const estrelasDistantes = criarEstrelas(1800, 0.16, 0.8, 100);
const estrelasProximas = criarEstrelas(500, 0.28, 0.95, 65);

cena3D.add(estrelasDistantes);
cena3D.add(estrelasProximas);

const luzAmbiente = new THREE.AmbientLight(0x9bbcff, 0.75);
cena3D.add(luzAmbiente);

const luzSolar = new THREE.PointLight(0xffffff, 4.5, 150);
luzSolar.position.set(0, 0, 0);
luzSolar.decay = 1.5;
cena3D.add(luzSolar);

const geometriaSol = new THREE.SphereGeometry(1.5, 64, 64);

const materialSol = new THREE.MeshBasicMaterial({
    map: new THREE.TextureLoader().load(texturaSolBase64)
});

const sol = new THREE.Mesh(geometriaSol, materialSol);
cena3D.add(sol);

const geometriaBrilho = new THREE.SphereGeometry(2.15, 64, 64);

const materialBrilho = new THREE.MeshBasicMaterial({
    color: 0xffa52b,
    transparent: true,
    opacity: 0.23,
    blending: THREE.AdditiveBlending,
    side: THREE.BackSide,
    depthWrite: false
});

const brilhoSolar = new THREE.Mesh(geometriaBrilho, materialBrilho);
cena3D.add(brilhoSolar);

const estrelasCadentes = [];

function criarEstrelasCadentes() {
    for (let i = 0; i < 5; i++) {
        const geometriaEstrelaCadente = new THREE.BufferGeometry();

        const posicoesEstrelaCadente = new Float32Array([
            0, 0, 0,
            -8, 4, 0
        ]);

        geometriaEstrelaCadente.setAttribute(
            "position",
            new THREE.BufferAttribute(posicoesEstrelaCadente, 3)
        );

        const materialEstrelaCadente = new THREE.LineBasicMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0,
            blending: THREE.AdditiveBlending
        });

        const linhaEstrelaCadente = new THREE.Line(
            geometriaEstrelaCadente,
            materialEstrelaCadente
        );

        cena3D.add(linhaEstrelaCadente);

        estrelasCadentes.push({
            linha: linhaEstrelaCadente,
            velocidade: 0.8 + Math.random() * 1.5,
            posicao: new THREE.Vector3(0, 0, 0),
            opacidade: 0,
            ativa: false,
            desaparecendo: false,
            espera: Math.random() * 180
        });
    }
}

criarEstrelasCadentes();

function atualizarEstrelasCadentes() {
    estrelasCadentes.forEach(estrela => {
        if (!estrela.ativa) {
            estrela.espera--;

            if (estrela.espera <= 0) {
                estrela.ativa = true;
                estrela.desaparecendo = false;
                estrela.opacidade = 0;

                estrela.posicao.set(
                    Math.random() * 70 - 35,
                    Math.random() * 40 - 20,
                    Math.random() * 30 - 15
                );
            }

            estrela.linha.material.opacity = 0;
            return;
        }

        estrela.posicao.x += estrela.velocidade;
        estrela.posicao.y -= estrela.velocidade * 0.5;

        if (estrela.posicao.x > 25 || estrela.posicao.y < -15) {
            estrela.desaparecendo = true;
        }

        if (estrela.desaparecendo) {
            estrela.opacidade -= 0.035;
        } else {
            estrela.opacidade += 0.035;
        }

        estrela.opacidade = Math.max(
            0,
            Math.min(0.85, estrela.opacidade)
        );

        estrela.linha.material.opacity = estrela.opacidade;

        const posicoes = estrela.linha.geometry.attributes.position;

        posicoes.setXYZ(
            0,
            estrela.posicao.x,
            estrela.posicao.y,
            estrela.posicao.z
        );

        posicoes.setXYZ(
            1,
            estrela.posicao.x - 8,
            estrela.posicao.y + 4,
            estrela.posicao.z
        );

        posicoes.needsUpdate = true;

        if (estrela.desaparecendo && estrela.opacidade <= 0) {
            estrela.ativa = false;
            estrela.espera = 60 + Math.random() * 180;
        }
    });
}

const dadosPlanetas = [
    {
        nome: "Mercúrio",
        tamanho: 0.25,
        distancia: 3.45,
        velocidade: 0.01,
        textura: texturaMercurioBase64,
        inclinacao: 0.04,
        tipo: "Planeta rochoso",
        diametro: "4.879 km",
        temperatura: "167 °C",
        descricao: "Mercúrio é o menor planeta do Sistema Solar e também o mais próximo do Sol.",
        pagina: "mercurio.html"
    },
    {
        nome: "Vênus",
        tamanho: 0.4,
        distancia: 4.8,
        velocidade: 0.007,
        textura: texturaVenusBase64,
        inclinacao: 0.08,
        tipo: "Planeta rochoso",
        diametro: "12.104 km",
        temperatura: "464 °C",
        descricao: "Vênus possui uma atmosfera extremamente densa e é o planeta mais quente do Sistema Solar.",
        pagina: "venus.html"
    },
    {
        nome: "Terra",
        tamanho: 0.43,
        distancia: 6.2,
        velocidade: 0.005,
        textura: texturaTerraBase64,
        inclinacao: 0.12,
        tipo: "Planeta rochoso",
        diametro: "12.742 km",
        temperatura: "15 °C",
        descricao: "A Terra é o nosso lar e o único planeta conhecido que abriga vida.",
        pagina: "terra.html"
    },
    {
        nome: "Marte",
        tamanho: 0.33,
        distancia: 7.5,
        velocidade: 0.004,
        textura: texturaMarteBase64,
        inclinacao: 0.16,
        tipo: "Planeta rochoso",
        diametro: "6.779 km",
        temperatura: "-65 °C",
        descricao: "Marte é conhecido como Planeta Vermelho por causa da presença de óxido de ferro em sua superfície.",
        pagina: "marte.html"
    },
    {
        nome: "Júpiter",
        tamanho: 0.9,
        distancia: 10,
        velocidade: 0.002,
        textura: texturaJupiterBase64,
        inclinacao: 0.2,
        tipo: "Gigante gasoso",
        diametro: "139.820 km",
        temperatura: "-110 °C",
        descricao: "Júpiter é o maior planeta do Sistema Solar e possui uma enorme tempestade conhecida como Grande Mancha Vermelha.",
        pagina: "jupiter.html"
    },
    {
        nome: "Saturno",
        tamanho: 0.75,
        distancia: 13,
        velocidade: 0.0015,
        textura: texturaSaturnoBase64,
        inclinacao: 0.24,
        tipo: "Gigante gasoso",
        diametro: "116.460 km",
        temperatura: "-140 °C",
        descricao: "Saturno é famoso por seu impressionante sistema de anéis formado principalmente por gelo e rochas.",
        pagina: "saturno.html"
    },
    {
        nome: "Urano",
        tamanho: 0.6,
        distancia: 16,
        velocidade: 0.001,
        textura: texturaUranoBase64,
        inclinacao: 0.28,
        tipo: "Gigante de gelo",
        diametro: "50.724 km",
        temperatura: "-195 °C",
        descricao: "Urano possui uma coloração azulada e gira praticamente de lado em relação ao seu plano orbital.",
        pagina: "urano.html"
    },
    {
        nome: "Netuno",
        tamanho: 0.58,
        distancia: 19,
        velocidade: 0.0008,
        textura: texturaNeptunoBase64,
        inclinacao: 0.32,
        tipo: "Gigante de gelo",
        diametro: "49.244 km",
        temperatura: "-200 °C",
        descricao: "Netuno é o planeta mais distante do Sol e apresenta ventos extremamente velozes.",
        pagina: "netuno.html"
    }
];

const planetas = [];
const quantidadeAsteroides = 900;
const geometriaCinturao = new THREE.BufferGeometry();
const posicoesCinturao = [];
const coresCinturao = [];

const coresAsteroides = [
    new THREE.Color(0x82766b),
    new THREE.Color(0xa39483),
    new THREE.Color(0x625b55),
    new THREE.Color(0xc0ad96),
    new THREE.Color(0x766b61)
];

for (let i = 0; i < quantidadeAsteroides; i++) {
    const angulo = Math.random() * Math.PI * 2;
    const distancia = 8.2 + Math.random() * 1.5;
    const altura = (Math.random() - 0.5) * 0.7;

    posicoesCinturao.push(
        Math.cos(angulo) * distancia,
        altura,
        Math.sin(angulo) * distancia
    );

    const cor = coresAsteroides[
        Math.floor(Math.random() * coresAsteroides.length)
    ];

    coresCinturao.push(cor.r, cor.g, cor.b);
}

geometriaCinturao.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(posicoesCinturao, 3)
);

geometriaCinturao.setAttribute(
    "color",
    new THREE.Float32BufferAttribute(coresCinturao, 3)
);

const materialCinturao = new THREE.PointsMaterial({
    size: 0.09,
    vertexColors: true,
    transparent: true,
    opacity: 0.9,
    sizeAttenuation: true
});

const cinturaoAsteroides = new THREE.Points(
    geometriaCinturao,
    materialCinturao
);

cena3D.add(cinturaoAsteroides);

const telaBrilho = document.createElement("canvas");
telaBrilho.width = 128;
telaBrilho.height = 128;

const contextoBrilho = telaBrilho.getContext("2d");

const gradienteBrilho = contextoBrilho.createRadialGradient(
    64, 64, 5,
    64, 64, 64
);

gradienteBrilho.addColorStop(0, "rgba(255,255,255,0.65)");
gradienteBrilho.addColorStop(0.25, "rgba(130,180,255,0.35)");
gradienteBrilho.addColorStop(0.6, "rgba(80,140,255,0.12)");
gradienteBrilho.addColorStop(1, "rgba(0,0,0,0)");

contextoBrilho.fillStyle = gradienteBrilho;
contextoBrilho.fillRect(0, 0, 128, 128);

const texturaBrilho = new THREE.CanvasTexture(telaBrilho);
const brilhosPlanetas = [];

function criarBrilhoPlaneta(objeto, tamanho) {
    const materialBrilhoPlaneta = new THREE.SpriteMaterial({
        map: texturaBrilho,
        transparent: true,
        opacity: 0.35,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const brilhoPlaneta = new THREE.Sprite(materialBrilhoPlaneta);

    brilhoPlaneta.scale.set(
        tamanho * 3.5,
        tamanho * 3.5,
        1
    );

    objeto.add(brilhoPlaneta);

    const geometriaAtmosfera = new THREE.SphereGeometry(
        tamanho * 1.08,
        48,
        48
    );

    const materialAtmosfera = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        transparent: true,
        opacity: 0.12,
        side: THREE.BackSide,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const atmosfera = new THREE.Mesh(
        geometriaAtmosfera,
        materialAtmosfera
    );

    objeto.add(atmosfera);

    brilhosPlanetas.push({
        brilho: brilhoPlaneta,
        atmosfera: atmosfera,
        fase: Math.random() * Math.PI * 2
    });
}

dadosPlanetas.forEach(dados => {
    const grupoOrbita = new THREE.Group();

    grupoOrbita.rotation.x = dados.inclinacao;
    cena3D.add(grupoOrbita);

    const geometriaOrbita = new THREE.RingGeometry(
        dados.distancia - 0.025,
        dados.distancia + 0.025,
        128
    );

    const materialOrbita = new THREE.MeshBasicMaterial({
        color: 0x60a5fa,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.48,
        blending: THREE.AdditiveBlending,
        depthWrite: false
    });

    const orbita = new THREE.Mesh(geometriaOrbita, materialOrbita);
    orbita.rotation.x = -Math.PI / 2;

    grupoOrbita.add(orbita);

    const geometriaPlaneta = new THREE.SphereGeometry(
        dados.tamanho,
        48,
        48
    );

    const texturaPlaneta = new THREE.TextureLoader().load(dados.textura);

    const materialPlaneta = new THREE.MeshStandardMaterial({
        map: texturaPlaneta,
        roughness: 1
    });

    const objetoPlaneta = new THREE.Mesh(
        geometriaPlaneta,
        materialPlaneta
    );

    objetoPlaneta.position.set(dados.distancia, 0, 0);
    grupoOrbita.add(objetoPlaneta);

    criarBrilhoPlaneta(objetoPlaneta, dados.tamanho);

    if (dados.nome === "Saturno") {
        const geometriaAneis = new THREE.RingGeometry(1.05, 1.65, 96);

        const materialAneis = new THREE.MeshBasicMaterial({
            color: 0xc7ad82,
            side: THREE.DoubleSide,
            transparent: true,
            opacity: 0.75
        });

        const aneis = new THREE.Mesh(geometriaAneis, materialAneis);

        aneis.rotation.x = Math.PI / 2.5;
        objetoPlaneta.add(aneis);
    }

    planetas.push({
        objeto: objetoPlaneta,
        grupo: grupoOrbita,
        distancia: dados.distancia,
        velocidade: dados.velocidade,
        angulo: Math.random() * Math.PI * 2,
        dados: dados
    });
});

const raycaster = new THREE.Raycaster();
const ponteiro = new THREE.Vector2();

let planetaSelecionado = null;
let animacaoAtiva = true;
let retornandoCamera = false;

const alvoCamera = new THREE.Vector3(0, 0, 0);

let arrastando = false;
let movimentoArrasto = false;
let posicaoMouseX = 0;
let posicaoMouseY = 0;
let anguloHorizontal = 0;
let anguloVertical = 0.53;
let distanciaCamera = 55;

function limitarZoom() {
    distanciaCamera = Math.max(25, Math.min(90, distanciaCamera));
}

function atualizarCamera() {
    const distanciaHorizontal = distanciaCamera * Math.cos(anguloVertical);

    camera.position.x = distanciaHorizontal * Math.sin(anguloHorizontal);
    camera.position.y = distanciaCamera * Math.sin(anguloVertical);
    camera.position.z = distanciaHorizontal * Math.cos(anguloHorizontal);

    alvoCamera.set(0, 0, 0);
    camera.lookAt(alvoCamera);
}

renderizador.domElement.style.touchAction = "none";

renderizador.domElement.addEventListener("pointerdown", evento => {
    arrastando = true;
    movimentoArrasto = false;

    posicaoMouseX = evento.clientX;
    posicaoMouseY = evento.clientY;

    renderizador.domElement.setPointerCapture(evento.pointerId);
});

renderizador.domElement.addEventListener("pointermove", evento => {
    if (!arrastando) return;

    const diferencaX = evento.clientX - posicaoMouseX;
    const diferencaY = evento.clientY - posicaoMouseY;

    if (Math.abs(diferencaX) > 2 || Math.abs(diferencaY) > 2) {
        movimentoArrasto = true;
    }

    anguloHorizontal -= diferencaX * 0.005;
    anguloVertical += diferencaY * 0.005;

    anguloVertical = Math.max(
        -1.2,
        Math.min(1.2, anguloVertical)
    );

    posicaoMouseX = evento.clientX;
    posicaoMouseY = evento.clientY;

    if (!planetaSelecionado) {
        retornandoCamera = false;
        atualizarCamera();
    }
});

function finalizarArrasto() {
    arrastando = false;
}

renderizador.domElement.addEventListener("pointerup", finalizarArrasto);
renderizador.domElement.addEventListener("pointercancel", finalizarArrasto);

renderizador.domElement.addEventListener("wheel", evento => {
    evento.preventDefault();

    distanciaCamera += evento.deltaY * 0.035;
    limitarZoom();

    if (!planetaSelecionado) {
        retornandoCamera = false;
        atualizarCamera();
    }
}, { passive: false });

function restaurarCamera() {
    anguloHorizontal = 0;
    anguloVertical = 0.53;
    distanciaCamera = 55;

    voltarSistemaSolar();
}

function selecionarPlaneta(evento) {
    if (movimentoArrasto) {
        movimentoArrasto = false;
        return;
    }

    const limites = renderizador.domElement.getBoundingClientRect();

    ponteiro.x = ((evento.clientX - limites.left) / limites.width) * 2 - 1;
    ponteiro.y = -((evento.clientY - limites.top) / limites.height) * 2 + 1;

    raycaster.setFromCamera(ponteiro, camera);

    const objetosPlanetas = planetas.map(planeta => planeta.objeto);
    const intersecoes = raycaster.intersectObjects(objetosPlanetas);

    if (intersecoes.length > 0) {
        const objetoSelecionado = intersecoes[0].object;

        planetaSelecionado = planetas.find(
            planeta => planeta.objeto === objetoSelecionado
        );

        retornandoCamera = false;

        if (planetaSelecionado) {
            mostrarInformacoesPlaneta(planetaSelecionado.dados);
        }
    }
}

function mostrarInformacoesPlaneta(dados) {
    if (nomePlaneta) nomePlaneta.textContent = dados.nome;
    if (tituloPlaneta) tituloPlaneta.textContent = dados.nome;
    if (descricaoPlaneta) descricaoPlaneta.textContent = dados.descricao;
    if (tipoPlaneta) tipoPlaneta.textContent = dados.tipo;
    if (diametroPlaneta) diametroPlaneta.textContent = dados.diametro;
    if (temperaturaPlaneta) temperaturaPlaneta.textContent = dados.temperatura;
    if (linkPlaneta) linkPlaneta.href = dados.pagina;

    if (painelPlaneta) painelPlaneta.classList.add("ativo");
    if (botaoVoltar) botaoVoltar.style.display = "block";
}

function voltarSistemaSolar() {
    planetaSelecionado = null;
    retornandoCamera = true;

    if (painelPlaneta) painelPlaneta.classList.remove("ativo");
    if (botaoVoltar) botaoVoltar.style.display = "none";
    if (nomePlaneta) nomePlaneta.textContent = "Selecione um planeta";
}

if (botaoVoltar) {
    botaoVoltar.addEventListener("click", voltarSistemaSolar);
}

renderizador.domElement.addEventListener("click", selecionarPlaneta);

function animar() {
    requestAnimationFrame(animar);

    if (!animacaoAtiva) return;

    atualizarEstrelasCadentes();

    cinturaoAsteroides.rotation.y += 0.0005;
    sol.rotation.y += 0.0015;
    brilhoSolar.rotation.y -= 0.001;

    planetas.forEach(planeta => {
        planeta.angulo += planeta.velocidade;

        planeta.objeto.position.x =
            Math.cos(planeta.angulo) * planeta.distancia;

        planeta.objeto.position.z =
            Math.sin(planeta.angulo) * planeta.distancia;

        planeta.objeto.rotation.y += 0.005;
    });

    brilhosPlanetas.forEach(item => {
        const pulsacao = (
            Math.sin(Date.now() * 0.002 + item.fase) + 1
        ) / 2;

        item.brilho.material.opacity = 0.2 + pulsacao * 0.3;
        item.atmosfera.material.opacity = 0.06 + pulsacao * 0.12;
    });

    estrelasDistantes.rotation.y += 0.000015;
    estrelasProximas.rotation.y += 0.00003;

    nebulosas.forEach((nebulosa, indice) => {
        nebulosa.material.rotation += indice % 2 === 0
            ? 0.0001
            : -0.0001;
    });

    if (planetaSelecionado) {
        retornandoCamera = false;

        const posicaoMundo = new THREE.Vector3();

        planetaSelecionado.objeto.getWorldPosition(posicaoMundo);

        const distanciaAproximacao = Math.max(
            planetaSelecionado.dados.tamanho * 5,
            3
        );

        const direcaoCamera = new THREE.Vector3(1, 0.6, 1).normalize();

        const posicaoDesejada = posicaoMundo.clone().add(
            direcaoCamera.multiplyScalar(distanciaAproximacao)
        );

        camera.position.lerp(posicaoDesejada, 0.025);
        alvoCamera.lerp(posicaoMundo, 0.04);

        camera.lookAt(alvoCamera);

    } else if (retornandoCamera) {
        const distanciaHorizontal = distanciaCamera * Math.cos(anguloVertical);

        const posicaoInicial = new THREE.Vector3(
            distanciaHorizontal * Math.sin(anguloHorizontal),
            distanciaCamera * Math.sin(anguloVertical),
            distanciaHorizontal * Math.cos(anguloHorizontal)
        );

        camera.position.lerp(posicaoInicial, 0.035);
        alvoCamera.lerp(new THREE.Vector3(0, 0, 0), 0.035);

        camera.lookAt(alvoCamera);

        if (
            camera.position.distanceTo(posicaoInicial) < 0.1 &&
            alvoCamera.length() < 0.1
        ) {
            retornandoCamera = false;
            camera.position.copy(posicaoInicial);
            alvoCamera.set(0, 0, 0);
            camera.lookAt(alvoCamera);
        }

    } else if (!arrastando) {
        atualizarCamera();
    }

    renderizador.render(cena3D, camera);
}

atualizarCamera();
animar();

window.addEventListener("resize", () => {
    const largura = elementoCena.clientWidth;
    const altura = elementoCena.clientHeight;

    if (!largura || !altura) return;

    camera.aspect = largura / altura;
    camera.updateProjectionMatrix();

    renderizador.setSize(largura, altura);
    renderizador.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});
