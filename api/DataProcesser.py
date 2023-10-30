import pandas as pd
from NbNewsModel import NbNewsModel
from NbEmotionsModel import make_prediction
from NbLinRegressionModel import make_prediction_nblin
import nltk
import re
from nltk.corpus import stopwords
# mais imports


class DataProcesser():

    df = pd.DataFrame()
    input_column = ''
    stopwordsenglish = nltk.corpus.stopwords.words('english')

    def handle_classify(self, df, classifier):
        if classifier == 'a':
            return self.classify_emotions(df)
        elif classifier == 'b':
            return self.nb_news_application(df)

    def preprocess_text(self, texto):
        if self.input_column is not None:  # Verifique se a coluna foi definida
            # tiro tudo que não for texto e espaço
            texto = re.sub('[^a-z\s]', '', texto.lower())
            # tokenizo em palavras e elimino as stopwords
            palavras = [w for w in texto.split(
            ) if w not in set(self.stopwordsenglish)]
            palavras = [w for w in texto if nltk.corpus.wordnet.synsets(w)]
            # texto_junto = ' '.join(texto)
            # junto as palavras novamente com espaços
            return ' '.join(palavras)
        else:
            return "Coluna não escolhida. Escolha a coluna primeiro."

    def nb_news_application(self, df):
        nb_model = NbNewsModel(df)
        df_result = nb_model.filter_and_classify()
        return df_result

    def classify_emotions(self, df):
        df['output_column'] = df['input_column'].apply(
            self.preprocess_text).apply(make_prediction)
        result_csv = df  # converte o df pra csv
        return result_csv

    def lin_regression_model(self, df):
        df['output_column'] = df['input_column'].apply(
            self.preprocess_text).apply(make_prediction_nblin)
        result_csv = df  # converte o df pra csv
        return result_csv


    # TODO métodos com o processamento de classificação
