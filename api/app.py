from flask import Flask, jsonify, request
from flask_cors import CORS
from DataProcesser import DataProcesser
from Neural_Network2 import create_and_train_model
import os
import nltk
import pandas as pd
import json
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)  # Permite todas as origens por padrão (não recomendado para produção)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER

data_processer = DataProcesser()

@app.route('/', methods=['GET'])
def hello_world():
    return jsonify("Hello, world!")

@app.route('/upload', methods=["POST"])
def upload_file():
    try:
        file = request.files['file']

        if not file:
            raise Exception('Nenhum arquivo detectado')

        if not file.filename.endswith('.csv'):
            raise Exception('Formato de arquivo inválido')

        data_processer.set_current_file(file.read())

        return jsonify({'status_code': 200})
    except Exception as e:
        return jsonify({'status_code': -1, 'error': str(e)})

@app.route('/nb-news-model', methods=["POST"])
def news_model():
    result = data_processer.nb_news_application()
    result_json = result.to_json()
    return jsonify({"result": result_json})

@app.route('/nb-emotions-model', methods=["POST"])
def emotions_model():
    result = data_processer.classify_emotions()
    return jsonify({"result": result.to_json()})

@app.route('/neural-network',methods=["POST"])
def train_model():
    received_data = request.get_json()
    selected_data = received_data.get('data')
    selected_label = received_data.get('label')
    name = received_data.get('name')
    return create_and_train_model(selected_data,selected_label,name) 

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)