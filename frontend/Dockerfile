# Use uma imagem base do Node.js
FROM node:18

# Defina o diretório de trabalho dentro do contêiner
WORKDIR /app/frontend

# Copie os arquivos de dependências para o diretório de trabalho
COPY package.json yarn.lock ./

# Instala as dependências
RUN yarn install

RUN rm -rf node_modules
COPY . .

# Comando para rodar o servidor de desenvolvimento
CMD ["yarn", "dev", "--host"]
