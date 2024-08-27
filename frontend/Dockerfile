# Use uma imagem base do Node.js
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app/frontend

# Copie os arquivos de dependências para o diretório de trabalho
COPY ./package.json ./yarn.lock ./

# Instale as dependências usando Yarn
RUN yarn install

# Copie o restante dos arquivos da aplicação para o diretório de trabalho
COPY . .

# Comando para rodar o servidor de desenvolvimento
CMD ["yarn", "dev", "--host"]
