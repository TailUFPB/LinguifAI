
from NbNewsModel import news_prediction
from NbEmotionsModel import make_prediction
from NbLinRegressionModel import make_prediction_nblin
from available_classifiers import get_available_classifiers
from tensorflow.python.keras.models import load_model

import scipy as sp
import pandas as pd
import numpy as np
import tensorflow as tf
import pickle
import re
import joblib
import string
import os
from sklearn.feature_extraction.text import TfidfVectorizer

import nltk
from nltk.corpus import stopwords
nltk.download('stopwords')
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
        elif model_name.endswith('.h5'):
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
    

    def preprocess_text(self, text):
        text = str(text).lower()
        text = re.sub('\[.*?\]', '', text)
        text = re.sub("\\W", " ", text)
        text = re.sub('https?://\S+|www\.\S+', '', text)
        text = re.sub('<.*?>+', '', text)
        text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
        text = re.sub('\n', '', text)
        text = re.sub('\w*\d\w*', '', text)
        
        return text


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

    def load_weights_and_model(self, name):
        model_filename = f"api/models/{name}"
        num_classes = model_filename[model_filename.index("s") + 2 : model_filename.index("-")]
        model = tf.keras.Sequential([
            tf.keras.layers.Embedding(input_dim=20000, output_dim=128),
            tf.keras.layers.LSTM(64),
            tf.keras.layers.Dense(int(num_classes), activation='softmax')
        ])
        model.load_weights(model_filename)
        return model
    
    def trained_predict(self, df, model_name):
        model = self.load_weights_and_model(model_name)

        
        encoder_name = model_name[model_name.index('l') + 2 : model_name.index('.')]

        label_map_filename = f"api\encoders/LabelMapping-{encoder_name}.joblib"
        label_encoder = joblib.load(label_map_filename)

        raw_text = df['input_column'].tolist()
        
        # prediction (nao sei como fazer agora)                      
        # vectorizer = TfidfVectorizer(max_features=20000)
        # raw_text = [self.preprocess_text(text).encode("utf-8") for text in raw_text]
        # vectorizer.fit_transform(raw_text)
        # vectorized_data = vectorizer.transform(raw_text)

        # vectorized_data = np.asarray(vectorized_data.todense())

        # # Make predictions using the model
    
        # predictions = model.predict(vectorized_data)

        # predicted_labels_encoded = tf.argmax(predictions, axis=1).numpy()

        # predicted_labels = [label_encoder.classes_[label] for label in predicted_labels_encoded]

        # df['output_column'] = predicted_labels

        return df
    

    ##TODO métodos com o processamento de classificação

