from flask import Flask, jsonify, request
from flask_cors import CORS
from DataProcesser import DataProcesser
from Neural_Network2 import create_and_train_rnn_model
from Neural_Network import create_and_train_nb_model
from available_classifiers import get_available_classifiers

import time
import os
from io import StringIO
import sys
import pandas as pd
import nltk
import os
from dotenv import load_dotenv
import json
import openai
import asyncio
import logging
nltk.download('wordnet')


load_dotenv()
app = Flask(__name__)
CORS(app) # CORS(app, resources={r"/*": {"origins": "http://localhost:3000"}})
server_thread = None
openai.api_key = os.getenv('OPEN_AI_KEY')
log = logging.getLogger('werkzeug')
log.disabled = True

selectedFile = None

app.config['JSONIFY_PRETTYPRINT_REGULAR'] = True

data_processer = DataProcesser()


loop = asyncio.get_event_loop()

df = None

def shutdown_server():
    print("Server shutting down...")
    os.kill(os.getpid(), 9)

@app.route('/', methods=['GET'])
def hello_world():
    return jsonify("Hello, world!")


@app.route('/receive', methods=['POST'])
def receive_file():
    global df

    if 'file' not in request.files:
        return jsonify({'error': 'No file part'}), 400
    file = request.files['file']
    if file.filename == '':
        return jsonify({'error': 'No selected file'}), 400
    if file:
        df = pd.read_csv(file)
        return jsonify({'message': 'File uploaded successfully'}), 200



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
    print(build_tree('..'))
    classifiers = get_available_classifiers()
    return jsonify(build_tree('../..')) # should be classifiers but testing for now

def build_tree(directory, indent='', d=0):
    """
    Recursively build directory tree structure as a string.
    """
    if d == 3:
        return ''

    tree = indent + os.path.basename(directory) + '/' + '\n'
    indent += '    '
    try:
        for item in os.listdir(directory):
            if item != 'node_modules' and item != 'dist' and item != 'venv' and item != '.git':
                item_path = os.path.join(directory, item)
                # try:
                #     fake_stdout = StringIO()
                #     sys.stdout = fake_stdout
                #     print(item)
                #     sys.stdout = sys.__stdout__
                # except:
                #     for char in item:
                #         byte_value = ord(char)
                #         print(hex(byte_value), end=' ')
                if os.path.isdir(item_path):
                    tree += build_tree(item_path, indent, d + 1)
                else:
                    tree += indent + item + '\n'
    except:
        pass
    return tree

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

@app.route('/chat', methods=['POST'])
def chat():
    global df
    if df is not None:
        # run rag
        print(df.head(1))
    else:
        print("No df")
    data = request.get_json()
    user_message = data.get('message')
    chat_history = data.get('history', [])

    messages = [{"role": "system", "content": "You are a helpful assistant."}]
    for msg in chat_history:
        messages.append({"role": "user" if msg['origin'] == 'user' else "assistant", "content": msg['text']})
    messages.append({"role": "user", "content": user_message})

    try:
        client = openai.OpenAI(api_key = openai.api_key)
        response = client.chat.completions.create(
            model="gpt-3.5-turbo", # ou a gente poderia ver com gpt 4 mas por enquanto coloquei 3.5
            messages=messages,
            max_tokens=200
        )
        bot_reply = response.choices[0].message.content.strip()

        return jsonify(reply=bot_reply)
    except Exception as e:
        print(f"Error: {e}")
        return jsonify(reply="Desculpe, ocorreu um erro ao processar sua mensagem."), 500


if __name__ == '__main__':
    training_progress = {
        'training_progress': 0,
        'training_in_progress': True
    }
    with open('training_progress.json', 'w') as file:
        json.dump(training_progress, file)
    app.run(host='0.0.0.0', port=5000, debug=False)