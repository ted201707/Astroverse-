
const formulario = document.getElementById("form-suporte");
const resultado = document.getElementById("resultado-form");

if (formulario && resultado) {
    formulario.addEventListener("submit", function(evento) {
        evento.preventDefault();

        if (!formulario.checkValidity()) {
            formulario.reportValidity();
            resultado.textContent = "Por favor, confira os campos obrigatórios.";
            resultado.className = "mensagem-erro";
            return;
        }

        const nome = document.getElementById("nome").value.trim();
        const email = document.getElementById("email").value.trim();
        const assunto = document.getElementById("assunto").value;
        const mensagem = document.getElementById("mensagem-contato").value.trim();

        const registro = {
            nome: nome,
            email: email,
            assunto: assunto,
            mensagem: mensagem,
            data: new Date().toLocaleString("pt-BR")
        };

        const mensagens = JSON.parse(
            localStorage.getItem("astroverse_mensagens_suporte") || "[]"
        );

        mensagens.push(registro);

        localStorage.setItem(
            "astroverse_mensagens_suporte",
            JSON.stringify(mensagens)
        );

        resultado.textContent = `Obrigado, ${nome}! Sua mensagem foi registrada nesta demonstração.`;
        resultado.className = "mensagem-sucesso";

        formulario.reset();

        resultado.scrollIntoView({
            behavior: "smooth",
            block: "center"
        });
    });
}
