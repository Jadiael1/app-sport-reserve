# Sistema de Agendamento de Quadras Esportivas

Este é um projeto de um sistema de agendamento de quadras esportivas desenvolvido utilizando React Native.

## Funcionalidades

- **Autenticação de Usuário**: Permite que os usuários façam login e logout utilizando tokens de autenticação.
- **Verificação de E-mail**: Envia e reenvia e-mails de verificação para garantir que os usuários validem seus endereços de e-mail.
- **Agendamento de Quadras**: Permite aos usuários visualizar horários disponíveis e reservar quadras esportivas.
- **Gestão de Reservas**: Permite aos usuários visualizar suas reservas atuais e cancelar reservas existentes.

## Pré-requisitos

Certifique-se de ter as seguintes ferramentas instaladas em seu ambiente de desenvolvimento:

- Node.js
- Expo CLI
- React Native CLI
- Emulador/simulador ou dispositivo físico para testar o aplicativo

## Instalação

1. **Clonar o repositório:**

   ```bash
   git clone https://github.com/Jadiael1/app-sport-reserve.git
   cd app-sport-reserve
   ```

2. **Instalar dependências:**

   ```bash
   npm install

   # ou

   yarn install
   ```

## Configuração

1. **Configurar variáveis de ambiente:**

   Renomeie o arquivo `.env.example` para `.env` e configure as variáveis de ambiente necessárias, como URLs da API e chaves de acesso.

## Executando o Aplicativo

Para iniciar o aplicativo em um ambiente de desenvolvimento, utilize o seguinte comando:

```bash
npm start

# ou

yarn start
```

Isso iniciará o servidor de desenvolvimento do Expo. Use o aplicativo Expo Go no seu dispositivo móvel ou um emulador/simulador para visualizar o aplicativo.

## Estrutura do Projeto

- `src/`

  - `components/`: Componentes reutilizáveis
  - `constants/`: Constantes e configurações do projeto
  - `screens/`: Telas principais do aplicativo
  - `services/`: Lógica de serviço, como autenticação e gerenciamento de API
  - `utils/`: Funções utilitárias auxiliares
  - `App.js`: Ponto de entrada do aplicativo

## Contribuição

Contribuições são bem-vindas! Para sugerir melhorias, por favor abra uma issue descrevendo sua sugestão ou envie um pull request com suas modificações.

## Autores

- [@jadiael](https://github.com/Jadiael1)
- [@wilksonflor](https://github.com/Wilksonflor)

## Licença

Este projeto está licenciado sob a Licença MIT - veja o arquivo [LICENSE](./LICENSE) para mais detalhes.
