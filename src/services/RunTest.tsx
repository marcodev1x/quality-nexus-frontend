import React from "react";
import { TestRunResponse } from "../types/TestRunResponse";
import { TestsList } from "../Interfaces/TestsList";
import Toast from "../helpers/Toast";
import axios from "axios";
import Loader from "../helpers/Loader";
import ComponentButton from "../components/Button";
import EnvsVars from "./EnvsVars";
import GetToken from "./GetToken";
import styled from "styled-components";
import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";

// Styled Components
const ResultContent = styled.div`
  text-align: start;
  width: 100%;
`;

const ResultTitle = styled.h2`
  font-size: 24px;
  margin-bottom: 20px;
  color: #333;
  border-bottom: 2px solid #f0f0f0;
  padding-bottom: 10px;
`;

const ResultItem = styled.p`
  margin: 12px 0;
  font-size: 14px;
  color: #555;
  line-height: 1.6;
  display: flex;
  flex-direction: column;
`;

const ResultLabel = styled.span`
  font-weight: 600;
  color: #333;
  margin-bottom: 4px;
  display: flex;
  align-items: center;
  gap: 8px;
`;

const ResultValue = styled.span`
  padding: 8px 12px;
  background: #f7f9fc;
  border-radius: 6px;
  font-family: monospace;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
  border: 1px solid #e6e8eb;
`;

const StatusBadge = styled.span<{ passed: boolean }>`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border-radius: 50px;
  font-weight: 500;
  font-size: 14px;
  margin-left: 8px;
  background: ${(props) => (props.passed ? "#e6f7ee" : "#fff1f0")};
  color: ${(props) => (props.passed ? "#2ecc71" : "#f5222d")};
  border: 1px solid ${(props) => (props.passed ? "#b7eb8f" : "#ffccc7")};
`;

const ErrorValue = styled.span`
  padding: 12px;
  background: #fff2f0;
  border: 1px solid #ffccc7;
  border-radius: 6px;
  font-family: monospace;
  color: #f5222d;
  word-break: break-all;
  max-height: 200px;
  overflow-y: auto;
`;

const ExpectationsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  margin-top: 6px;
`;

const ExpectationItem = styled.div<{ status: "passed" | "failed" }>`
  padding: 10px 12px;
  background: ${(props) => (props.status === "passed" ? "#f0fdf4" : "#fff2f0")};
  border: 1px solid
    ${(props) => (props.status === "passed" ? "#b7eb8f" : "#ffccc7")};
  border-radius: 6px;
  font-family: monospace;
  word-break: break-all;
  position: relative;
  padding-left: 32px;
  color: ${(props) => (props.status === "passed" ? "#2ecc71" : "#e53e3e")};

  &:before {
    content: "";
    position: absolute;
    left: 0;
    top: 0;
    bottom: 0;
    width: 4px;
    background: ${(props) =>
      props.status === "passed" ? "#2ecc71" : "#e53e3e"};
    border-top-left-radius: 6px;
    border-bottom-left-radius: 6px;
  }
`;

const ExpectationIcon = styled.div`
  position: absolute;
  left: 10px;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  align-items: center;
  justify-content: center;
`;

const ErrorsList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-top: 6px;
`;

const ErrorDetail = styled.div`
  background: #fff2f0;
  border-left: 4px solid #e53e3e;
  padding: 10px 12px;
  border-radius: 4px;
  margin-bottom: 6px;
  font-family: monospace;
  color: #e53e3e;

  &:last-child {
    margin-bottom: 0;
  }
`;

const NoErrorsBadge = styled.div`
  display: inline-flex;
  align-items: center;
  gap: 6px;
  background: #f0fdf4;
  color: #2ecc71;
  padding: 8px 12px;
  border-radius: 4px;
  font-weight: 500;
`;

const LoaderWrapper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  min-height: 300px;
`;

const RunTest = ({
  test,
  onRunningChange,
}: {
  test: TestsList;
  onRunningChange?: (running: boolean) => void;
}) => {
  const [runTest, setRunTest] = React.useState<TestRunResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);

  const handleRunTest = React.useCallback(async () => {
    setIsLoading(true);
    setIsRunning(true);

    if (onRunningChange) {
      onRunningChange(true);
    }

    if(test.type === 'integration'){
      setTimeout(async () => {
        try {
          const response = await axios.post(
              `${EnvsVars.API_URL}/tests/run-tests`,
              {
                id: test.id,
                description: test.description,
                type: test.type,
                config: test.config,
              },
              {
                headers: {
                  "Content-Type": "application/json",
                  Authorization: `Bearer ${GetToken()}`,
                },
              },
          );
          setRunTest(response.data);
        } catch (err) {
          setError(err as string);
          console.error(err);
        } finally {
          setIsRunning(false);
          setIsLoading(false);
        }
      }, 2820);
    }

   if(test.type === 'load'){
     setTimeout(async () => {
       try{
           const b = 'a'
         console.log(b)
       }catch(err){
         setError(err as string);
         console.error(err);
       }finally {
         setIsRunning(false);
       }
     }, 2820)
   }
  }, [test, onRunningChange]);

  if (error) return <Toast message={"Erro ao executar o teste"} position={'top-right'} />;

  if (isLoading)
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );

  const returnResponse = () => {
    if (!runTest?.APIResponse) return;

    if (Array.isArray(runTest.APIResponse)) {
      runTest.APIResponse.map((r) => r);
    }

    return JSON.stringify(runTest.APIResponse, null, 2);
  };

  const returnExpectationsMapping = () => {
    if (!runTest?.expectations) return "N/A";

    if (runTest?.expectations.length > 0) {
      return runTest.expectations.map((r, index) => (
        <ExpectationItem
          key={index}
          status={r.error || !r.passed ? "failed" : "passed"}
        >
          <ExpectationIcon>
            {r.error || !r.passed ? (
              <FiXCircle color="#e53e3e" />
            ) : (
              <FiCheckCircle color="#2ecc71" />
            )}
          </ExpectationIcon>
          {`Chave API: ${r.key} - Operador: ${r.operator} - Valor esperado: ${r.value}\n -> Valor retornado: ${r.passed?.found ?? "N/A"}\n`}
        </ExpectationItem>
      ));
    }

    return "N/A";
  };

  const findExpectationErrors = () => {
    if (!runTest?.expectations) return null;

    if (runTest?.expectations.length > 0) {
      const errors = runTest.expectations
        .filter((exp) => exp.error)
        .map((exp, index) => (
          <ErrorDetail key={index}>
            <div>
              Expectativa:{" "}
              {`Chave API: ${exp.key} - Operador: ${exp.operator} - Valor esperado: ${exp.value} - Erro retornado: ${exp.error}`}
            </div>
            <div>Erro: {exp.error}</div>
          </ErrorDetail>
        ));

      return errors.length > 0 ? errors : null;
    }

    return null;
  };

  const hasExpectationErrors = () => {
    if (!runTest?.expectations) return false;
    return runTest.expectations.some((exp) => exp.error);
  };

  return (
    <>
      {runTest && (
        <ResultContent>
          <ResultTitle>Resultado do teste</ResultTitle>
          <ResultItem>
            <ResultLabel>Status:</ResultLabel>
            <ResultValue>{runTest.status}</ResultValue>
          </ResultItem>

          <ResultItem>
            <ResultLabel>Corpo da resposta:</ResultLabel>
            <ResultValue>{returnResponse()}</ResultValue>
          </ResultItem>

          <ResultItem>
            <ResultLabel>
              {runTest.passed ? (
                <FiCheckCircle color="#2ecc71" />
              ) : (
                <FiXCircle color="#e53e3e" />
              )}
              Resultado:
            </ResultLabel>
            <ResultValue>
              {runTest.passed ? "PASSOU" : "NÃO PASSOU"}
              <StatusBadge passed={runTest.passed}>
                {runTest.passed ? "SUCESSO" : "FALHA"}
              </StatusBadge>
            </ResultValue>
          </ResultItem>

          {!runTest.passed && (
            <ResultItem>
              <ResultLabel>
                <FiAlertCircle color="#e53e3e" />
                Erros encontrados:
              </ResultLabel>
              {runTest.error ? (
                <ErrorValue>{runTest.error}</ErrorValue>
              ) : hasExpectationErrors() ? (
                <ErrorsList>{findExpectationErrors()}</ErrorsList>
              ) : (
                <NoErrorsBadge>
                  <FiCheckCircle />
                  Sem erros nas expectativas
                </NoErrorsBadge>
              )}
            </ResultItem>
          )}

          <ResultItem>
            <ResultLabel>Valor(es) esperado(s):</ResultLabel>
            <ExpectationsList>{returnExpectationsMapping()}</ExpectationsList>
          </ResultItem>
        </ResultContent>
      )}
      <ComponentButton
        onClick={handleRunTest}
        label={isRunning ? "Executando..." : "Rodar teste"}
        size={"medium"}
        variant={"primary"}
        disabled={isRunning}
      />
    </>
  );
};

export default RunTest;
