import os

def get_available_classifiers():
    model_folder = next((folder for folder in ['models', 'api/models', '_internal/models'] if os.path.exists(folder)), None)
    
    # Verifica se o diretório 'models' existe
    if not model_folder:
        return {0 : "emotion_pipeline.pkl", 1 : "hate_speech.pkl", 2 : "text_classification_pipeline.pkl"}

    # Obtém a lista de arquivos no diretório 'models'
    model_files = os.listdir(model_folder)
    classifiers = {}

    for file in model_files:
        classifiers[len(classifiers)] = file
    classifiers[len(classifiers)] = "emotion_pipeline.pkl"
    classifiers[len(classifiers)] = "hate_speech.pkl"
    classifiers[len(classifiers)] = "text_classification_pipeline.pkl"

    return classifiers