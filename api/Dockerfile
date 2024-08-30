# Use uma imagem base com Python
FROM python:3.10.12-slim

# Define o diretório de trabalho
WORKDIR /app

# Copie o requirements.txt para o container
COPY api/requirements.txt .

RUN pip install --upgrade pip

# Instale as dependências usando pip
RUN pip install --no-cache-dir -r requirements.txt

# Exponha a porta que a API vai usar
EXPOSE 5000

# Comando padrão pode ser substituído pelo docker-compose
