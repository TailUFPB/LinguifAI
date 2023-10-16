import pandas as pd
from NbNewsModel import news_prediction
from NbEmotionsModel import make_prediction
from io import BytesIO
import nltk
import re
from nltk.corpus import stopwords
#mais imports

class DataProcesser():

    df = pd.DataFrame()
    input_column = 'short_description'
    stopwordsenglish = nltk.corpus.stopwords.words('english')

    def set_current_file(self, file):
        bytes_io = BytesIO(file)
        df = pd.read_csv(bytes_io)
        self.df = df

    def set_input_column(self, column):
        self.df.input_column = column

    def preprocess_text(self, texto):
        if self.input_column is not None:  # Verifique se a coluna foi definida
            texto = re.sub('[^a-z\s]', '', texto.lower()) # tiro tudo que não for texto e espaço
            palavras = [w for w in texto.split() if w not in set(self.stopwordsenglish)] # tokenizo em palavras e elimino as stopwords
            palavras = [w for w in texto if nltk.corpus.wordnet.synsets(w)]
            #texto_junto = ' '.join(texto)
            return ' '.join(palavras) # junto as palavras novamente com espaços
        else:
            return "Coluna não escolhida. Escolha a coluna primeiro."

    def classify_emotions(self):
      self.df['coluna_classificada'] = self.df[self.input_column].apply(self.preprocess_text).apply(make_prediction)
      result_csv = self.df# converte o df pra csv
      return result_csv


    def nb_news_application(self):
        self.df['coluna_classificada'] = self.df[self.input_column].apply(self.preprocess_text).apply(news_prediction)
        result_csv = self.df
        return result_csv

    ##TODO métodos com o processamento de classificação