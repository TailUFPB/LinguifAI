import os

def get_available_classifiers():
    model_folder = 'api/models'

    # Verifica se o diretório 'models' existe

    ## retorna o path atual
    if not os.path.exists(model_folder):
        return []

    # Obtém a lista de arquivos no diretório 'models'
    model_files = os.listdir(model_folder)
    classifiers = {}

    for file in model_files:
        classifiers[len(classifiers)] = file

    return classifiers