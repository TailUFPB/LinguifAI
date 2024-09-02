# Use uma imagem base com Python
FROM python:3.10.12-slim

# Instale pacotes essenciais para compilação
RUN apt-get update && \
    apt-get install -y \
    build-essential \
    pkg-config \
    libhdf5-dev && \
    rm -rf /var/lib/apt/lists/**

# Define o diretório de trabalho
WORKDIR /app

# Copie o requirements.txt para o container
COPY api/. .


RUN pip install --upgrade pip

# Instale as dependências usando pip
RUN pip install --no-cache-dir -r requirements.txt

# Exponha a porta que a API vai usar
EXPOSE 5000

# Comando padrão pode ser substituído pelo docker-compose
CMD ["python", "app.py"]
