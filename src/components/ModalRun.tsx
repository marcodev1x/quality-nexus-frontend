import React from "react";
import { TestsList } from "../Interfaces/TestsList.tsx";
import styled from "styled-components";
import ContainerMid from "./ContainerMid.tsx";
import { FiX, FiExternalLink, FiCode, FiCheckCircle } from "react-icons/fi";
import RunTest from "../services/RunTest.tsx";

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
  backdrop-filter: blur(3px);
`;

const ModalContainer = styled.div`
  background: #fff;
  padding: 32px;
  border-radius: 16px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.15);
  max-width: 950px;
  width: 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: start;
  width: 100%;
  overflow: hidden;
  max-height: 85vh;
  overflow-y: auto;
`;

const CloseButton = styled(FiX)`
  position: absolute;
  top: 24px;
  right: 24px;
  cursor: pointer;
  font-size: 24px;
  color: #666;
  transition: color 0.2s ease;

  &:hover {
    color: #333;
  }
`;

const Title = styled.h2`
  font-size: 26px;
  font-weight: 600;
  color: #222;
  margin-bottom: 16px;
  text-align: left;
  width: 100%;
  padding-bottom: 12px;
  border-bottom: 2px solid #f0f0f0;
`;

const Subtitle = styled.p`
  font-size: 15px;
  color: #555;
  text-align: start;
  justify-content: start;
  align-content: start;
  margin-bottom: 16px;
  display: flex;
  align-items: center;
  gap: 8px;

  strong {
    color: #333;
  }
`;

const UrlText = styled(Subtitle)`
  color: #2563eb;
  font-weight: 500;
  display: flex;
  align-items: center;

  svg {
    margin-right: 6px;
  }
`;

const Badge = styled.span`
  display: inline-flex;
  align-items: center;
  padding: 4px 10px;
  background: #ebf5ff;
  color: #0967d2;
  border-radius: 50px;
  font-size: 13px;
  font-weight: 500;
  margin-left: 8px;
`;

const ConfigContainer = styled.div`
  background: #f8fafc;
  padding: 20px;
  border-radius: 12px;
  width: 95%;
  margin-bottom: 24px;
  gap: 16px;
  display: flex;
  flex: 1;
  flex-direction: column;
  border: 1px solid #e2e8f0;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.05);
`;

const ConfigSectionTitle = styled.div`
  font-size: 15px;
  font-weight: 600;
  color: #334155;
  margin-bottom: 8px;
  display: flex;
  align-items: center;
  gap: 6px;
`;

const ConfigText = styled.div`
  font-size: 14px;
  max-width: 100%;
  color: #555;
  margin: 4px 0;
  word-wrap: break-word;
  overflow-wrap: break-word;
  white-space: pre-wrap;
  display: flex;
  flex-direction: column;
  gap: 6px;
`;

const ConfigItem = styled.div`
  padding: 12px 16px;
  background: #ffffff;
  border: 1px solid #e2e8f0;
  border-radius: 8px;
  font-family: monospace;
  font-size: 13px;
  line-height: 1.5;
  color: #334155;
  overflow-x: auto;
`;

const ExpectationItem = styled.div`
  display: flex;
  gap: 6px;
  align-items: center;
  padding: 10px;
  background: #f1f5f9;
  border-radius: 6px;
  margin-bottom: 6px;

  &:last-child {
    margin-bottom: 0;
  }
`;

const ButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  width: 100%;
  margin-top: 8px;
`;

const MethodBadge = styled.span`
  display: inline-block;
  padding: 4px 8px;
  border-radius: 4px;
  font-weight: 600;
  font-size: 12px;
  letter-spacing: 0.5px;
  background: ${(props) => {
    switch (props.method) {
      case "GET":
        return "#e0f2fe";
      case "POST":
        return "#dcfce7";
      case "PUT":
        return "#fef9c3";
      case "DELETE":
        return "#fee2e2";
      case "PATCH":
        return "#fae8ff";
      default:
        return "#f1f5f9";
    }
  }};
  color: ${(props) => {
    switch (props.method) {
      case "GET":
        return "#0369a1";
      case "POST":
        return "#15803d";
      case "PUT":
        return "#ca8a04";
      case "DELETE":
        return "#b91c1c";
      case "PATCH":
        return "#a21caf";
      default:
        return "#475569";
    }
  }};
`;

const renderExpectations = (
  expectations: TestsList["config"]["expectations"],
) => {
  if (!expectations || !Array.isArray(expectations)) return "N/A";

  return expectations.map((expectation, index) => (
    <ExpectationItem key={index}>
      <FiCheckCircle />
      {`Chave API: ${expectation.key} - Operador: ${expectation.operator} - Esperado: ${expectation.value}`}
    </ExpectationItem>
  ));
};

const renderHeaders = (headers: TestsList["config"]["headers"]) => {
  if (!headers || !Array.isArray(headers)) return "N/A";

  const headerStrings = headers
    .filter((header) => header && header.key && header.value)
    .map((header) => `${header.key}: ${header.value}`);

  return headerStrings.length > 0 ? headerStrings.join("\n") : "N/A";
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
  const [isTestRunning, setIsTestRunning] = React.useState(false);

  const handleTestRunning = (running: boolean) => {
    setIsTestRunning(running);
  };

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

  if (!test) return null;

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
            {!isTestRunning && (
              <>
                <Title>{test.description || "Sem descrição"}</Title>
                <UrlText>
                  <FiExternalLink />
                  {test.config.url || "N/A"}
                </UrlText>
                <Subtitle>
                  <strong>Tipo de teste:</strong>
                  {validateTypeTest(test.type) || "N/A"}
                  <Badge>{validateTypeTest(test.type)}</Badge>
                </Subtitle>
                <ConfigContainer>
                  <ConfigText>
                    <ConfigSectionTitle>Método</ConfigSectionTitle>
                    <MethodBadge method={test.config.method}>
                      {test.config.method || "N/A"}
                    </MethodBadge>
                  </ConfigText>

                  <ConfigText>
                    <ConfigSectionTitle>
                      <FiCode />
                      Headers
                    </ConfigSectionTitle>
                    <ConfigItem>
                      {renderHeaders(test.config.headers)}
                    </ConfigItem>
                  </ConfigText>

                  <ConfigText>
                    <ConfigSectionTitle>
                      <FiCode />
                      Corpo da requisição
                    </ConfigSectionTitle>
                    <ConfigItem>
                      {typeof test.config.body === "object"
                        ? JSON.stringify(test.config.body, null, 2)
                        : test.config.body || "N/A"}
                    </ConfigItem>
                  </ConfigText>

                  <ConfigText>
                    <ConfigSectionTitle>
                      <FiCheckCircle />
                      Expectativas
                    </ConfigSectionTitle>
                    {typeof renderExpectations(test.config.expectations) ===
                    "string" ? (
                      <ConfigItem>
                        {renderExpectations(test.config.expectations)}
                      </ConfigItem>
                    ) : (
                      renderExpectations(test.config.expectations)
                    )}
                  </ConfigText>
                </ConfigContainer>
                <ButtonContainer></ButtonContainer>
              </>
            )}
            <RunTest test={test} onRunningChange={handleTestRunning} />
          </ModalContainer>
        </Background>
      </ContainerMid>
    );
  }
};

export default ModalRun;
