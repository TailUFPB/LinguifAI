import json
import re
import string
import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.layers import TextVectorization
from tensorflow.keras.models import Sequential
from sklearn.preprocessing import LabelEncoder

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

def create_and_train_model(train_texts, train_labels, name, epochs=5):
    label_encoder = LabelEncoder()
    train_labels_encoded = label_encoder.fit_transform(train_labels)

    num_classes = len(label_encoder.classes_)
    train_labels_one_hot = tf.keras.utils.to_categorical(train_labels_encoded, num_classes=num_classes)

    #print(train_texts)
    #print(train_labels_one_hot)

    # Aplica o pré-processamento aos textos
    #train_df['text'] = train_df['text'].apply(preprocess_text)

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

    # Função para vetorizar o texto e manter os rótulos
    def vectorize_text(text, label):
        text = tf.expand_dims(text, -1)
        return vectorize_layer(text), label

    # Aplica a vetorização ao conjunto de dados de treino
    train_ds = train_dataset.map(vectorize_text)
    train_ds = train_ds.cache().prefetch(buffer_size=tf.data.AUTOTUNE)

    try:
        # Define a arquitetura do modelo
        inputs = tf.keras.Input(shape=(sequence_length,), dtype="int64")
        x = layers.Embedding(max_features, embedding_dim)(inputs)
        x = layers.Dropout(0.5)(x)
        x = layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3)(x)
        x = layers.Conv1D(128, 7, padding="valid", activation="relu", strides=3)(x)
        x = layers.GlobalMaxPooling1D()(x)
        x = layers.Dense(128, activation="relu")(x)
        x = layers.Dropout(0.5)(x)
        predictions = layers.Dense(num_classes, activation="softmax", name="predictions")(x)

        # Cria e compila o modelo
        model = tf.keras.Model(inputs, predictions)
        model.compile(loss="categorical_crossentropy", optimizer="adam", metrics=["accuracy"])

        # Treina o modelo
        history = model.fit(train_ds, epochs=epochs)

        # Salva o modelo
        model_filename = f"models/Trained-Model-{name}.keras"
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

'''
Com o nome do arquivo podemos fazer por exemplo:

saved_model_filename = Neural_Network(texts_train, labels_train)

Carregar o modelo treinado a partir do arquivo:
with open(saved_model_filename, "rb") as model_file:
    loaded_model = pickle.load(model_file)

Agora, podemos usar loaded_model para fazer previsões, por exemplo:
predictions = loaded_model.predict(new_texts)

'''
'''
TESTE:

df_true = pd.read_csv("Linguifai/api/training_df/True.csv")
df_fake = pd.read_csv("Linguifai/api/training_df/Fake.csv")


df_fake = df_fake.drop(['title', 'subject', 'date'], axis=1)
df_true = df_true.drop(['title', 'subject', 'date'], axis=1)


df_fake['text'] = df_fake["text"]
df_true['text'] = df_true["text"]

df_fake_train = df_fake[:5000]
df_true_train = df_true[:5000]

textos = df_fake_train['text'].tolist() + df_true_train['text'].tolist()
labels = [0] * len(df_fake_train) + [1] * len(df_true_train)

create_and_train_model(textos,labels,"Teste")

'''
