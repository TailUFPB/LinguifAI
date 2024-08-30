# Use uma imagem base com Node.js
FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Copie o restante do código
COPY . .

# Instale um servidor para servir o build estático
RUN npm install -g serve

# Copie o script de inicialização para o contêiner
COPY start.sh .

# Torne o script executável
RUN chmod +x start.sh

# Defina o comando para rodar o script de inicialização
CMD ["./start.sh"]

# Exponha a porta que o React vai usar
EXPOSE 3000
