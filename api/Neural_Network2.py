import json
import re
import string
import pandas as pd
import numpy as np
import tensorflow as tf
import joblib

from tensorflow.keras import layers
from tensorflow.keras.layers import TextVectorization
from tensorflow.keras.models import Sequential
from sklearn.preprocessing import LabelEncoder
from tensorflow.keras.callbacks import Callback
import joblib
def preprocess_text(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

class TrainingProgressCallback(Callback):
    def __init__(self):
        super(TrainingProgressCallback, self).__init__()
        self.batch_count = 0

    def on_batch_end(self, batch, logs=None):
        self.batch_count += 1
        if self.batch_count % 50 == 0:
            self.update_progress(logs)

    def on_epoch_end(self, epoch, logs=None):
        self.update_progress(logs)

    def update_progress(self, logs):
        total_epochs = self.params['epochs']
        current_batch = self.model._train_counter
        total_batches = self.params['steps'] * total_epochs
        percent_complete = int((current_batch / total_batches) * 100)

        # Definir o status de treinamento como True
        training_in_progress = True

        # Verificar se a época atual é a última
        if current_batch == total_batches:
            training_in_progress = False

        # Salvar o progresso em um arquivo JSON
        training_progress = {
            'training_progress': percent_complete,
            'training_in_progress': training_in_progress
        }

        training_progress2 = {
            'training_progress': percent_complete,
            'training_in_progress': training_in_progress,
            'epochs': total_epochs,
            'total_batches': total_batches,
            'current_batch': current_batch
        }

        print(training_progress2)

        with open('training_progress.json', 'w') as file:
            json.dump(training_progress, file)

def create_and_train_model(train_texts, train_labels, name, epochs=5, batch_size=32, batch_size=32):
    label_encoder = LabelEncoder()
    train_labels_encoded = label_encoder.fit_transform(train_labels)

    num_classes = len(label_encoder.classes_)
    train_labels_one_hot = tf.keras.utils.to_categorical(train_labels_encoded, num_classes=num_classes)

    # Salva o mapeamento de rótulos em um arquivo

    label_mapping_file = f"api/encoders/LabelMapping-{name}.joblib"
    joblib.dump(label_encoder, label_mapping_file)

    # Cria um conjunto de dados de texto usando a API de conjuntos de dados do TensorFlow
    train_dataset = tf.data.Dataset.from_tensor_slices((train_texts, train_labels_one_hot))

    # Embaralha e agrupa os dados
    train_dataset = train_dataset.shuffle(len(train_texts)).batch(32)

    # Parâmetros do modelo
    max_features = 20000
    embedding_dim = 128
    sequence_length = 500

    # Cria uma camada de vetorização de texto
    vectorize_layer = TextVectorization(
        max_tokens=max_features,
        output_mode="int",
        output_sequence_length=sequence_length,
    )

    # Adapta a camada de vetorização ao conjunto de dados de texto
    vectorize_layer.adapt(train_dataset.map(lambda x, y: x))

    # Define a arquitetura do modelo
    model = tf.keras.Sequential([
        vectorize_layer,
        layers.Embedding(max_features, embedding_dim),
        layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3),
        layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3),
        layers.GlobalMaxPooling1D(),
        layers.Dense(128, activation="relu"),
        layers.Dropout(0.5),
        layers.Dense(num_classes, activation="softmax", name="predictions")
    ])
    model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

    try:
        progress_callback = TrainingProgressCallback()
        # Treina o modelo
        history = model.fit(train_dataset, epochs=epochs, batch_size=batch_size, callbacks=[progress_callback])

        # Salva o modelo
        model_filename = f"api/models/Trained-Model-{name}.keras"
        model.save(model_filename)

        # Obtém estatísticas do treinamento
        training_stats = {
            "loss": history.history['loss'],
            "accuracy": history.history['accuracy']
        }

        # Retorna estatísticas como JSON
        return json.dumps(training_stats)

    except Exception as e:
        return f"Error during model creation/training: {str(e)}"