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
const fs = require('fs');

// Cria um stream de escrita para o arquivo de log
const logStream = fs.createWriteStream('expo_start.log', { flags: 'a' });

// Executa o comando 'expo start --web'
const process = exec('./node_modules/.bin/expo start --web --port 50003', (error, stdout, stderr) => {
  if (error) {
    const errorMsg = `Erro ao executar o comando: ${error}\n`;
    console.error(errorMsg);
    logStream.write(errorMsg);
    return;
  }
  if (stderr) {
    const errorOutput = `Erro: ${stderr}\n`;
    console.error(errorOutput);
    logStream.write(errorOutput);
    return;
  }
  console.log(`Saída: ${stdout}`);
  logStream.write(`Saída: ${stdout}\n`);
});

// Garante que a saída do processo seja exibida no console
process.stdout.on('data', (data) => {
  console.log(data.toString());
  logStream.write(data.toString());
});

process.stderr.on('data', (data) => {
  console.error(data.toString());
  logStream.write(data.toString());
});
EOF
