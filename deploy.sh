#!/bin/bash

# Navegue até o diretório do projeto
cd /home/juvhost1/app-sport-reserve.juvhost.com

# Obter alterações do repositorio
git pull origin main

# Execute comandos de deploy, por exemplo:
# Instalar dependências do npm
/usr/bin/npm install

# Instalar dependência child_process do npm
/usr/bin/npm install child_process

# da permissão de execução para o expo
chmod a+x ./node_modules/.bin/expo

# Cria startExpo.js
cat << 'EOF' > startExpo.js
const { exec } = require('child_process');

// Executa o comando 'expo start --web'
const process = exec('./node_modules/.bin/expo start --web --port 50003', (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o comando: ${error}`);
    return;
  }
  if (stderr) {
    console.error(`Erro: ${stderr}`);
    return;
  }
  console.log(`Saída: ${stdout}`);
});

// Garante que a saída do processo seja exibida no console
process.stdout.on('data', (data) => {
  console.log(data.toString());
});

process.stderr.on('data', (data) => {
  console.error(data.toString());
});
EOF
