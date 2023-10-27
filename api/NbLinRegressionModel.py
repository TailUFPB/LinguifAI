import pickle

def make_prediction(my_sentence):
    with open("./models/vectorizer_lin.pkl", "rb") as f:
        vectorizer = pickle.load(f)

    with open("./models/linear_reg.pkl", "rb") as f:
        model = pickle.load(f)

    new_sentence = vectorizer.transform(my_sentence)
    
    prediction = model.predict(new_sentence)
    if prediction == 0:
        return "Negativo"
    else:
        return "Positivo"