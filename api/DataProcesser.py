from NbNewsModel import news_prediction
from NbEmotionsModel import make_prediction
from NbLinRegressionModel import make_prediction_nblin
from available_classifiers import get_available_classifiers
from tensorflow.keras.models import load_model

import pandas as pd
import numpy as np
import tensorflow as tf
import pickle
import nltk
import re
from nltk.corpus import stopwords
# mais imports

class DataProcesser():
    df = pd.DataFrame()
    input_column = ''
    stopwords_english = stopwords.words('english')

    def handle_classify(self, df, classifier):
        classifier_switcher = get_available_classifiers() # id: nome_arquivo
        model_name = classifier_switcher[classifier]
        if model_name.endswith('.pkl'):
            return self.pretrained_predict(df, model_name)
        elif model_name.endswith('.keras'):
            return self.trained_predict(df, model_name)
        #classifier_switcher = {
        #    0: self.classify_emotions,
        #    1: self.nb_news_application,
        #    2: self.lin_regression_model
        #}

        #return classifier_switcher.get(classifier, lambda: "Invalid Classifier")(df)

    def generate_statistics(self, df):
        unique_labels = df['output_column'].unique()

        statistics = {
            'total_rows': len(df),
            'unique_labels': list(unique_labels),
            'label_counts': df['output_column'].value_counts().to_dict()
        }

        return statistics

    def preprocess_text(self, texto):
        if self.input_column is not None:  # Verifique se a coluna foi definida
            # tiro tudo que não for texto e espaço
            texto = re.sub('[^a-z\s]', '', texto.lower())
            # tokenizo em palavras e elimino as stopwords
            palavras = [w for w in texto.split(
            ) if w not in set(self.stopwords_english)]
            palavras = [w for w in texto if nltk.corpus.wordnet.synsets(w)]
            # texto_junto = ' '.join(texto)
            # junto as palavras novamente com espaços
            return ''.join(palavras)
        else:
            return "Coluna não escolhida. Escolha a coluna primeiro."

    def classify_emotions(self, df):
        df['output_column'] = df['input_column'].apply(make_prediction)
        return df

    def lin_regression_model(self, df):
        df['output_column'] = df['input_column'].apply(make_prediction_nblin)
        return df

    def nb_news_application(self, df):
        df['output_column'] = df['input_column'].apply(news_prediction)
        return df

    def pretrained_predict(self, df, model_name):
        model_file = f'api/models/{model_name}'
        with open(model_file, 'rb') as model:
            pipeline = pickle.load(model)

        texts_to_predict = df['input_column']
        predictions = pipeline.predict(texts_to_predict)
        df['output_column'] = predictions
        return df

    def trained_predict(self, df, model_name):
        model_file = f'api/models/{model_name}'
        model = load_model(model_file)

        raw_text = df['input_column'].tolist()

        predictions = model.predict(raw_text)
        predicted_labels = tf.argmax(predictions, axis=1).numpy()

        df['output_column'] = predicted_labels.astype(str)

        return df
    ##TODO métodos com o processamento de classificação
