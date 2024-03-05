import pandas as pd
import pickle
from sklearn.pipeline import make_pipeline
from sklearn.feature_extraction.text import CountVectorizer
from sklearn.feature_extraction.text import TfidfVectorizer

# bag of words
from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

df = pd.read_csv('../training_df/tweet_emotions.csv')
train_data, test_data, train_target, test_target = train_test_split(df["content"], df["sentiment"], test_size=0.2, shuffle=True)

# Criando um pipeline com o vetorizador TF-IDF e o classificador Multinomial Naive Bayes
pipeline = make_pipeline(TfidfVectorizer(), MultinomialNB())

# Ajustando o modelo ao conjunto de treinamento
pipeline.fit(train_data, train_target)

# Salvando o pipeline em um arquivo .pkl
with open("../models/emotion_pipeline.pkl", "wb") as model_file:
    pickle.dump(pipeline, model_file)