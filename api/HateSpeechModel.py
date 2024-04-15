import pickle

def make_prediction(my_sentence):
    model_file = "./models/hate_speech.pkl"
    try:
        # Carregando o pipeline do arquivo .pkl
        with open(model_file, 'rb') as model_file:
            pipeline = pickle.load(model_file)

        # Fazendo previsões para os textos
        predictions = pipeline.predict([my_sentence])

        return predictions[0]

    except Exception as e:
        return str(e)