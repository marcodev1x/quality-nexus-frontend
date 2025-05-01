import React from "react";
import ContainerMid from "../components/ContainerMid";
import InputSelect from "../components/InputSelect";
import Input from "../components/Input";
import styled from "styled-components";
import DynamicHeaders from "../components/DynamicInput";
import TextArea from "../components/TextArea";
import ComponentButton from "../components/Button";
import Toast from "../helpers/Toast";
import axios from "axios";
import GetToken from "../services/GetToken";
import Loader from "../helpers/Loader";
import ToastSuccess from "../helpers/ToastSuccess";
import FirstTopContainer from "../components/FirstTopContainer";
import RenderExistingTests from "../components/RenderExistingTests";
import DynamicExpecationInput from "../components/DynamicExpecationInput";
import EnvsVars from "../services/EnvsVars";
import {
  FiPlus,
  FiServer,
  FiEdit3,
  FiSettings,
  FiCode,
  FiCheckCircle,
} from "react-icons/fi";
import useUser from "../hooks/useUser.ts";

const IntegrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 24px;
  background: #ffffff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 24px rgba(0, 0, 0, 0.08);
  max-width: 900px;
  min-height: 400px;
  width: 100%;
  margin: auto;
`;

const FormHeader = styled.div`
  text-align: center;
  margin-bottom: 8px;
`;

const FormTitle = styled.h2`
  font-size: 26px;
  font-weight: 600;
  color: #333;
  margin-bottom: 12px;
  position: relative;
  display: inline-block;

  &:after {
    content: "";
    position: absolute;
    left: 50%;
    bottom: -8px;
    width: 60px;
    height: 3px;
    background: #2ecc71;
    transform: translateX(-50%);
    border-radius: 2px;
  }
`;

const FormSubtitle = styled.p`
  font-size: 15px;
  color: #666;
  text-align: center;
  margin-bottom: 8px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 16px;
  gap: 12px;
`;

const SectionTitle = styled.h3`
  font-size: 16px;
  font-weight: 600;
  color: #444;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 8px;

  svg {
    color: #2ecc71;
  }
`;

const FormSection = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
`;

const AddButtonContainer = styled(FirstTopContainer)`
  margin-bottom: 24px;
`;

const Integration = () => {
  const arrayOptions = ["GET", "POST", "PUT", "DELETE", "PATCH"];
  const [selectedMethod, setSelectedMethod] = React.useState(arrayOptions[0]);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [success, setSuccess] = React.useState<string | null>(null);
  const [url, setUrl] = React.useState<string>("");
  const [headers, setHeaders] = React.useState<
    { key: string; value: string }[]
  >([]);
  const [body, setBody] = React.useState<string>("");
  const [description, setDescription] = React.useState<string>("");
  const [addTest, setAddTest] = React.useState<boolean>(false);
  const [expectations, setExpectations] = React.useState<
    { key: string; expected: string; value: string }[]
  >([]);

  const user = useUser();

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(null);

    if (!url || !selectedMethod) {
      setError("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    let parsedBody: any = "N/A";

    if (body) {
      try {
        parsedBody = JSON.parse(body);
      } catch (parseError) {
        // Se o parse falhar, define um erro e interrompe
        console.error("Erro ao fazer parse do JSON:", parseError);
        setError("Formato JSON inválido no corpo da requisição.");
        setIsLoading(false);
        return; // Interrompe a execução da função
      }
    }

    try {
      const response = await axios.post(
        `${EnvsVars.API_URL}/tests/create`,
        {
          type: "integration",
          userId: Number(user?.email),
          description: description,
          config: {
            method: selectedMethod,
            url,
            headers,
            body: parsedBody,
            expectations: expectations.map((e) => ({
              key: e.key,
              operator: e.expected,
              value: e.value,
            })),
          },
        },
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${GetToken()}`,
          },
        },
      );

      if (!response.data) {
        return null;
      }

      setSuccess("Teste criado com sucesso");
      setExpectations([]);
      setHeaders([]);
      setBody("");
      setDescription("");
      setSelectedMethod(arrayOptions[0]);
      setUrl("");
      setAddTest(false);
    } catch (err) {
      console.error(err);
      setError("Erro ao criar teste");
    } finally {
      setIsLoading(false);
    }
  };

  setTimeout(() => {
    if (error) {
      setError(null);
    }
  }, 3500);

  return (
    <ContainerMid>
      {error && <Toast message={error} position={"top-right"} />}
      {!isLoading && !addTest && (
        <AddButtonContainer>
          <ComponentButton
            label="Adicionar teste"
            size="large"
            variant="primary"
            onClick={() => setAddTest(true)}
            icon={<FiPlus size={18} />}
          />
        </AddButtonContainer>
      )}
      {!isLoading && !addTest && <RenderExistingTests />}
      {isLoading && <Loader />}
      {!isLoading && addTest && (
        <StyledForm onSubmit={sendForm}>
          <FormHeader>
            <FormTitle>Novo Teste de API</FormTitle>
            <FormSubtitle>
              Configure os parâmetros do seu teste de API
            </FormSubtitle>
          </FormHeader>

          <IntegrationContainer>
            <FormSection>
              <SectionTitle>
                <FiEdit3 />
                Informações Básicas
              </SectionTitle>
              <TextArea
                label="Descrição do teste"
                labelColor="#333"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Ex: Verificar se a API de usuários retorna status 200"
              />
            </FormSection>

            <FormSection>
              <SectionTitle>
                <FiServer />
                Configuração da Requisição
              </SectionTitle>
              <div
                style={{ display: "flex", gap: "16px", marginBottom: "16px" }}
              >
                <div style={{ width: "30%" }}>
                  <InputSelect
                    label="Método HTTP"
                    options={arrayOptions}
                    changeState={setSelectedMethod}
                    required
                  />
                </div>
                <div style={{ width: "70%" }}>
                  <Input
                    labelColor="#333"
                    label="URL da API"
                    name="url"
                    value={url}
                    onChange={(e) => setUrl(e.target.value)}
                    type="url"
                    required
                    placeholder="https://api.exemplo.com/recurso"
                  />
                </div>
              </div>

              <SectionTitle>
                <FiSettings />
                Headers
              </SectionTitle>
              <DynamicHeaders headers={headers} setHeaders={setHeaders} />
            </FormSection>

            <FormSection>
              <SectionTitle>
                <FiCheckCircle />
                Expectativas de Resposta
              </SectionTitle>
              <DynamicExpecationInput
                expectation={expectations}
                setExpectations={setExpectations}
              />
            </FormSection>

            <FormSection>
              <SectionTitle>
                <FiCode />
                Corpo da Requisição
              </SectionTitle>
              <TextArea
                label="JSON ou outros dados a serem enviados"
                labelColor="#333"
                name="body"
                value={body}
                onChange={(e) => setBody(e.target.value)}
                placeholder='{"chave": "valor"}'
                rows={6}
              />
            </FormSection>

            <ButtonContainer>
              <ComponentButton
                label="Salvar Teste"
                variant="primary"
                size="large"
                type="submit"
              />
            </ButtonContainer>
          </IntegrationContainer>
        </StyledForm>
      )}

      {success && <ToastSuccess message={success} />}
    </ContainerMid>
  );
};

export default Integration;
