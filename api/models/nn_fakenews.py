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
from tensorflow.keras.layers import Embedding, LSTM, Dense, Bidirectional
from tensorflow.keras.preprocessing.text import Tokenizer
from tensorflow.keras.preprocessing.sequence import pad_sequences

df_true = pd.read_csv("Linguifai/api/training_df/True.csv")
df_fake = pd.read_csv("Linguifai/api/training_df/Fake.csv")


df_fake = df_fake.drop(['title', 'subject', 'date'], axis=1)
df_true = df_true.drop(['title', 'subject', 'date'], axis=1)

def wordopt(text):
    text = text.lower()
    text = re.sub('\[.*?\]', '', text)
    text = re.sub("\\W"," ",text)
    text = re.sub('https?://\S+|www\.\S+', '', text)
    text = re.sub('<.*?>+', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub('\n', '', text)
    text = re.sub('\w*\d\w*', '', text)
    return text

df_fake['text'] = df_fake["text"].apply(wordopt)
df_true['text'] = df_true["text"].apply(wordopt)

df_fake_train = df_fake[:5000]
df_true_train = df_true[:5000]

df_fake_test = df_fake[5000:10000]
df_true_test = df_true[5000:10000]

# Diretório para salvar os arquivos de texto
output_directory = 'LinguifAI/api/training_df/arquivos_texto_treino_nn/fake'

# Certifique-se de que o diretório exista ou crie-o
os.makedirs(output_directory, exist_ok=True)

# Itera sobre cada linha do DataFrame e salva o texto em um arquivo
for index, row in df_fake_train.iterrows():
    # Cria o nome do arquivo baseado no índice da linha
    filename = os.path.join(output_directory, f'texto_{index}.txt')

    # Abre o arquivo e salva o texto
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(row['text'])

print("Arquivos de texto foram criados com sucesso.")

output_directory = 'LinguifAI/api/training_df/arquivos_texto_treino_nn/true'

# Certifique-se de que o diretório exista ou crie-o
os.makedirs(output_directory, exist_ok=True)

# Itera sobre cada linha do DataFrame e salva o texto em um arquivo
for index, row in df_true_train.iterrows():
    # Cria o nome do arquivo baseado no índice da linha
    filename = os.path.join(output_directory, f'texto_{index}.txt')

    # Abre o arquivo e salva o texto
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(row['text'])


# Diretório para salvar os arquivos de texto
output_directory = 'LinguifAI/api/training_df/arquivos_texto_teste_nn/fake'

# Certifique-se de que o diretório exista ou crie-o
os.makedirs(output_directory, exist_ok=True)

# Itera sobre cada linha do DataFrame e salva o texto em um arquivo
for index, row in df_fake_test.iterrows():
    # Cria o nome do arquivo baseado no índice da linha
    filename = os.path.join(output_directory, f'texto_{index}.txt')

    # Abre o arquivo e salva o texto
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(row['text'])

print("Arquivos de texto foram criados com sucesso.")

output_directory = 'LinguifAI/api/training_df/arquivos_texto_teste_nn/true'

# Certifique-se de que o diretório exista ou crie-o
os.makedirs(output_directory, exist_ok=True)

# Itera sobre cada linha do DataFrame e salva o texto em um arquivo
for index, row in df_true_test.iterrows():
    # Cria o nome do arquivo baseado no índice da linha
    filename = os.path.join(output_directory, f'texto_{index}.txt')

    # Abre o arquivo e salva o texto
    with open(filename, 'w', encoding='utf-8') as file:
        file.write(row['text'])

treino_dir = os.path.join("LinguifAI/api/training_df/arquivos_texto_treino_nn")
teste_dir = os.path.join("LinguifAI/api/training_df/arquivos_texto_teste_nn")

train_dataset = tf.keras.utils.text_dataset_from_directory(
    treino_dir,
    batch_size=32,
    shuffle=True,
)

test_dataset = tf.keras.utils.text_dataset_from_directory(
    teste_dir,
    batch_size=32,
    shuffle=True,
)

# Model constants.
max_features = 20000
embedding_dim = 128
sequence_length = 500

vectorize_layer = TextVectorization(
    max_tokens=max_features,
    output_mode="int",
    output_sequence_length=sequence_length,
)

# Now that the vectorize_layer has been created, call `adapt` on a text-only
# dataset to create the vocabulary. You don't have to batch, but for very large
# datasets this means you're not keeping spare copies of the dataset in memory.

# Let's make a text-only dataset (no labels):
text_ds = train_dataset.map(lambda x, y: x)
# Let's call `adapt`:
vectorize_layer.adapt(text_ds)

def vectorize_text(text, label):
    text = tf.expand_dims(text, -1)
    return vectorize_layer(text), label


# Vectorize the data.
train_ds = train_dataset.map(vectorize_text)
test_ds = test_dataset.map(vectorize_text)

# Do async prefetching / buffering of the data for best performance on GPU.
train_ds = train_ds.cache().prefetch(buffer_size=10)
test_ds = test_ds.cache().prefetch(buffer_size=10)

# A integer input for vocab indices.
inputs = tf.keras.Input(shape=(None,), dtype="int64")

# Next, we add a layer to map those vocab indices into a space of dimensionality
# 'embedding_dim'.
x = layers.Embedding(max_features, embedding_dim)(inputs)
x = layers.Dropout(0.5)(x)

# Conv1D + global max pooling
x = layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3)(x)
x = layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3)(x)
x = layers.GlobalMaxPooling1D()(x)

# We add a vanilla hidden layer:
x = layers.Dense(128, activation="relu")(x)
x = layers.Dropout(0.5)(x)

# We project onto a single unit output layer, and squash it with a sigmoid:
predictions = layers.Dense(1, activation="sigmoid", name="predictions")(x)

model = tf.keras.Model(inputs, predictions)

epochs = 5

# Compile the model with binary crossentropy loss and an adam optimizer.
model.compile(loss="binary_crossentropy", optimizer="adam", metrics=["accuracy"])

# Fit the model using the train and test datasets.
model.fit(train_ds, epochs=epochs)

# Salvando o pipeline em um arquivo .pkl
with open("LinguifAI/api/models/nn_fakenews_model.pkl", "wb") as model_file:
    pickle.dump(model, model_file)
