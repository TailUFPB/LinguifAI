import csv
import re
import string
import os
import pandas as pd
import numpy as np
import tensorflow as tf
import pickle
from tensorflow.keras import layers
from tensorflow.keras.layers import TextVectorization
from tensorflow.keras.models import Sequential

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

def create_and_train_model(train_texts, train_labels, epochs=5):
    train_df = pd.DataFrame({'text': train_texts, 'label': train_labels})
    train_df['text'] = train_df['text'].apply(preprocess_text)

    output_directory = 'arquivos_texto_treino_nn'
    os.makedirs(output_directory, exist_ok=True)

    for index, row in train_df.iterrows():
        filename = os.path.join(output_directory, f'texto_{index}.txt')
        with open(filename, 'w', encoding='utf-8') as file:
            file.write(row['text'])

    treino_dir = output_directory

    train_dataset = tf.keras.utils.text_dataset_from_directory(
        treino_dir,
        batch_size=32,
        shuffle=True,
    )

    max_features = 20000
    embedding_dim = 128
    sequence_length = 500

    vectorize_layer = TextVectorization(
        max_tokens=max_features,
        output_mode="int",
        output_sequence_length=sequence_length,
    )

    text_ds = train_dataset.map(lambda x, y: x)
    vectorize_layer.adapt(text_ds)

    def vectorize_text(text, label):
        text = tf.expand_dims(text, -1)
        return vectorize_layer(text), label

    train_ds = train_dataset.map(vectorize_text)
    train_ds = train_ds.cache().prefetch(buffer_size=10)

    inputs = tf.keras.Input(shape=(None,), dtype="int64")
    x = layers.Embedding(max_features, embedding_dim)(inputs)
    x = layers.Dropout(0.5)(x)
    x = layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3)(x)
    x = layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3)(x)
    x = layers.GlobalMaxPooling1D()(x)
    x = layers.Dense(128, activation="relu")(x)
    x = layers.Dropout(0.5)(x)
    predictions = layers.Dense(1, activation="sigmoid", name="predictions")(x)

    model = tf.keras.Model(inputs, predictions)

    model.compile(loss="binary_crossentropy", optimizer="adam", metrics=["accuracy"])
    model.fit(train_ds, epochs=epochs)

    return model
