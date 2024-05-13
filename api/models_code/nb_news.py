import pandas as pd
import pickle
from sklearn.pipeline import make_pipeline

# bag of words
from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

df = pd.read_csv("../training_df/nb_news.csv")

# Dividindo os dados em um conjunto de treinamento e um conjunto de teste
x = df['short_description']
y = df['category']

X_train, X_test, y_train, y_test = train_test_split(x, y, test_size=0.2, random_state=42)

# Criando um pipeline com o vetorizador TF-IDF e o classificador Multinomial Naive Bayes
pipeline = make_pipeline(TfidfVectorizer(), MultinomialNB())

# Ajustando o modelo ao conjunto de treinamento
pipeline.fit(X_train, y_train)

# Salvando o pipeline em um arquivo .pkl
with open("../models/text_classification_pipeline.pkl", "wb") as model_file:
    pickle.dump(pipeline, model_file)
