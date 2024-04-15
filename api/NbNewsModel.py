import pickle

def news_prediction(texts):
    model_file = "./models/text_classification_pipeline.pkl"
    try:
        # Carregando o pipeline do arquivo .pkl
        with open(model_file, 'rb') as model_file:
            pipeline = pickle.load(model_file)

        # Fazendo previsões para os textos
        predictions = pipeline.predict([texts])

        return predictions[0]

    except Exception as e:
        return str(e)
