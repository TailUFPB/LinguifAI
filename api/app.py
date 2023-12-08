from flask import Flask, jsonify, request
from flask_cors import CORS
from DataProcesser import DataProcesser
from Neural_Network2 import create_and_train_model
from available_classifiers import get_available_classifiers

import os
import atexit
import threading
import pandas as pd
import nltk
import json
nltk.download('wordnet')

app = Flask(__name__)
server_thread = None
CORS(app)  # Permite todas as origens por padrão (não recomendado para produção)

app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

data_processer = DataProcesser()

def run_flask_app():
    global server_thread
    app.run(host='0.0.0.0', port=5000, debug=True, use_reloader=False)

def shutdown_server():
    print("Server shutting down...")
    os.kill(os.getpid(), 9)

@app.route('/', methods=['GET'])
def hello_world():
    return jsonify("Hello, world!")

@app.route('/classify', methods=["POST"])
def upload_file():
    received_data = request.get_json()

    selected_data = received_data.get('data')
    selected_classifier = int(received_data.get('classifier'))

    df = pd.DataFrame(selected_data, columns=['input_column'])
    result = data_processer.handle_classify(df, selected_classifier)
    stats = data_processer.generate_statistics(result)

    return jsonify({'result': result.to_json(), 'stats': stats})

@app.route('/get-classifiers', methods=["GET"])
def get_classifiers():
    classifiers = get_available_classifiers()
    return jsonify(classifiers)

@app.get('/shutdown')
def shutdown():
    shutdown_server()
    return 'Server shutting down...'

@app.route('/neural-network',methods=["POST"])
def train_model():
    received_data = request.get_json()
    selected_data = received_data.get('data')
    selected_label = received_data.get('label')
    name = received_data.get('name')
    return create_and_train_model(selected_data,selected_label,name)

if __name__ == '__main__':
    server_thread = threading.Thread(target=run_flask_app)
    server_thread.start()
    atexit.register(shutdown_server)
