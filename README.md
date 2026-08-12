# Gestor do Fotógrafo

Base inicial de um sistema de gestão para fotógrafos.

## Arquitetura

- `frontend/` — HTML, CSS e JavaScript do aplicativo.
- `appscript/` — backend Google Apps Script.
- Google Sheets — persistência dos dados.
- GitHub — versionamento do código.

## 1. Criar a planilha

Crie uma planilha Google vazia.

## 2. Criar o Apps Script

Na planilha:
**Extensões → Apps Script**

Crie os arquivos:
- Code.gs
- Setup.gs

Copie os arquivos da pasta `appscript/`.

Se o Apps Script estiver vinculado à planilha, deixe:

```js
spreadsheetId: ""
```

Se preferir usar uma planilha externa, informe o ID:

```js
spreadsheetId: "SEU_ID_DA_PLANILHA"
```

## 3. Criar as abas

Execute a função:

```text
setupSistema
```

Ela cria automaticamente:

- CLIENTES
- ORCAMENTOS
- ORCAMENTO_ITENS
- AGENDA
- RECEBIMENTOS
- CAIXA
- RECIBOS
- CONFIGURACOES
- USUARIOS

## 4. Publicar a API

No Apps Script:

**Implantar → Nova implantação → Aplicativo da Web**

Configuração inicial:

- Executar como: você
- Quem tem acesso: conforme o seu cenário de uso

Copie a URL do Web App.

## 5. Configurar o frontend

Abra:

```text
frontend/js/api.js
```

Informe:

```js
const API_URL = "SUA_URL_DO_WEB_APP";
```

## Observação importante

O frontend está separado do backend para facilitar o versionamento no GitHub.

Nesta primeira etapa, o Dashboard já está preparado para consumir:

```text
?action=dashboard
```

e o Apps Script calcula os indicadores diretamente a partir das abas da planilha.

## Próxima etapa

Implementar o módulo **Clientes** completo:

- listagem
- busca
- cadastro
- edição
- exclusão/inativação
- validações
- histórico
- integração com orçamento e agenda
