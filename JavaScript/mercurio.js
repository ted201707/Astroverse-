const elementoCena = document.getElementById("cena-mercurio");

const cena3D = new THREE.Scene();

const camera = new THREE.PerspectiveCamera(
    45,
    elementoCena.clientWidth / elementoCena.clientHeight,
    0.1,
    100
);

camera.position.set(0, 0, 8);

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

const luzSolar = new THREE.DirectionalLight(0xffe6c4, 2.8);
luzSolar.position.set(5, 3, 5);
cena3D.add(luzSolar);

const luzSecundaria = new THREE.DirectionalLight(0x526aa5, 0.35);
luzSecundaria.position.set(-5, -2, -3);
cena3D.add(luzSecundaria);

const carregadorTextura = new THREE.TextureLoader();

const texturaMercurio = carregadorTextura.load(
    texturaMercurioBase64
);

const geometriaMercurio = new THREE.SphereGeometry(2.5, 96, 96);

const materialMercurio = new THREE.MeshStandardMaterial({
    map: texturaMercurio,
    roughness: 1,
    metalness: 0
});

const mercurio3D = new THREE.Mesh(
    geometriaMercurio,
    materialMercurio
);

cena3D.add(mercurio3D);

const quantidadeEstrelas = 1200;
const posicoesEstrelas = [];

for (let i = 0; i < quantidadeEstrelas; i++) {
    const x = (Math.random() - 0.5) * 100;
    const y = (Math.random() - 0.5) * 70;
    const z = -10 - Math.random() * 50;

    posicoesEstrelas.push(x, y, z);
}

const geometriaEstrelas = new THREE.BufferGeometry();

geometriaEstrelas.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(posicoesEstrelas, 3)
);

const materialEstrelas = new THREE.PointsMaterial({
    color: 0xffffff,
    size: 0.08,
    transparent: true,
    opacity: 0.8
});

const estrelas = new THREE.Points(
    geometriaEstrelas,
    materialEstrelas
);

cena3D.add(estrelas);

let arrastando = false;
let posicaoAnteriorMouse = 0;
let velocidadeRotacao = 0.002;

renderizador.domElement.addEventListener("pointerdown", function (evento) {
    arrastando = true;
    posicaoAnteriorMouse = evento.clientX;

    renderizador.domElement.setPointerCapture(evento.pointerId);
});

renderizador.domElement.addEventListener("pointermove", function (evento) {
    if (!arrastando) {
        return;
    }

    const movimento = evento.clientX - posicaoAnteriorMouse;

    mercurio3D.rotation.y += movimento * 0.008;

    posicaoAnteriorMouse = evento.clientX;
});

renderizador.domElement.addEventListener("pointerup", function () {
    arrastando = false;
});

renderizador.domElement.addEventListener("pointercancel", function () {
    arrastando = false;
});

renderizador.domElement.addEventListener("lostpointercapture", function () {
    arrastando = false;
});

function animar() {
    requestAnimationFrame(animar);

    if (!arrastando) {
        mercurio3D.rotation.y += velocidadeRotacao;
    }

    estrelas.rotation.z += 0.00001;

    renderizador.render(cena3D, camera);
}

animar();

window.addEventListener("resize", function () {
    camera.aspect = elementoCena.clientWidth / elementoCena.clientHeight;

    camera.updateProjectionMatrix();

    renderizador.setSize(
        elementoCena.clientWidth,
        elementoCena.clientHeight
    );
});