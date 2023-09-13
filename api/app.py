from flask import Flask, jsonify, request
from flask_cors import CORS


app = Flask(__name__)
CORS(app)  # Permite todas as origens por padrão (não recomendado para produção)


filmes = [
    "O Senhor dos Anéis: A Sociedade do Anel",
    "Pulp Fiction: Tempo de Violência",
    "Interestelar",
    "A Origem",
    "Matrix",
    "Jurassic Park",
    "Star Wars: O Império Contra-Ataca",
    "Cidade de Deus",
    "Clube da Luta",
    "Forrest Gump: O Contador de Histórias",
    "O Poderoso Chefão",
    "Gladiador",
    "A Lista de Schindler",
    "E o Vento Levou",
    "Avatar",
    "Titanic",
    "Pantera Negra",
    "Os Vingadores",
    "A Origem dos Guardiões",
    "Harry Potter e a Pedra Filosofal",
]


@app.route('/', methods=['GET'])
def hello_world():

    search_param = request.args.get('searchParam')

    if search_param:
        return jsonify([filme for filme in filmes if search_param.lower() in filme.lower()])

    return jsonify(filmes)


if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
