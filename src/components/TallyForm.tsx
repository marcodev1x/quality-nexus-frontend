import { useState, useEffect } from 'react'
import styled from 'styled-components'
import EnvsVars from '../services/EnvsVars'
import axios from 'axios';
import GetToken from '../services/GetToken';

interface SubmissionPayload {
  id: string; // submission ID
  respondentId: string;
  formId: string;
  formName: string;
  createdAt: string; // ISO string
  fields: Array<{
    id: string;
    title: string;
    type: string;
    answer: { value: any; raw: any };
  }>;
}

const FormStyled = styled.div`
  position: fixed;
  right: 20px;
  bottom: 20px;
  width: 600px;
  max-width: 90vw;
  box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  border-radius: 12px;
  background: white;
  z-index: 1000;
  overflow: hidden;
`

const ModifiedIframe = styled.iframe`
  width: 100%;
  border: none;
  border-radius: 12px;
  display: block;
`

const CloseButton = styled.button`
  position: absolute;
  top: 14px;
  right: 8px;
  background: #2ecc71;
  border: none;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  font-weight: bold;
  font-size: 18px;
  cursor: pointer;
  line-height: 1;
  color: #fff;
  transition: background 0.3s;

  &:hover {
    background: #27ae60;
  }
`

const Container = styled.div`
  position: relative;
`

export default function TallyForm({
  src,
  quantityAccess,
  formCode,
}: {
  src: string
  quantityAccess: number
  formCode: string
}) {
  useEffect(() => {
    async function onMessage(e: MessageEvent) {
      if (typeof e.data === 'string' && e.data.includes('Tally.FormSubmitted')) {
        try {
          const parsed = JSON.parse(e.data)
          const payload = parsed.payload as SubmissionPayload

          if (payload.formId === formCode) {
            const response = await axios.post(
              `${EnvsVars.API_URL}/user/form-answer`,
              { formCode: formCode },
              {
                headers: {
                  "content-type": "application/json",
                  Authorization: `Bearer ${GetToken()}`
                }
              }
            )
            setAnswered(true)
            setVisible(false)
          }
        } catch (err) {
          console.error('Erro ao processar mensagem do Tally:', err)
        }
      }
    }

    userHasAlsoAnswered();

    window.addEventListener('message', onMessage)
    return () => window.removeEventListener('message', onMessage)
  }, [formCode])

  const [visible, setVisible] = useState(true)
  const [answered, setAnswered] = useState(false)

  async function userHasAlsoAnswered(){
    try {
      const response = await axios.get(
        `${EnvsVars.API_URL}/user/form-answer/${formCode}`,
        {
          params: {
            formCode: formCode
          },
          headers: {
            "content-type": "application/json",
            Authorization: `Bearer ${GetToken()}`
          }
        }
      )

      if(response.data) return setAnswered(true);

      return
    } catch(err) {
      console.error('Erro ao verificar se o usuário já respondeu:', err)
    }
  }

  if (quantityAccess < EnvsVars.NPS_MINIMAL_DEFAULT_LOGIN_QUANTITY) return null

  if (!visible || answered) return null

  return (
    <FormStyled>
      <Container>
        <CloseButton
          onClick={() => setVisible(false)}
          aria-label="Fechar formulário"
        >
          ×
        </CloseButton>
        <ModifiedIframe
          src={src}
          loading="lazy"
          title="NPS - Quality Nexus"
          allowFullScreen
        />
      </Container>
    </FormStyled>
  )
}
