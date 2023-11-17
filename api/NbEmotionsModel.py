import pandas as pd
import pickle

# bag of words
from sklearn.feature_extraction.text import TfidfVectorizer

#tfidf_vectorizer = TfidfVectorizer(use_idf=True)

def make_prediction(my_sentence):
    with open("./models/nb_emotion.pkl", "rb") as f:
        model = pickle.load(f)

    with open("./models/tfidf_vectorizer_em.pkl", 'rb') as f:
        tfidf_vectorizer = pickle.load(f)

    new_sentence = tfidf_vectorizer.transform([my_sentence])
    prediction = model.predict(new_sentence)
    return prediction[0]