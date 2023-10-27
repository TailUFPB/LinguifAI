from flask import Flask, jsonify, request
from flask_cors import CORS
from DataProcesser import DataProcesser

import os
import pandas as pd
import nltk
import json
nltk.download('wordnet')

app = Flask(__name__)
CORS(app)  # Permite todas as origens por padrão (não recomendado para produção)

UPLOAD_FOLDER = './uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

data_processer = DataProcesser()


@app.route('/', methods=['GET'])
def hello_world():
    return jsonify("Hello, world!")


@app.route('/classify', methods=["POST"])
def upload_file():
    received_data = request.get_json()

    selected_data = received_data.get('data')
    selected_classifier = received_data.get('classifier')

    print("selected data: ", selected_data)
    print("selected classifier: ", selected_classifier)

    df = pd.DataFrame(selected_data, columns=['input_column'])
    result = data_processer.handle_classify(df, selected_classifier)

    return jsonify({'result': result.to_json()})


@app.route('/nb-news-model', methods=["POST"])
def news_model():
    result = data_processer.nb_news_application()
    result_json = result.to_json()
    return jsonify({"result": result_json})

@app.route('/nb-emotions-model', methods=["POST"])
def emotions_model():
    result = data_processer.classify_emotions()
    return jsonify({"result": result.to_json()})

@app.route('/lin-regression-model', methods=["POST"])
def lin_regression_model():
    result = data_processer.lin_regression_model()
    return jsonify({"result": result.to_json()})



if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)
