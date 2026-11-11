
const elementoCena = document.getElementById("cena-planeta");

if (elementoCena && typeof THREE !== "undefined") {
    const identificadorPlaneta = elementoCena.dataset.planeta;

    const configuracoesPlanetas = {
        mercurio: { corLuz: 0xffe6c4, tamanho: 2.5 },
        venus: { corLuz: 0xffd39b, tamanho: 2.5 },
        terra: { corLuz: 0xffffff, tamanho: 2.5 },
        marte: { corLuz: 0xffc6a5, tamanho: 2.5 },
        jupiter: { corLuz: 0xffd5a0, tamanho: 2.8 },
        saturno: { corLuz: 0xffe6b5, tamanho: 2.7 },
        urano: { corLuz: 0xa8f5ff, tamanho: 2.6 },
        netuno: { corLuz: 0x9dbbff, tamanho: 2.6 }
    };

    const texturasDisponiveis = {
        mercurio: typeof texturaMercurioBase64 !== "undefined" ? texturaMercurioBase64 : null,
        venus: typeof texturaVenusBase64 !== "undefined" ? texturaVenusBase64 : null,
        terra: typeof texturaTerraBase64 !== "undefined" ? texturaTerraBase64 : null,
        marte: typeof texturaMarteBase64 !== "undefined" ? texturaMarteBase64 : null,
        jupiter: typeof texturaJupiterBase64 !== "undefined" ? texturaJupiterBase64 : null,
        saturno: typeof texturaSaturnoBase64 !== "undefined" ? texturaSaturnoBase64 : null,
        urano: typeof texturaUranoBase64 !== "undefined" ? texturaUranoBase64 : null,
        netuno: typeof texturaNeptunoBase64 !== "undefined" ? texturaNeptunoBase64 : null
    };

    const configuracaoAtual = configuracoesPlanetas[identificadorPlaneta];
    const texturaAtual = texturasDisponiveis[identificadorPlaneta];

    if (configuracaoAtual && texturaAtual) {
        const larguraInicial = elementoCena.clientWidth;
        const alturaInicial = elementoCena.clientHeight;

        if (larguraInicial && alturaInicial) {
            const cena3D = new THREE.Scene();

            const camera = new THREE.PerspectiveCamera(
                45,
                larguraInicial / alturaInicial,
                0.1,
                100
            );

            camera.position.set(0, 0, 8);

            const renderizador = new THREE.WebGLRenderer({
                antialias: true,
                alpha: true
            });

            renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            renderizador.setSize(larguraInicial, alturaInicial);

            elementoCena.appendChild(renderizador.domElement);

            const luzAmbiente = new THREE.AmbientLight(0xffffff, 0.25);
            cena3D.add(luzAmbiente);

            const luzSolar = new THREE.DirectionalLight(
                configuracaoAtual.corLuz,
                2.8
            );

            luzSolar.position.set(5, 3, 5);
            cena3D.add(luzSolar);

            const luzSecundaria = new THREE.DirectionalLight(0x526aa5, 0.35);
            luzSecundaria.position.set(-5, -2, -3);
            cena3D.add(luzSecundaria);

            const geometria = new THREE.SphereGeometry(
                configuracaoAtual.tamanho,
                96,
                96
            );

            const material = new THREE.MeshStandardMaterial({
                roughness: 1,
                metalness: 0
            });

            const planeta3D = new THREE.Mesh(geometria, material);
            cena3D.add(planeta3D);

            const carregadorTextura = new THREE.TextureLoader();

            carregadorTextura.load(
                texturaAtual,
                function(textura) {
                    material.map = textura;
                    material.needsUpdate = true;
                },
                undefined,
                function(erro) {
                    console.error("Erro ao carregar a textura:", erro);
                }
            );

            if (identificadorPlaneta === "saturno") {
                const geometriaAneis = new THREE.RingGeometry(
                    configuracaoAtual.tamanho * 1.35,
                    configuracaoAtual.tamanho * 2.2,
                    128
                );

                const materialAneis = new THREE.MeshStandardMaterial({
                    color: 0xcbb88a,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.85,
                    roughness: 1
                });

                const aneis = new THREE.Mesh(geometriaAneis, materialAneis);
                aneis.rotation.x = Math.PI / 2;
                cena3D.add(aneis);
            }

            if (identificadorPlaneta === "urano") {
                const geometriaAneis = new THREE.RingGeometry(
                    configuracaoAtual.tamanho * 1.45,
                    configuracaoAtual.tamanho * 1.8,
                    128
                );

                const materialAneis = new THREE.MeshStandardMaterial({
                    color: 0xa8c8d0,
                    side: THREE.DoubleSide,
                    transparent: true,
                    opacity: 0.35,
                    roughness: 1
                });

                const aneis = new THREE.Mesh(geometriaAneis, materialAneis);
                aneis.rotation.x = Math.PI / 2;
                cena3D.add(aneis);
            }

            const posicoesEstrelas = [];

            for (let i = 0; i < 1200; i++) {
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

            renderizador.domElement.style.touchAction = "pan-y";

            renderizador.domElement.addEventListener("pointerdown", function(evento) {
                arrastando = true;
                posicaoAnteriorMouse = evento.clientX;
                renderizador.domElement.setPointerCapture(evento.pointerId);
            });

            renderizador.domElement.addEventListener("pointermove", function(evento) {
                if (!arrastando) return;

                const movimento = evento.clientX - posicaoAnteriorMouse;

                planeta3D.rotation.y += movimento * 0.008;
                posicaoAnteriorMouse = evento.clientX;
            });

            ["pointerup", "pointercancel", "lostpointercapture"].forEach(function(tipo) {
                renderizador.domElement.addEventListener(tipo, function() {
                    arrastando = false;
                });
            });

            function animar() {
                requestAnimationFrame(animar);

                if (!arrastando) {
                    planeta3D.rotation.y += 0.002;
                }

                estrelas.rotation.z += 0.00001;

                renderizador.render(cena3D, camera);
            }

            animar();

            window.addEventListener("resize", function() {
                const largura = elementoCena.clientWidth;
                const altura = elementoCena.clientHeight;

                if (!largura || !altura) return;

                camera.aspect = largura / altura;
                camera.updateProjectionMatrix();

                renderizador.setSize(largura, altura);
                renderizador.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
            });
        } else {
            console.error("A área 3D não possui dimensões válidas.");
        }
    } else {
        console.error("Configuração ou textura não encontrada:", identificadorPlaneta);
    }
} else {
    console.error("Elemento da cena ou biblioteca Three.js não encontrado.");
}
