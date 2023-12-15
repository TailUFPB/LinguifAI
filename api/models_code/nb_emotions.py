import pandas as pd
import pickle

# bag of words
from sklearn.feature_extraction.text import TfidfVectorizer

from sklearn.model_selection import train_test_split
from sklearn.naive_bayes import MultinomialNB

df = pd.read_csv('../training_df/tweet_emotions.csv')
train_data, test_data, train_target, test_target = train_test_split(df["content"], df["sentiment"], test_size=0.2, shuffle=True)

tfidf_vectorizer = TfidfVectorizer(use_idf=True)
X_train_vectors_tfidf = tfidf_vectorizer.fit_transform(train_data)
X_test_vectors_tfidf = tfidf_vectorizer.transform(test_data)

nb_tfidf = MultinomialNB(alpha = 0)
nb_tfidf.fit(X_train_vectors_tfidf, train_target)

with open("../models/nb_emotion.pkl", "wb") as f:
    pickle.dump(nb_tfidf, f)

with open("../models/tfidf_vectorizer_em.pkl", "wb") as f:
    pickle.dump(tfidf_vectorizer, f)