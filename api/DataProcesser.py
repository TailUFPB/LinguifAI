
from NbNewsModel import news_prediction
from NbEmotionsModel import make_prediction
from available_classifiers import get_available_classifiers
from sklearn.pipeline import make_pipeline

# bag of words
from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

import Neural_Network2
import pickle
import re
import joblib
import numpy as np
import os
import pandas as pd
import torch
from collections import Counter
from functools import partial

import nltk
from nltk.tokenize import wordpunct_tokenize
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
            pipeline = self.get_pipeline(model_name)
            return self.pretrained_predict(df, pipeline)
        else:
            return self.trained_predict(df, model_name)
        #classifier_switcher = {
        #    0: self.classify_emotions,
        #    1: self.nb_news_application,
        #    2: self.lin_regression_model
        #}

        #return classifier_switcher.get(classifier, lambda: "Invalid Classifier")(df)

    def get_pipeline(self, model_name):
        if model_name=="emotion_pipeline.pkl":
            df = pd.read_csv('api/training_df/tweet_emotions.csv')
            train_data, test_data, train_target, test_target = train_test_split(df['content'], df['sentiment'], test_size=0.2, shuffle=True)
        elif model_name=="hate_speech.pkl":
            df = pd.read_csv('api/training_df/nb_hatespeech.csv', sep=';')
            train_data, test_data, train_target, test_target = train_test_split(df['comment'], df['isHate'], test_size=0.2, shuffle=True)
        elif model_name=="text_classification_pipeline.pkl":
            df = pd.read_csv('api/training_df/nb_news.csv')
            train_data, test_data, train_target, test_target = train_test_split(df['short_description'], df['category'], test_size=0.2, shuffle=True)
        else:
            return None
        return make_pipeline(TfidfVectorizer(), MultinomialNB()).fit(train_data, train_target)

    def generate_statistics(self, df):
        unique_labels = df['output_column'].unique()

        statistics = {
            'total_rows': len(df),
            'unique_labels': list(unique_labels),
            'label_counts': df['output_column'].value_counts().to_dict()
        }

        return statistics
    

    def preprocess_text(self, text):
        stop_words = set(stopwords.words('english'))
        text = str(text)
        text = re.sub(r'[^\w\s]', '', text)
        text = text.lower()
        tokens = wordpunct_tokenize(text)
        tokens = [token for token in tokens if token not in stop_words]
        return tokens


    def classify_emotions(self, df):
        df['output_column'] = df['input_column'].apply(make_prediction)
        return df

    # def lin_regression_model(self, df):
    #     df['output_column'] = df['input_column'].apply(make_prediction_nblin)
    #     return df

    def nb_news_application(self, df):
        df['output_column'] = df['input_column'].apply(news_prediction)
        return df

    def pretrained_predict(self, df, pipeline):
        texts_to_predict = df['input_column']
        texts_to_predict = [str(text) for text in texts_to_predict]
        predictions = pipeline.predict(texts_to_predict)
        df['output_column'] = predictions
        return df

    def load_weights_and_model(self, name):
        model_filename = os.path.join("api", "models", name)
        if os.path.exists(model_filename):
            model = torch.load(model_filename)
            return model
        else:
            raise FileNotFoundError(f"Model file '{model_filename}' not found.")

    def trained_predict(self, df, model_name):
        label_map_filename = f"api/encoders/LabelMapping-{model_name}.joblib"
        label_encoder = joblib.load(label_map_filename)

        model = self.load_weights_and_model(model_name)
        model.eval()

        stop_words = set(stopwords.words('english'))
        
        df['tokens'] = df.input_column.progress_apply(
            partial(Neural_Network2.tokenize, stop_words=stop_words),
        )

        all_tokens = [sublst for lst in df.tokens.tolist() for sublst in lst]
        common_tokens = set(list(zip(
            *Counter(all_tokens).most_common(20000)))[0])
        df.loc[:, 'tokens'] = df.tokens.progress_apply(
            partial(
                Neural_Network2.remove_rare_words,
                common_tokens=common_tokens,
                max_len=200,
            ),
        )

        df = df[df.tokens.progress_apply(
            lambda tokens: any(token != '<UNK>' for token in tokens),
        )]

        vocab = sorted({
            sublst for lst in df.tokens.tolist() for sublst in lst
        })
        self.token2idx = {token: idx for idx, token in enumerate(vocab)}

        self.token2idx['<PAD>'] = max(self.token2idx.values()) + 1

        self.idx2token = {idx: token for token, idx in self.token2idx.items()}

        df['indexed_tokens'] = df.tokens.apply(
            lambda tokens: [self.token2idx[token] for token in tokens],
        )

        predictions = []
        for input_column_row in df['indexed_tokens']:
            with torch.no_grad():
                _, logits = model([input_column_row], return_activations=True)
                logits = logits.detach().cpu().numpy()
                prediction = np.argmax(logits, axis=1)[0]
                predictions.append(prediction)

        decoded_predictions = label_encoder.inverse_transform(predictions)

        df['output_column'] = decoded_predictions

        return df
    

    ##TODO métodos com o processamento de classificação

