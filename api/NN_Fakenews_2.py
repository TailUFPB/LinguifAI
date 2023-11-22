import pandas as pd
import pickle
from Neural_Network2 import create_and_train_model


def Neural_Network(texts_train,labels_train):
    trained_model = create_and_train_model(texts_train, labels_train)

# Saving the model
    with open("nn_fakenews_model.pkl", "wb") as model_file:
        pickle.dump(trained_model, model_file)


    return trained_model



