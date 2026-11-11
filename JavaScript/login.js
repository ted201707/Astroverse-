
const formularioLogin = document.getElementById("formulario-login");
const formularioCadastro = document.getElementById("formulario-cadastro");

const abaLogin = document.getElementById("aba-login");
const abaCadastro = document.getElementById("aba-cadastro");

const areaFormulario = document.getElementById("area-formulario");
const areaLogado = document.getElementById("area-logado");

const mensagem = document.getElementById("mensagem");
const nomeUsuario = document.getElementById("nome-usuario");
const botaoSair = document.getElementById("botao-sair");

// CHAVES DO LOCALSTORAGE
const CHAVE_USUARIOS = "astroverse_usuarios";
const CHAVE_LOGADO = "astroverse_usuario_logado";

// BUSCAR USUÁRIOS
function obterUsuarios() {
    return JSON.parse(localStorage.getItem(CHAVE_USUARIOS)) || [];
}

// EXIBIR MENSAGEM
function mostrarMensagem(texto, tipo) {
    mensagem.textContent = texto;
    mensagem.className = "mensagem " + tipo;
}

// TROCAR ENTRE LOGIN E CADASTRO
function mostrarLogin() {
    document.getElementById("form-login").classList.remove("escondido");
    document.getElementById("form-cadastro").classList.add("escondido");

    abaLogin.classList.add("ativa");
    abaCadastro.classList.remove("ativa");

    mostrarMensagem("", "");
}

function mostrarCadastro() {
    document.getElementById("form-login").classList.add("escondido");
    document.getElementById("form-cadastro").classList.remove("escondido");

    abaCadastro.classList.add("ativa");
    abaLogin.classList.remove("ativa");

    mostrarMensagem("", "");
}

abaLogin.addEventListener("click", mostrarLogin);
abaCadastro.addEventListener("click", mostrarCadastro);

// CADASTRO
formularioCadastro.addEventListener("submit", function (event) {
    event.preventDefault();

    const nome = document.getElementById("nome-cadastro").value.trim();
    const email = document.getElementById("email-cadastro").value.trim().toLowerCase();
    const senha = document.getElementById("senha-cadastro").value;
    const confirmarSenha = document.getElementById("confirmar-senha").value;

    if (nome.length < 2) {
        mostrarMensagem("Digite um nome válido.", "erro");
        return;
    }

    if (senha.length < 6) {
        mostrarMensagem("A senha precisa ter pelo menos 6 caracteres.", "erro");
        return;
    }

    if (senha !== confirmarSenha) {
        mostrarMensagem("As senhas não coincidem.", "erro");
        return;
    }

    const usuarios = obterUsuarios();

    const usuarioExiste = usuarios.some(usuario => usuario.email === email);

    if (usuarioExiste) {
        mostrarMensagem("Este e-mail já está cadastrado.", "erro");
        return;
    }

    const novoUsuario = {
        nome: nome,
        email: email,
        senha: senha
    };

    usuarios.push(novoUsuario);

    localStorage.setItem(CHAVE_USUARIOS, JSON.stringify(usuarios));

    formularioCadastro.reset();

    mostrarMensagem("Cadastro realizado! Agora você pode entrar.", "sucesso");

    setTimeout(mostrarLogin, 1500);
});

// LOGIN
formularioLogin.addEventListener("submit", function (event) {
    event.preventDefault();

    const email = document.getElementById("email-login").value.trim().toLowerCase();
    const senha = document.getElementById("senha-login").value;

    const usuarios = obterUsuarios();

    const usuario = usuarios.find(function (usuario) {
        return usuario.email === email && usuario.senha === senha;
    });

    if (!usuario) {
        mostrarMensagem("E-mail ou senha incorretos.", "erro");
        return;
    }

    // SALVAR USUÁRIO LOGADO SEM A SENHA
    const usuarioLogado = {
        nome: usuario.nome,
        email: usuario.email
    };

    localStorage.setItem(CHAVE_LOGADO, JSON.stringify(usuarioLogado));

    formularioLogin.reset();

    mostrarAreaLogada();
});

// MOSTRAR ÁREA LOGADA
function mostrarAreaLogada() {
    const usuarioLogado = JSON.parse(localStorage.getItem(CHAVE_LOGADO));

    if (!usuarioLogado) {
        return;
    }

    areaFormulario.classList.add("escondido");
    areaLogado.classList.remove("escondido");

    nomeUsuario.textContent = usuarioLogado.nome;
}

// SAIR DA CONTA
botaoSair.addEventListener("click", function () {
    localStorage.removeItem(CHAVE_LOGADO);

    areaLogado.classList.add("escondido");
    areaFormulario.classList.remove("escondido");

    mostrarLogin();

    mostrarMensagem("Você saiu da sua conta.", "sucesso");
});

// VERIFICAR SE JÁ ESTÁ LOGADO AO ABRIR A PÁGINA
mostrarAreaLogada();
