import pandas as pd
from NbNewsModel import news_prediction
from NbEmotionsModel import make_prediction
from NbLinRegressionModel import make_prediction_nblin
import nltk
import re
from nltk.corpus import stopwords
# mais imports

class DataProcesser():
    df = pd.DataFrame()
    input_column = ''
    stopwords_english = stopwords.words('english')

    def handle_classify(self, df, classifier):
        classifier_switcher = {
            0: self.classify_emotions,
            1: self.nb_news_application,
            2: self.lin_regression_model
        }

        return classifier_switcher.get(classifier, lambda: "Invalid Classifier")(df)

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

    ##TODO métodos com o processamento de classificação
