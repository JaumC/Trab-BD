# Projeto Banco de Dados
Projeto Banco de Dados para Adoção de Pets

### 1. Instalar o Docker e Docker-Compose

#### No Ubuntu

**Torne o script de instalação executável**, rodando esse comando no seu terminal:
```sh
chmod +x docker_install.sh
./docker_install.sh
```

#### No Windows
Baixe e instale o [Docker Desktop para Windows](https://www.docker.com/products/docker-desktop).


**Depois de instalado o docker e docker-compose**, basta buildar o container:
```sh
sudo docker-compose up --build
```

### Para acessar o postgres via terminal:
```sh
sudo docker exec -it postgresbd psql -U admin_user -d meau_pets
```

**Ou se for diferente, substitua <postgresbd> pelo nome do container referente ao banco de dados, você pode conferir o nome do container usando:**
```sh
sudo docker ps
```


### Para acessar o projeto na web, acesse pelo navegador:
```sh
localhost:3000
```