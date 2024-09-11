# Use a imagem base oficial do Python
FROM python:3.10-slim

# Defina o diretório de trabalho no container
WORKDIR /app

# Copie os arquivos de requirements para o diretório de trabalho
COPY requirements.txt .

# Instale as dependências
RUN pip install --no-cache-dir -r requirements.txt

# Criar o diretório de uploads
RUN mkdir -p /app/uploads

# Copie o código da aplicação para o diretório de trabalho
COPY . .

# Defina a variável de ambiente para o Flask
ENV FLASK_APP=app.py 

# Comando para rodar o Flask
CMD ["flask", "run", "--host=0.0.0.0"]
