# **Sistema de Gerenciamento de Processos - SEI**

Este é um sistema web para gerenciar processos do Sistema Eletrônico de Informações (SEI), permitindo cadastro, pesquisa, atualização e exclusão de processos. Inclui funcionalidades como autenticação de usuários, paginação de dados, e links diretos para os processos cadastrados.

---

## **Tecnologias Utilizadas**

- **Frontend**: React, TypeScript
- **Estilização**: CSS puro com responsividade
- **Backend**: Firebase (Firestore, Authentication)
- **Gerenciamento de Estados**: React Hooks
- **Notificações**: react-toastify

---

## **Funcionalidades**

- **Autenticação**:
  - Login de usuários com persistência local via Firebase Authentication.
  - Logout seguro e redirecionamento automático.

- **Gestão de Processos**:
  - Cadastro de processos com campos obrigatórios e opcionais.
  - Edição de status de processos com modais interativos.
  - Exclusão de processos individuais ou em lote.
  - Links nos números dos processos que redirecionam para a página detalhada do SEI.

- **Paginação e Pesquisa**:
  - Exibição de até 10 processos por página com navegação entre páginas.
  - Pesquisa por número ou assunto dos processos.

- **Interface Responsiva**:
  - Sidebar adaptável para dispositivos móveis.
  - Tabelas e formulários ajustados para diferentes tamanhos de tela.

---

## **Como Configurar e Rodar o Projeto**

### **Pré-requisitos**
- Node.js instalado (versão 14 ou superior)
- Firebase configurado no console do Firebase
- Gerenciador de pacotes `npm` ou `yarn`

### **Passos para Configuração**
1. Clone o repositório:
   ```bash
   git clone https://github.com/seu-usuario/seu-repositorio.git
   cd seu-repositorio
2. Instale as dependências:

    ```bash

    npm install

3. Configure o arquivo .env:

    Crie um arquivo .env.local na raiz do projeto.
    Adicione as seguintes variáveis de ambiente:
    ```bash
    
    VITE_FIREBASE_API_KEY=your-api-key
    VITE_FIREBASE_AUTH_DOMAIN=your-auth-domain
    VITE_FIREBASE_PROJECT_ID=your-project-id
    VITE_FIREBASE_STORAGE_BUCKET=your-storage-bucket
    VITE_FIREBASE_MESSAGING_SENDER_ID=your-sender-id
    VITE_FIREBASE_APP_ID=your-app-id

4. Inicialize o projeto:

    ```bash
    npm run dev

5. Abra no navegador:

    Acesse http://localhost:5173 para visualizar o projeto.

### **Estrutura do projeto**

    ```bash
    ├── public/                   # Arquivos estáticos
    ├── src/
    │   ├── assets/               # Recursos visuais (imagens, ícones)
    │   ├── components/           # Componentes reutilizáveis (Sidebar, Loader)
    │   ├── firebase/             # Configurações do Firebase
    │   ├── pages/                # Páginas principais (Login, Dashboard, Cadastro)
    │   ├── styles/               # Estilos globais e específicos
    │   ├── types/                # Definições de tipos TypeScript
    │   ├── App.tsx               # Componente raiz
    │   ├── main.tsx              # Entrada principal do React
    │   └── index.html            # Arquivo HTML base
    ├── .env.local                # Variáveis de ambiente (não commitar)
    ├── package.json              # Dependências e scripts do projeto
    └── README.md                 # Documentação do projeto

### **Melhorias futuras**
Implementação de tutoriais interativos para o SEI.

### **Autora**

Desenvolvido por **Yanca Fernandes**  
📧 **E-mail:** [yancafernandes2@gmail.com](mailto:yancafernandes2@gmail.com)

🔗 **Conecte-se comigo:**

<table>
  <tr>
    <td align="center">
      <a href="https://www.linkedin.com/in/yanca-fernandes/" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/174/174857.png" width="40" alt="LinkedIn">
        <br>
        <strong>LinkedIn</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://yancafernandes.dev.br/" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/178/178276.png" width="40" alt="Portfólio">
        <br>
        <strong>Portfólio</strong>
      </a>
    </td>
    <td align="center">
      <a href="https://www.instagram.com/yan.desgn/" target="_blank">
        <img src="https://cdn-icons-png.flaticon.com/512/1384/1384063.png" width="40" alt="Instagram">
        <br>
        <strong>Instagram</strong>
      </a>
    </td>
  </tr>
</table>
