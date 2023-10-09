import pandas as pd
import numpy as np
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB
from sklearn.metrics import accuracy_score, classification_report
from sklearn.pipeline import make_pipeline
import seaborn as sns
import matplotlib.pyplot as plt
import nltk
import re
from collections import defaultdict
from nltk.tokenize import word_tokenize
nltk.download('punkt')
nltk.download('stopwords')

stopwords = nltk.corpus.stopwords.words('english')

class NbNewsModel():
    
    def __init__(self, df):
        self.dataframe = df

    def filter_and_classify(self):
        # Encontrando a contagem de ocorrências de cada categoria
        contagem_categorias = self.df['category'].value_counts()

        # Criando uma lista das categorias que têm 500 ou mais ocorrências
        categorias_com_500_ou_mais_ocorrencias = contagem_categorias[contagem_categorias >= 500].index.tolist()

        # Filtrando o DataFrame original para incluir apenas as categorias com 500 ou mais ocorrências
        self.df_filtrado = self.df[self.df['category'].isin(categorias_com_500_ou_mais_ocorrencias)]

        # Agora, df_filtrado contém apenas as categorias com 500 ou mais ocorrências
        # Aplicando o preprocessamento
        self.df_filtrado['tokenizado'] = self.df_filtrado['short_description'].apply(self.tokenize)

        # Inicializando um dicionário para contar as palavras por categoria
        self.contagem_palavras_por_categoria = defaultdict(lambda: defaultdict(int))

        # Iterando sobre cada linha do DataFrame e contando as palavras por categoria

        for idx, row in self.df_filtrado.iterrows():
            categoria = row['category']
            lista_palavras = row['tokenizado']
            for palavra in lista_palavras:
                self.contagem_palavras_por_categoria[categoria][palavra] += 1
        self.contagem_palavras_por_categoria['STYLE']



        self.num_palavras_por_categoria = defaultdict(int)
        for idx, row in self.df_filtrado.iterrows():
            categoria = row['category']
            lista_palavras = row['tokenizado']
            num_palavras = len(lista_palavras)
            self.num_palavras_por_categoria[categoria] += num_palavras

        self.df_filtrado['result'] = self.df_filtrado['short_description'].apply(self.classificando)
        result = self.df_filtrado

        return result


    def tokenize(self, x):
        texto = re.sub(r'\d+', '', x) #Removendo números
        texto = re.sub(r'[^\w\s]', '', texto) #Removendo pontuação
        tokens = word_tokenize(texto)
        return [word for word in tokens if word not in stopwords] #Removendo stopwords
        



    def classificando(self, frase):
        proporcoes_por_categoria = {}
        for categoria in self.contagem_palavras_por_categoria.keys():
            resultado = 1.0  # Inicialize a resultado como 1.0
            for palavra in frase:
                probabilidade_categoria = self.num_palavras_por_categoria[categoria] / sum(self.num_palavras_por_categoria.values())# Probabilidade de ser da categoria
                resultado *= probabilidade_categoria
                # Verificando se a palavra está no dicionário de contagem de palavras por categoria
                if palavra in self.contagem_palavras_por_categoria[categoria]:
                    resultado *= self.contagem_palavras_por_categoria[categoria][palavra] / self.num_palavras_por_categoria[categoria]
                    #Probabilidade da palavra dado que é dá categoria
                else:
                    # Caso a palavra não esteja na categoria, você pode assumir um valor padrão (por exemplo, 1.0)
                    resultado *= 1/self.num_palavras_por_categoria[categoria]  # Pode ajustar este valor conforme necessário
            proporcoes_por_categoria[categoria] = resultado
        
        return max(proporcoes_por_categoria, key=proporcoes_por_categoria.get)