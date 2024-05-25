import re
import os
import joblib
import json
import pickle
from functools import partial
from collections import Counter

import pandas as pd
from nltk.corpus import stopwords
from nltk import wordpunct_tokenize
from tqdm import tqdm
from sklearn.preprocessing import LabelEncoder
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.naive_bayes import MultinomialNB
from sklearn.pipeline import make_pipeline
from sklearn.model_selection import train_test_split
from sklearn.metrics import accuracy_score, classification_report

tqdm.pandas()

import nltk
nltk.download('stopwords')

def tokenize(text, stop_words):
    text = str(text)
    text = re.sub(r'[^\w\s]', '', text)
    text = text.lower()
    tokens = wordpunct_tokenize(text)
    tokens = [token for token in tokens if token not in stop_words]
    return tokens

class CustomDataset:
    def __init__(self, df, max_vocab, max_len, name):
        stop_words = set(stopwords.words('english'))
        
        df['tokens'] = df.input_text.progress_apply(
            partial(tokenize, stop_words=stop_words),
        )

        all_tokens = [token for tokens in df.tokens.tolist() for token in tokens]
        common_tokens = set([token for token, _ in Counter(all_tokens).most_common(max_vocab)])
        df['tokens'] = df.tokens.progress_apply(
            partial(remove_rare_words, common_tokens=common_tokens, max_len=max_len),
        )

        df = df[df.tokens.progress_apply(lambda tokens: any(token != '<UNK>' for token in tokens))]

        df['clean_text'] = df.tokens.apply(lambda tokens: ' '.join(tokens))

        self.text = df.clean_text.tolist()
        self.labels = df.labels.tolist()

        label_encoder = LabelEncoder()
        self.encoded_labels = label_encoder.fit_transform(df['labels'])
        encoder_name = f"LabelMapping-{name}.joblib"
        encoder_filename = os.path.join("api", "encoders", encoder_name)
        os.makedirs(os.path.dirname(encoder_filename), exist_ok=True)
        joblib.dump(label_encoder, encoder_filename)

def remove_rare_words(tokens, common_tokens, max_len):
    return [token if token in common_tokens else '<UNK>' for token in tokens][-max_len:]

def create_and_train_nb_model(df, name, epochs = 10, batch_size = 16, learning_rate = 0.001, valid_ratio=0.05, test_ratio=0.05):
    max_vocab = 20000
    max_len = 200

    dataset = CustomDataset(df, max_vocab, max_len, name)

    X_train, X_temp, y_train, y_temp = train_test_split(
        dataset.text, dataset.encoded_labels, test_size=valid_ratio + test_ratio, random_state=42)
    X_valid, X_test, y_valid, y_test = train_test_split(X_temp, y_temp, test_size=test_ratio / (valid_ratio + test_ratio), random_state=42)

    # Creating a pipeline with TF-IDF vectorizer and Multinomial Naive Bayes
    pipeline = make_pipeline(TfidfVectorizer(max_features=max_vocab), MultinomialNB())
    
    # Fitting the model to the training data
    pipeline.fit(X_train, y_train)

    # Evaluating on validation set
    valid_preds = pipeline.predict(X_valid)
    valid_acc = accuracy_score(y_valid, valid_preds)
    print(f'Validation Accuracy: {valid_acc:.2f}')
    print(f'Validation Report:\n{classification_report(y_valid, valid_preds)}')

    # Evaluating on test set
    test_preds = pipeline.predict(X_test)
    test_acc = accuracy_score(y_test, test_preds)
    print(f'Test Accuracy: {test_acc:.2f}')
    print(f'Test Report:\n{classification_report(y_test, test_preds)}')

    # Saving the pipeline to a file
    model_path = os.path.join('api', 'models', f"{name}_pipeline.pkl")
    os.makedirs(os.path.dirname(model_path), exist_ok=True)
    with open(model_path, "wb") as model_file:
        pickle.dump(pipeline, model_file)

    training_progress = {
        'training_progress': 0,
        'training_in_progress': False
    }
    with open('training_progress.json', 'w') as file:
        json.dump(training_progress, file)