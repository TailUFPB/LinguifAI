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
import asyncio
import logging
nltk.download('wordnet')


# log = logging.getLogger('werkzeug')
# log.setLevel(logging.ERROR)

app = Flask(__name__)
server_thread = None
CORS(app)  # Permite todas as origens por padrão (não recomendado para produção)

app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

data_processer = DataProcesser()

loop = asyncio.get_event_loop()

def run_flask_app():
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
    received_data = request.json

    if received_data:
        selected_data = received_data.get('data')
        selected_label = received_data.get('label')
        epochs = received_data.get('epochs')
        batch_size = received_data.get('batch_size')
        learning_rate = received_data.get('learning_rate')
        name = received_data.get('name')

        #
        print("\n")
        print("Received data: " + str(len(selected_data))) 
        print("Received label: " + str(len(selected_label)))
        print("Name: " + str(name))
        print("Epochs: " + str(epochs))
        print("Batch Size: " + str(batch_size))
        print("Learning Rate: " + str(learning_rate))
        print("\n")
    else:
        return jsonify({"message": "No data received."}), 400

    # reseta status
    training_progress = {
        'training_progress': 0,
        'training_in_progress': True
    }
    with open('training_progress.json', 'w') as file:
        json.dump(training_progress, file)

    print("Beginning training")
    create_and_train_model(selected_data, selected_label, name, epochs, batch_size)
        
    return jsonify({"message": "Model train started successfully."}), 200 

@app.route('/training-status', methods=['GET'])
def get_training_status():
    try:
        with open('training_progress.json', 'r') as file:
            try:
                data = json.load(file)
            except json.decoder.JSONDecodeError:
                return jsonify({'training_in_progress': True, 'training_progress': 0})
            training_status = data.get('training_in_progress', False)
            progress = data.get('training_progress', 0)
            return jsonify({'training_in_progress': training_status, 'training_progress': progress})
    except FileNotFoundError:
        return jsonify({'training_in_progress': False, 'training_progress': 0})


#@app.teardown_appcontext
#def teardown_appcontext(error=None):
    #shutdown_server()

if __name__ == '__main__':
    app.run(host='127.0.0.1', port=5000, debug=True)
    #server_thread = threading.Thread(target=run_flask_app)
    #server_thread.start()