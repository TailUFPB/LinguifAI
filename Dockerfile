# Use uma imagem base com Node.js
FROM node:18

# Defina o diretório de trabalho
WORKDIR /app

# Instale o serve globalmente
RUN npm install -g serve

# Copie o package.json e o package-lock.json
COPY package*.json ./

# Instale as dependências
RUN npm install

# Exponha a porta que o React vai usar
EXPOSE 3000

# Defina o comando para rodar o servidor
# build then serve
CMD ["npm", "run", "build", "&", "serve", "-s", "build", "-l", "3000"]
