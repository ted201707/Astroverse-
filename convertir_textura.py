import base64
from pathlib import Path

pasta_projeto = Path(__file__).resolve().parent
planetas = ["neptuno", "urano"]

for planeta in planetas:
    caminho_imagem = pasta_projeto / "img" / f"{planeta}.jpg"
    if not caminho_imagem.exists():
        print(f"Imagem não encontrada: {caminho_imagem}")
        continue

    with open(caminho_imagem, "rb") as imagem:
        dados = base64.b64encode(imagem.read()).decode("ascii")

    nome_variavel = f"textura{planeta.capitalize()}Base64"
    caminho_saida = pasta_projeto / "JavaScript" / f"textura_{planeta}.js"

    with open(caminho_saida, "w", encoding="utf-8") as arquivo:
        arquivo.write(f'const {nome_variavel} = "data:image/jpeg;base64,{dados}";')

    print(f"Textura de {planeta} convertida com sucesso")
