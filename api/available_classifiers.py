import os

def get_available_classifiers():
    model_folder = next((folder for folder in ['models', 'api/models', '_internal/models'] if os.path.exists(folder)), None)
    
    # Verifica se o diretório 'models' existe
    if not model_folder:
        return []

    # Obtém a lista de arquivos no diretório 'models'
    model_files = os.listdir(model_folder)
    classifiers = {}

    for file in model_files:
        classifiers[len(classifiers)] = file

    return classifiers