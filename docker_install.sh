#!/bin/bash

# Atualizar a lista de pacotes
sudo apt-get update

# Remover o Docker, containerd e outros componentes relacionados, se estiverem instalados
sudo systemctl stop docker
sudo apt-get purge -y docker docker-engine docker.io docker-ce docker-ce-cli containerd runc
sudo apt-get autoremove -y --purge docker docker-engine docker.io docker-ce docker-ce-cli containerd runc
sudo rm -rf /var/lib/docker
sudo rm -rf /etc/docker

# Remover repositórios duplicados
sudo rm /etc/apt/sources.list.d/archive_uri-https_download_docker_com_linux_ubuntu-jammy.list
sudo rm /etc/apt/sources.list.d/docker.list

# Baixar a chave GPG do Docker
curl -fsSL https://download.docker.com/linux/ubuntu/gpg | sudo apt-key add -

# Adicionar o repositório Docker
sudo add-apt-repository "deb [arch=amd64] https://download.docker.com/linux/ubuntu $(lsb_release -cs) stable"

# Atualizar a lista de pacotes novamente
sudo apt-get update -y

# Instalar o Docker via Snap
sudo snap install docker 

# Iniciar o Docker
sudo systemctl start docker

# Habilitar o Docker para iniciar automaticamente na inicialização
sudo systemctl enable docker

# Instalar a versão mais recente do Docker Compose
sudo rm /usr/local/bin/docker-compose
sudo curl -L "https://github.com/docker/compose/releases/download/v2.27.0/docker-compose-$(uname -s)-$(uname -m)" -o /usr/local/bin/docker-compose
sudo chmod +x /usr/local/bin/docker-compose

# Verificar as permissões do diretório /tmp
sudo chmod 1777 /tmp

# Verificar a versão do Docker e Docker Compose
docker --version
docker-compose --version

echo "Docker e Docker Compose foram instalados com sucesso."