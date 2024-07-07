#!/bin/bash

# Navegue até o diretório do projeto
cd /home/juvhost1/app-sport-reserve.juvhost.com

# Obter alterações do repositorio
git pull origin main

# Execute comandos de deploy, por exemplo:
# Instalar dependências do npm
/opt/nvm/versions/node/v22.4.0/bin/npm install

# Instalar dependência child_process do npm
/opt/nvm/versions/node/v22.4.0/bin/npm install child_process

git restore package.json package-lock.json

# da permissão de execução para o expo
chmod a+x ./node_modules/.bin/expo

# remove startExpo.js
rm -f /home/juvhost1/app-sport-reserve.juvhost.com/startExpo.js

# Cria startExpo.js
cat << 'EOF' > startExpo.js
const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = path.resolve('/home/juvhost1/app-sport-reserve.juvhost.com');

// Cria um stream de escrita para o arquivo de log
const logStream = fs.createWriteStream('/home/juvhost1/app-sport-reserve.juvhost.com/expo_start.log', { flags: 'a' });

const command = './node_modules/.bin/expo start . --port 50003';

logStream.write(`node_version: ${process.version}\n`);


const myProcess = exec(command, { cwd: projectDir, shell: true }, (error, stdout, stderr) => {
  if (error) {
    console.error(`Erro ao executar o comando: ${error.message}`);
    logStream.write(`Erro ao executar o comando: ${error.message}`);
    return;
  }

  if (stderr) {
    console.error(`stderr: ${stderr}`);
    logStream.write(`stderr: ${stderr}`);
  }

  console.log(`stdout: ${stdout}`);
  logStream.write(`stdout: ${stdout}`);
});


myProcess.stdout.on('data', (data) => {
  console.log(data.toString());
  logStream.write(data.toString());
});

myProcess.stderr.on('data', (data) => {
  console.error(data.toString());
  logStream.write(data.toString());
});
EOF

# restart app-reserve.service service
sudo systemctl restart app-reserve.service
