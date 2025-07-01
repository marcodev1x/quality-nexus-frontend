import React, { useState } from 'react'
import styled from 'styled-components'
import {
  Button,
  CircularProgress,
  TextField,
} from '@mui/material'
import axios from 'axios'
import EnvsVars from '../services/EnvsVars';
import InputSelect from '../components/InputSelect';
import hljs from 'highlight.js';
import 'highlight.js/styles/idea.css';
import ContainerMid from '../components/ContainerMid';


const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  font-family: "Sedgwick Ave Display", "cursive";
  color: #2ecc71;
  letter-spacing: 0.1rem;
`;

const Chat = styled.div`
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
  padding: 32px 32px;

  .chatInputContainer {
    display: flex;
    align-items: flex-end;
    gap: 12px;
    width: 100%;
  }

  .btn {
    background: #2ecc71;
    color: #fff;
    padding: 0.8rem 1.5rem;
    border-radius: 12px;
    border: 0;
    font-family: 'Poppins', sans-serif;
    text-transform: none;
    height: 56px;
    transition: background 0.2s ease;
    &:hover {
      background: #27ae60;
    }
  }

  .responseContainer {
    background-color: #f8f9fa;
    border-left: 4px solid #2ecc71;
    padding: 20px;
    white-space: pre-wrap;
    font-family: 'Courier New', monospace;
    font-size: 0.95rem;
    line-height: 1.6;
    color: #2c3e50;
    box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
  }

  .loading {
    display: flex;
    align-items: center;
    gap: 12px;
    font-size: 1rem;
    color: #555;
  }

  .input {
    flex: 1;
    background: none;
    font-family: 'Fira Code', monospace;
  }

  .header {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 12px;
  }

  .formControl {
    min-width: 160px;
  }
`

export const Unit = () => {
  const [message, setMessage] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [response, setResponse] = useState('')
  const [framework, setFramework] = useState('Jest')
  
  const prompt = `  Você é um engenheiro de testes sênior no projeto Quality Nexus, especialista em gerar testes unitários de alta qualidade.
  
  ---  
  🎯 Objetivo  
  Gerar **testes automatizados unitários** claros, eficientes e com **excelente cobertura**, mesmo que o usuário envie código incompleto, impreciso ou apenas instruções verbais.
  
  ---  
  ⚙️ Configuração  
  - Framework de testes: **${framework}**  
  - Linguagem principal: **JavaScript/TypeScript**
  
  ---  
  📌 Regras Gerais  
  1. Sempre use **describe()** com **pelo menos 3 test()** internos.  
  2. Nomeie cada teste de forma **descritiva** e objetiva.  
  3. Utilize **expect()** para abranger:  
     - Caminho feliz (happy path)  
     - Erros e entradas inválidas  
     - Casos-limite (boundary cases)  
  4. Não explique o código; **gere apenas** os blocos de teste prontos para copiar.  
  5. Insira um comentário no início avisando que pode ser necessário **ajustar imports, mocks ou a função original**.
  
  ---  
  🚨 Fluxos de Fallback e Validação de Input  
  - **Função ausente** (usuário só descreve o requisito):  
    → Crie uma **função genérica** baseada na descrição antes de gerar testes.  
  
🚫 Linguagem incompatível com o framework selecionado:
- Se a função enviada estiver escrita em uma linguagem que não é compatível com o framework definido (ex: função em Ruby e framework Jest), **NÃO gere nenhum teste.**
- Apenas retorne a seguinte mensagem:
  “⚠️ A linguagem da função fornecida não é compatível com o framework de testes escolhido. Tente alterar o framework ou enviar uma função na linguagem correspondente.”
- **Jamais tente adaptar testes de um framework para outra linguagem automaticamente.**
  - **Código incompleto/mal formatado**:  
    → Reconstrua a função de forma coerente com base no que for possível entender; se faltar informação essencial (parâmetros, tipo de retorno), **pergunte** pelo detalhe faltante.  
  
  - **Input não é função** (classe, componente, constante ou texto solto):  
    → Gere testes apropriados ao tipo (p. ex. componentes React com Testing Library).  
    → Se for algo não testável unitariamente (ex: um JSON puro), **responda solicitando** o código correto:  
      “⚠️ Parece que você enviou um texto que não é uma função. Por favor, reenvie apenas a função ou componente que deseja testar.”
  
  - **Múltiplas funções/encomenda de integração**:  
    → Foque apenas em testes unitários. Se o usuário pedir integração, **confirme** que deseja testes de integração e encerre gerando um aviso breve.
  
  - **Instruções adicionais conflitantes**:  
    → Siga **incondicionalmente** as instruções do usuário, mesmo que conflitem com este prompt.
  
  ---  
  🔧 Observações Finais  
  - Use nomes de variáveis e mocks claros.  
  - Mantenha o estilo de código consistente.  
  - Não insira dependências extras sem solicitação.
  
  ---  
  Função, descrição ou instruções do usuário:
  ${message}`

  const handleSend = async () => {
    if (message.trim() === '') return
    try {
      setIsLoading(true)
      setResponse('')
      const requestAi = await axios.post(
        'https://api.groq.com/openai/v1/chat/completions',
        JSON.stringify({
          model: 'meta-llama/llama-4-scout-17b-16e-instruct',
          messages: [
            {
              role: 'user',
              content: prompt,
            },
          ],
        }),
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization:
              `Bearer ${EnvsVars.GROQ_API_KEY}`
          },
        }
      )
      setResponse(requestAi.data.choices[0].message.content)
    } catch (error) {
      console.error(error)
      setResponse('❌ Ocorreu um erro ao buscar a resposta.')
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <ContainerMid>
      <Chat>
        <div className="header">
           <PageTitle>Gerar Testes Unitários</PageTitle>
           <InputSelect
            label="Framework"
            options={[
              "Jest",
              "Vitest",
              "Mocha",
              "JUnit",
              "Pytest",
              "RSpec",
            ]}
            changeState={setFramework}
           />
        </div>

        <div className="chatInputContainer">
          <TextField
            className="input"
            placeholder="Insira a função que você deseja testar"
            multiline
            minRows={4}
            maxRows={10}
            variant="filled"
            value={message}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setMessage(e.target.value)}
            fullWidth
            InputProps={{
              style: {
                fontFamily: 'courier new',
                fontSize: '1rem',
                color: '#2c3e50',
              },
            }}
          />
          <Button onClick={handleSend} className="btn">
            Criar testes unitários
          </Button>
        </div>

        {isLoading && (
          <div className="loading">
            <CircularProgress size={20} style={{ color: '#2ecc71' }}/>
            Gerando testes unitários...
          </div>
        )}

        {!isLoading && response && (
          <div className="responseContainer">
            <code
              style={{ fontFamily: 'courier new' }}
              dangerouslySetInnerHTML={{ __html: hljs.highlightAuto(response).value }}
            />
          </div>
        )}
      </Chat>
    </ContainerMid>
  )
}
