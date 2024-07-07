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

# remove startExpo.js
rm -f /home/juvhost1/app-sport-reserve.juvhost.com/startExpo.js

# Cria startExpo.js
cat << 'EOF' > startExpo.js
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const projectDir = path.resolve('/home/juvhost1/app-sport-reserve.juvhost.com');

// Cria um stream de escrita para o arquivo de log
const logStream = fs.createWriteStream('expo_start.log', { flags: 'a' });

const command = './node_modules/.bin/expo';

const args = ['start', '--port', '50003'];

// Executa o comando 'expo start --web'
const child = spawn(command, args, { cwd: projectDir, shell: true });

// Capturar a saída padrão e de erro
child.stdout.on('data', (data) => {
  console.log(`stdout: ${data}`);
  logStream.write(`stdout: ${data}`);
});

child.stderr.on('data', (data) => {
  // Ignorar o erro específico de xdg-open
  if (!data.includes('spawn xdg-open ENOENT')) {
    console.error(`stderr: ${data}`);
    logStream.write(`stderr: ${data}`);
  }
});

child.on('error', (error) => {
  console.error(`Erro ao executar o comando: ${error.message}`);
  logStream.write(`Erro ao executar o comando: ${error.message}`);
});

child.on('close', (code) => {
  console.log(`Processo filho finalizado com código ${code}`);
  logStream.write(`Processo filho finalizado com código ${code}`);

});
EOF
