import os
import pickle

def get_available_classifiers():
    model_folder = 'api\models'

    # Verifica se o diretório 'models' existe
    if not os.path.exists(model_folder):
        return []

    # Obtém a lista de arquivos no diretório 'models'
    model_files = os.listdir(model_folder)
    classifiers = []

    for file in model_files:
        if file.endswith('.pkl'):
            model_type = 'Naive-Bayes'
            model_name = os.path.splitext(file)[0]
            classifiers.append({'id': len(classifiers), 'name': f'{model_type} - {model_name}'})
        elif file.endswith('.keras'):
            model_type = 'Keras'
            model_name = os.path.splitext(file)[0]
            classifiers.append({'id': len(classifiers), 'name': f'{model_type} - {model_name}'})

    return classifiers