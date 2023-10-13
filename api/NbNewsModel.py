import pandas as pd
import pickle

def news_prediction(texts):
    model_file = "api/models/text_classification_pipeline.pkl"
    try:
        # Carregando o pipeline do arquivo .pkl
        with open(model_file, 'rb') as model_file:
            pipeline = pickle.load(model_file)

        # Fazendo previsões para os textos
        predictions = pipeline.predict(texts)

        return predictions
    
    except Exception as e:
        return str(e)
df = pd.read_csv("api/training_df/nb_news.csv")
print(news_prediction(df['short_description']))