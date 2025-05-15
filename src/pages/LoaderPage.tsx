import ContainerMid from "../components/ContainerMid";
import RenderExistingTests from "../components/RenderExistingTests.tsx";
import ComponentButton from "../components/Button.tsx";
import {
  FiCode,
  FiEdit3,
  FiPlus,
  FiServer,
  FiZap,
  FiHelpCircle,
  FiSettings,
} from "react-icons/fi";
import styled from "styled-components";
import FirstTopContainer from "../components/FirstTopContainer.tsx";
import React from "react";
import Loader from "../helpers/Loader.tsx";
import TextArea from "../components/TextArea.tsx";
import InputSelect from "../components/InputSelect.tsx";
import Input from "../components/Input.tsx";
import DynamicHeaders from "../components/DynamicInput.tsx";
import axios from "axios";
import EnvsVars from "../services/EnvsVars.ts";
import GetToken from "../services/GetToken.tsx";
import Toast from "../helpers/Toast.tsx";
import ToastSuccess from "../helpers/ToastSuccess.tsx";
import useUser from "../hooks/useUser.ts";

const AddButtonContainer = styled(FirstTopContainer)`
  margin-bottom: 24px;
`;

const LoadContainer = styled.div`
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
  box-shadow: 0px 8px 24px rgba(0, 0, 0, 0.08);
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
  display: flex;
  align-items: center;
  gap: 8px;
  margin-bottom: 20px;

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

const LoaderPage = () => {
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
  const [tooltip, setTooltip] = React.useState<boolean>(false);
  const [workers, setWorkers] = React.useState<string>("0");
  const [onTestCountChange, setOnTestCountChange] = React.useState<number>(0);
  const [connections, setConnections] = React.useState<string>("1");
  const [duration, setDuration] = React.useState<string>("");

  const user = useUser();

  if (Number(workers) >= 17) {
    setWorkers("16");
    setError("Máximo de 16 workers");

    setTimeout(() => {
      setError(null);
    }, 4000);
  }

  if (Number(workers) < 0) {
    setWorkers("0");
    setError("Mínimo de 0 workers");

    setTimeout(() => {
      setError(null);
    }, 4000);
  }

  if (Number(connections) > 1000) {
    setConnections("1000");
    setError("Máximo de 1000 connections");

    setTimeout(() => {
      setError(null);
    }, 4000);
  }

  if (Number(connections) < 1) {
    setConnections("1");
    setError("Mínimo de 1 connection");

    setTimeout(() => {
      setError(null);
    }, 4000);
  }

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setSuccess(null);
    setError(null);

    if (!url || !selectedMethod) {
      setError("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post(
        `${EnvsVars.API_URL}/tests/create`,
        {
          type: "load",
          description: description,
          config: {
            method: selectedMethod,
            url,
            headers,
            body: body ? JSON.parse(body) : "N/A",
            workersthreads: Number(workers),
            usersQt: Number(connections),
            time: Number(duration),
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

  return (
    <ContainerMid>
      {error && <Toast message={error} position={"top-right"} />}
      {success && <ToastSuccess message={"Teste criado com sucesso"} />}
      {!isLoading && !addTest && (
        <AddButtonContainer>
          <ComponentButton
            disabled={onTestCountChange >= 3 && user?.role === "free"}
            label="Adicionar teste"
            size="large"
            variant="primary"
            onClick={() => setAddTest(true)}
            icon={<FiPlus size={18} />}
          />
        </AddButtonContainer>
      )}
      {!isLoading && !addTest && <RenderExistingTests onTestCountChange={setOnTestCountChange} />}
      {isLoading && <Loader />}
      {!isLoading && addTest && (
        <StyledForm onSubmit={sendForm}>
          <FormHeader>
            <FormTitle>Novo teste de carga</FormTitle>
            <FormSubtitle>
              Configure os parâmetros do seu teste de carga
            </FormSubtitle>
          </FormHeader>

          <LoadContainer>
            <FormSection>
              <SectionTitle>
                <FiEdit3 />
                Informações Básicas
              </SectionTitle>
              <Input
                label="Título do teste"
                labelColor="#333"
                name="description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
                placeholder="Teste de 500 requisições simultâneas"
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
                <FiZap />
                Configurações de carga
              </SectionTitle>

              <div style={{ display: "flex", gap: "16px" }}>
                <div style={{ width: "60%" }}>
                  <Input
                    labelColor="#333"
                    label="Quantidade de conexões simultâneas"
                    name="connections"
                    onChange={(e) => setConnections(e.target.value)}
                    type="number"
                    required
                    placeholder="Digite a quantidade de connections simultâneas. Ex: 50"
                  />
                </div>
                <div style={{ width: "40%" }}>
                  <Input
                    labelColor="#333"
                    label="Quantidade de Worker Threads"
                    name="workers"
                    onChange={(e) => setWorkers(e.target.value)}
                    type="number"
                    required
                    placeholder="Entre 0 e 16"
                  />
                </div>
                <div>
                  <div>
                    <FiHelpCircle
                      color={"#555"}
                      onMouseEnter={() => setTooltip(true)}
                      onMouseLeave={() => setTooltip(false)}
                    />
                    {tooltip && (
                      <div
                        style={{
                          position: "absolute",
                          background: "#222",
                          padding: "12px",
                          borderRadius: "4px",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                          width: "230px",
                        }}
                      >
                        <p style={{ fontSize: "14px", color: "#fafafa" }}>
                          100 connections com 4 workers = 4 threads simulando 25
                          usuários cada.
                        </p>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div style={{ width: "40%", marginTop: "8px" }}>
                <Input
                  labelColor="#333"
                  label="Duração do teste"
                  name="duration"
                  value={duration}
                  onChange={(e) => setDuration(e.target.value)}
                  type="number"
                  required
                  placeholder="Tempo (em segundos) do teste. Ex: 10"
                />
              </div>
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
          </LoadContainer>
        </StyledForm>
      )}
    </ContainerMid>
  );
};

export default LoaderPage;
