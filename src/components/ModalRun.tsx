import React from "react";
import { TestsList } from "../Interfaces/TestsList.tsx";
import styled from "styled-components";
import ContainerMid from "./ContainerMid.tsx";
import { FiX } from "react-icons/fi";
import ComponentButton from "./Button.tsx";

const Background = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(0, 0, 0, 0.6);
  z-index: 1000;
`;

const Subtitle = styled.p`
  font-size: 14px;
  color: #666;
  text-align: start;
  justify-content: start;
  align-content: start;
  margin-bottom: 16px;
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 16px rgba(0, 0, 0, 0.2);
  max-width: 950px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
`;

const CloseButton = styled(FiX)`
  position: absolute;
  top: 16px;
  right: 16px;
  cursor: pointer;
  font-size: 20px;
  color: #333;
`;

const Title = styled.h2`
  font-size: 24px;
  font-weight: 600;
  color: #222;
  margin-bottom: 12px;
  text-align: center;
`;

const ConfigContainer = styled.div`
  background: #f4f4f4;
  padding: 16px;
  border-radius: 8px;
  width: 95%;
  margin-bottom: 16px;
  gap: 16px;
  display: flex;
  flex: 1;
  flex-direction: column;
`;

const ConfigText = styled.p`
  font-size: 14px;
  color: #555;
  margin: 4px 0;
  width: auto;
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
`;

const renderExpectations = (
  expectations: TestsList["config"]["expectations"],
) => {
  if (!expectations || !Array.isArray(expectations)) return "N/A";

  return expectations
    .map((expectation) => {
      return `{Chave API: ${expectation.key} - Operador: ${expectation.operator} - Esperado: ${expectation.value}}`;
    })
    .join(", ");
};

const renderHeaders = (headers: TestsList["config"]["headers"]) => {
  if (!headers || !Array.isArray(headers)) return "N/A";

  const headerStrings = headers
    .filter((header) => header && header.key && header.value)
    .map((header) => `${header.key}: ${header.value}`);

  return headerStrings.length > 0 ? headerStrings.join(", ") : "N/A";
};

const ModalRun = ({
  testProps,
  isOpen,
  onClose,
}: {
  testProps: TestsList;
  isOpen: boolean;
  onClose: () => void;
}) => {
  const [test, setTest] = React.useState<TestsList | null>(null);

  const updateTest = React.useCallback(() => {
    if (testProps !== null && isOpen) setTest(testProps);
  }, [testProps, isOpen]);

  const validateTypeTest = (type: TestsList["type"]) => {
    if (type === "integration") return "Integração";
    if (type === "load") return "Carga";
    if (type === "performance") return "Performance";
    return "N/A";
  };

  React.useEffect(() => {
    updateTest();
  }, [updateTest]);

  if (isOpen && test) {
    return (
      <ContainerMid>
        <Background>
          <ModalContainer>
            <CloseButton onClick={onClose} size={25}>
              <FiX
                style={{
                  position: "relative",
                  left: "280px",
                  cursor: "pointer",
                }}
              />
            </CloseButton>
            <Title>{test.description || "Sem descrição"}</Title>
            <Subtitle>URL: {test.config.url || "N/A"}</Subtitle>
            <Subtitle>
              <strong>Tipo de teste: </strong>
              {validateTypeTest(test.type) || "N/A"}
            </Subtitle>
            <ConfigContainer>
              <ConfigText>
                <strong>Metodo:</strong> {test.config.method || "N/A"}
              </ConfigText>
              <ConfigText>
                <strong>Headers:</strong> {renderHeaders(test.config.headers)}
              </ConfigText>
              <ConfigText>
                <strong>Corpo da requisição:</strong>{" "}
                {typeof test.config.body === "object"
                  ? JSON.stringify(test.config.body)
                  : test.config.body || "N/A"}
              </ConfigText>
              <ConfigText>
                <strong>Esperados:</strong>{" "}
                {renderExpectations(test.config.expectations)}
              </ConfigText>
            </ConfigContainer>
            <ButtonContainer>
              <ComponentButton
                label={"Rodar teste"}
                size={"medium"}
                variant={"primary"}
              />
            </ButtonContainer>
          </ModalContainer>
        </Background>
      </ContainerMid>
    );
  }
};
export default ModalRun;
