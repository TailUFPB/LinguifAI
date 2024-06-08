from flask import Flask, jsonify, request
from flask_cors import CORS
from DataProcesser import DataProcesser
from Neural_Network2 import create_and_train_rnn_model
from Neural_Network import create_and_train_nb_model
from available_classifiers import get_available_classifiers

import time
import os
import pandas as pd
import nltk
import json
import asyncio
import logging
nltk.download('wordnet')


app = Flask(__name__)
server_thread = None
CORS(app)  # Permite todas as origens por padrão (não recomendado para produção)

log = logging.getLogger('werkzeug')
log.disabled = True


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
    # stats = data_processer.generate_statistics(result)

    return jsonify({'result': result.to_json()})
    # return jsonify({'result': result.to_json(), 'stats': stats})

@app.route('/get-classifiers', methods=["GET"])
def get_classifiers():
    classifiers = get_available_classifiers()
    return jsonify(classifiers)

@app.get('/shutdown')
def shutdown():
    shutdown_server()
    return 'Server shutting down...'

@app.route('/neural-network-rnn', methods=["POST"])
def train_rnn_model():
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
        'training_in_progress': True,
        'cancel_requested': False
    }
    with open('training_progress.json', 'w') as file:
        json.dump(training_progress, file)

    df = pd.DataFrame({'input_text': selected_data, 'labels': selected_label})

    create_and_train_rnn_model(df, name, epochs, batch_size, learning_rate)
        
    return jsonify({"message": "Model train started successfully."}), 200 

@app.route('/neural-network-nb', methods=["POST"])
def train_nb_model():
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

    df = pd.DataFrame({'input_text': selected_data, 'labels': selected_label})

    create_and_train_nb_model(df, name, epochs, batch_size, learning_rate)
        
    return jsonify({"message": "Model train started successfully."}), 200 

@app.route('/training-status', methods=['GET'])
def get_training_status():
    try:
        with open('training_progress.json', 'r') as file:
            try:
                data = json.load(file)
            except json.decoder.JSONDecodeError:
                try:
                    time.sleep(1)
                    data = json.load(file)
                except json.decoder.JSONDecodeError:
                    try:
                        time.sleep(1)
                        data = json.load(file)
                    except json.decoder.JSONDecodeError:
                        print("error!")
                        return jsonify({'training_in_progress': True, 'training_progress': 0})
            training_status = data.get('training_in_progress', False)
            progress = data.get('training_progress', 0)
            cancel_request = data.get('cancel_requested', False)
            train_losses = data.get('train_losses', [])
            valid_losses = data.get('valid_losses', [])
            return jsonify({'training_in_progress': training_status, 'training_progress': progress, 'cancel_requested': cancel_request, 'train_losses': train_losses,'valid_losses': valid_losses,})
    except FileNotFoundError:
        return jsonify({'training_in_progress': False, 'training_progress': 0, 'cancel_requested': False, 'train_losses': [],'valid_losses': []})
    
@app.route('/cancel-training', methods=['POST'])
def cancel_training():
    try:
        with open('training_progress.json', 'r+') as file:
            data = json.load(file)
            data['cancel_requested'] = True
            file.seek(0)
            json.dump(data, file)
            file.truncate()
        return jsonify({'message': 'Cancellation requested.'}), 200
    except Exception as e:
        return jsonify({'error': str(e)}), 500


if __name__ == '__main__':
    training_progress = {
        'training_progress': 0,
        'training_in_progress': True
    }
    with open('training_progress.json', 'w') as file:
        json.dump(training_progress, file)
    app.run(host='0.0.0.0', port=5000, debug=False)