import json
import re
import string
import pandas as pd
import numpy as np
import tensorflow as tf
import os
import joblib
import keras

from sklearn.feature_extraction.text import TfidfVectorizer

from tensorflow.python.keras import layers
from tensorflow.python.keras.models import Sequential
from sklearn.preprocessing import LabelEncoder
from tensorflow.python.keras.callbacks import Callback

dirname = os.path.dirname(__file__)

def preprocess_text(text):
    text = str(text).lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W", " ", text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

class TrainingProgressCallback(Callback):
    def __init__(self, epochs):
        super(TrainingProgressCallback, self).__init__()
        self.epochs = epochs
        self.epoch_num = 0

    def on_epoch_begin(self, epoch, logs=None):
        self.epoch_step = 0

    def on_epoch_end(self, epoch, logs=None):
        self.epoch_num += 1

    def on_batch_end(self, batch, logs=None):
        self.epoch_step += 1
        progress = self.epoch_step / self.params["steps"] / self.epochs * 100 + self.epoch_num / self.epochs * 100

        training_progress = {
            'training_progress': progress,
            'training_in_progress': True
        }
        with open('training_progress.json', 'w') as file:
            json.dump(training_progress, file)
        # print(progress)
        # with open('training_progress.json', 'w') as file:
        #     json.dump(training_progress, file)


def create_and_train_model(train_texts, train_labels, name, epochs=5, batch_size=32, learning_rate=0.001):
    label_encoder = LabelEncoder()
    train_labels_encoded = label_encoder.fit_transform(train_labels)

    num_classes = len(label_encoder.classes_)
    train_labels_one_hot = tf.keras.utils.to_categorical(train_labels_encoded, num_classes=num_classes)

    label_mapping_file = f"api/encoders/LabelMapping-{name}.joblib"
    joblib.dump(label_encoder, label_mapping_file)

    tfidf_vectorizer = TfidfVectorizer(max_features=20000)
    
    train_texts = [preprocess_text(text) for text in train_texts]
    train_texts_tfidf = tfidf_vectorizer.fit_transform(train_texts)

    train_dataset = tf.data.Dataset.from_tensor_slices((train_texts_tfidf.toarray(), train_labels_one_hot))
    train_dataset = train_dataset.shuffle(len(train_texts)).batch(32)

    # Parâmetros do modelo
    num_features = train_texts_tfidf.shape[1]

    # Define a arquitetura do modelo
    model = tf.keras.Sequential([
        tf.keras.layers.Dense(64, activation='relu', input_shape=(num_features,)),
        tf.keras.layers.Dense(num_classes, activation='softmax')
    ])


    model.compile(loss="categorical_crossentropy", optimizer=keras.optimizers.Adam(learning_rate=learning_rate), metrics=["accuracy"])

    try:
        progress_callback = TrainingProgressCallback(epochs=epochs)
        
        # history = model.fit(train_dataset, epochs=epochs, batch_size=batch_size, verbose=2)

        history = model.fit(train_dataset, epochs=epochs, batch_size=batch_size, verbose=2, callbacks=[progress_callback])

        model_filename = f"api/models/{str(num_classes)}-Trained-Model-{name}.weights.h5"
        model.save_weights(model_filename)

        training_stats = {
            "loss": history.history['loss'],
            "accuracy": history.history['accuracy']
        }

        return json.dumps(training_stats)

    except Exception as e:
        return f"Error during model creation/training: {str(e)}"

