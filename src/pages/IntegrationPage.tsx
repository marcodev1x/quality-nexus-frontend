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

const IntegrationContainer = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  gap: 24px;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 16px;
  background: #fff;
  padding: 24px;
  border-radius: 12px;
  box-shadow: 0px 4px 12px rgba(0, 0, 0, 0.1);
  max-width: 900px;
  min-height: 400px;
  width: 100%;
  margin: auto;
  justify-content: center;
  align-items: center;
`;

const FormTitle = styled.h2`
  font-size: 22px;
  font-weight: 600;
  color: #222;
  margin-bottom: 8px;
  text-align: center;
`;

const FormSubtitle = styled.p`
  font-size: 14px;
  color: #666;
  text-align: center;
  margin-bottom: 16px;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 8px;
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
  const [addTest, setAddTest] = React.useState(false);
  const [expectations, setExpectations] = React.useState<
    { key: string; expected: string; value: string }[]
  >([]);

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
        "http://localhost:3000/tests/create",
        {
          type: "integration",
          description: description,
          config: {
            method: selectedMethod,
            url,
            headers,
            body,
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

  console.log(expectations);

  return (
    <ContainerMid>
      {error && <Toast message={error} />}
      {!isLoading && !addTest && (
        <FirstTopContainer>
          <ComponentButton
            label="Adicionar teste"
            size="large"
            variant="contained"
            onClick={() => setAddTest(true)}
          />
        </FirstTopContainer>
      )}
      {!isLoading && !addTest && <RenderExistingTests />}
      {isLoading && <Loader />}
      {!isLoading && addTest && (
        <StyledForm
          onSubmit={sendForm}
          style={{
            display: "flex",
            flexDirection: "column",
            gap: "16px",
            marginTop: "48px",
          }}
        >
          <FormTitle>Novo Teste</FormTitle>
          <FormSubtitle>
            Defina os detalhes do seu teste de integração
          </FormSubtitle>
          <IntegrationContainer>
            <TextArea
              label="Descreva seu teste"
              labelColor="#222"
              name="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
              placeholder="Descreva seu teste"
            />
            <InputSelect
              label="Selecione o método HTTP"
              options={arrayOptions}
              changeState={setSelectedMethod}
              required
            />
            <Input
              labelColor="#222"
              label="URL"
              name="url"
              value={url}
              onChange={(e) => setUrl(e.target.value)}
              type="url"
              required
            />
            <DynamicHeaders headers={headers} setHeaders={setHeaders} />
            <DynamicExpecationInput
              expectation={expectations}
              setExpectations={setExpectations}
            />
            <TextArea
              label="Corpo da requisição"
              labelColor="#222"
              name="body"
              value={body}
              onChange={(e) => setBody(e.target.value)}
              placeholder="Corpo da requisição"
            />
            <ButtonContainer>
              <ComponentButton
                label="Salvar teste"
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
