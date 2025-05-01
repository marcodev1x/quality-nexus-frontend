import React from "react";
import { TestLoadResponse, TestRunResponse } from "../types/TestRunResponse";
import { TestsList } from "../Interfaces/TestsList";
import Toast from "../helpers/Toast";
import axios from "axios";
import Loader from "../helpers/Loader";
import ComponentButton from "../components/Button";
import EnvsVars from "./EnvsVars";
import GetToken from "./GetToken";
import styled from "styled-components";
import { FiCheckCircle, FiXCircle, FiAlertCircle } from "react-icons/fi";
import { BarChart, LineChart, PieChart } from "@mui/x-charts";

const ResultContent = styled.div`
  text-align: start;
  width: 100%;
`;

const DivisionLine = styled.hr`
  border: 1px solid #e6e8eb;
  margin: 20px 0;
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
  white-space: pre;
`;

const ResultValueGraph = styled.span`
  padding: 8px 12px;
  border-radius: 6px;
  background: #f7f9fc;
  font-family: monospace;
  word-break: break-all;
  max-height: 300px;
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
  alwaysHaveData = false,
}: {
  test: TestsList;
  onRunningChange?: (running: boolean) => void;
  alwaysHaveData?: boolean;
}) => {
  const [runTest, setRunTest] = React.useState<TestRunResponse | null>(null);
  const [runLoadTest, setRunLoadTest] = React.useState<TestLoadResponse | null>(
    null,
  );
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const [isRunning, setIsRunning] = React.useState<boolean>(false);

  const handleRunTest = React.useCallback(async () => {
    if (test.type === "integration" && alwaysHaveData) {
      setRunTest(test.results);
      return;
    }

    if (!alwaysHaveData) {
      setIsLoading(true);
      setIsRunning(true);

      if (onRunningChange) {
        onRunningChange(true);
      }

      if (test.type === "integration") {
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
      }
    }

    if (test.type === "load" && alwaysHaveData) {
      setRunLoadTest(test.results);
      console.log(test, test.results, runLoadTest);
      return;
    }

    if (test.type === "load") {
      try {
        const response = await axios.post(
          `${EnvsVars.API_URL}/tests/run-tests-load`,
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
        setRunLoadTest(response.data);
      } catch (err) {
        setError(err as string);
        console.error(err);
      } finally {
        setIsRunning(false);
        setIsLoading(false);
      }
    }
  }, [test, onRunningChange]);

  if (error)
    return (
      <Toast message={"Erro ao executar o teste"} position={"top-right"} />
    );

  if (isLoading)
    return (
      <LoaderWrapper>
        <Loader />
      </LoaderWrapper>
    );

  const returnResponse = () => {
    if (test.results?.axiosData)
      return JSON.stringify(test.results?.axiosData, null, 2);

    if (!runTest?.APIResponse) return;

    if (Array.isArray(runTest.APIResponse)) {
      runTest.APIResponse.map((r) => r);
    }

    return JSON.stringify(runTest.APIResponse, null, 2);
  };

  const returnLoadResponse = () => {
    if (!runLoadTest) return;

    return JSON.stringify(runLoadTest, null, 2);
  };

  const returnExpectationsMapping = () => {
    if (test.results?.resolvedResults)
      return test.results?.resolvedResults.map((r: any, index: any) => (
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

  if (runTest && test.type === "integration" && !alwaysHaveData) {
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
        {!alwaysHaveData && (
          <ComponentButton
            onClick={handleRunTest}
            label={isRunning ? "Executando..." : "Rodar teste novamente"}
            size={"medium"}
            variant={"primary"}
            disabled={isRunning}
          />
        )}
        {alwaysHaveData && (
          <ComponentButton
            onClick={handleRunTest}
            label={isRunning ? "Executando..." : "Rodar teste novamente"}
            size={"medium"}
            variant={"primary"}
            disabled={isRunning}
          />
        )}
      </>
    );
  }

  if (runTest && test.type === "integration" && alwaysHaveData) {
    return (
      <>
        {runTest && (
          <ResultContent>
            <ResultTitle>Resultado do teste</ResultTitle>
            <ResultItem>
              <ResultLabel>Status:</ResultLabel>
              <ResultValue>{test.results?.axiosStatus}</ResultValue>
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
        {!alwaysHaveData && (
          <ComponentButton
            onClick={handleRunTest}
            label={isRunning ? "Executando..." : "Rodar teste novamente"}
            size={"medium"}
            variant={"primary"}
            disabled={isRunning}
          />
        )}
        {alwaysHaveData && (
          <ComponentButton
            onClick={handleRunTest}
            label={isRunning ? "Executando..." : "Rodar teste novamente"}
            size={"medium"}
            variant={"primary"}
            disabled={isRunning}
          />
        )}
      </>
    );
  }

  if (runLoadTest && test.type === "load" && !alwaysHaveData) {
    return (
      <>
        <ResultContent>
          <ResultTitle>Resultado do teste</ResultTitle>
          <ResultItem>
            <ResultLabel>Informações básicas essenciais:</ResultLabel>
            <ResultValueGraph>
              <p>
                <b>Total de requisições:</b> {runLoadTest.requests.total}
              </p>
              <p>
                <b>Duração de teste:</b> {runLoadTest.duration}s
              </p>
              <DivisionLine />
              <p>
                <b>Status 1xx</b> : {runLoadTest["1xx"]}x
              </p>
              <p>
                <b> Status 2xx</b>: {runLoadTest["2xx"]}x
              </p>
              <p>
                <b> Status 3xx</b>: {runLoadTest["3xx"]}x
              </p>
              <p>
                <b> Status 4xx</b>: {runLoadTest["4xx"]}x
              </p>
              <p>
                <b>Status 5xx</b>: {runLoadTest["5xx"]}x
              </p>
              <DivisionLine />
              <p>
                <b>Throughput médio</b>:{" "}
                {runLoadTest.throughput.average.toFixed(0)} KB/s
              </p>
            </ResultValueGraph>
          </ResultItem>

          <ResultItem>
            <ResultLabel>Dados de efetividade:</ResultLabel>
            <ResultValueGraph>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: runLoadTest["2xx"],
                        label: "Sucessos",
                        color: "#2ecc71",
                      },
                      {
                        id: 1,
                        value: runLoadTest.errors,
                        label: "Erros",
                        color: "#e53e3e",
                      },
                      {
                        id: 2,
                        value: runLoadTest.timeouts,
                        label: "Timeouts",
                        color: "#f39c12",
                      },
                      {
                        id: 3,
                        value: runLoadTest["non2xx"],
                        label: "Não 2xx",
                        color: "#ccc",
                      },
                    ],
                  },
                ]}
                width={900}
                height={300}
              />
            </ResultValueGraph>
          </ResultItem>

          <ResultItem>
            <ResultLabel>Tempos de resposta (em milisegundos):</ResultLabel>
            <ResultValueGraph style={{ height: "800px" }}>
              <LineChart
                xAxis={[
                  {
                    data: [
                      "Min. latência",
                      "50% demoraram",
                      "75% demoraram",
                      "90% demoraram",
                      "99% demoraram",
                      "Máx." + " latência",
                    ],
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: [
                      runLoadTest.latency.min,
                      runLoadTest.latency.p50,
                      runLoadTest.latency.p75,
                      runLoadTest.latency.p90,
                      runLoadTest.latency.p99,
                      runLoadTest.latency.max,
                    ],
                    color: "#2ecc71",
                  },
                ]}
                width={900}
                height={300}
              />
            </ResultValueGraph>
          </ResultItem>

          <ResultItem>
            <ResultLabel>Requisições por segundo:</ResultLabel>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["Média/s", "Máx/s", "Mín/s", "Desvio"],
                },
              ]}
              series={[
                {
                  data: [
                    runLoadTest.requests.average,
                    runLoadTest.requests.max,
                    runLoadTest.requests.min,
                    runLoadTest.requests.stddev,
                  ],
                  color: "#2ecc71",
                },
              ]}
              width={900}
              height={300}
            />
          </ResultItem>

          <ResultItem>
            <ResultLabel>Dados brutos do teste:</ResultLabel>
            <ResultValue>{returnLoadResponse()}</ResultValue>
          </ResultItem>
        </ResultContent>
      </>
    );
  }

  if (runLoadTest && test.type === "load" && alwaysHaveData) {
    return (
      <>
        <ResultContent>
          <ResultTitle>Resultado do teste</ResultTitle>
          <ResultItem>
            <ResultLabel>Informações básicas essenciais:</ResultLabel>
            <ResultValueGraph>
              <p>
                <b>Total de requisições:</b> {runLoadTest.requests.total}
              </p>
              <p>
                <b>Duração de teste:</b> {runLoadTest.duration}s
              </p>
              <DivisionLine />
              <p>
                <b>Status 1xx</b> : {runLoadTest["1xx"]}x
              </p>
              <p>
                <b> Status 2xx</b>: {runLoadTest["2xx"]}x
              </p>
              <p>
                <b> Status 3xx</b>: {runLoadTest["3xx"]}x
              </p>
              <p>
                <b> Status 4xx</b>: {runLoadTest["4xx"]}x
              </p>
              <p>
                <b>Status 5xx</b>: {runLoadTest["5xx"]}x
              </p>
              <DivisionLine />
              <p>
                <b>Throughput médio</b>:{" "}
                {runLoadTest.throughput.average.toFixed(0)} KB/s
              </p>
            </ResultValueGraph>
          </ResultItem>

          <ResultItem>
            <ResultLabel>Dados de efetividade:</ResultLabel>
            <ResultValueGraph>
              <PieChart
                series={[
                  {
                    data: [
                      {
                        id: 0,
                        value: runLoadTest["2xx"],
                        label: "Sucessos",
                        color: "#2ecc71",
                      },
                      {
                        id: 1,
                        value: runLoadTest.errors,
                        label: "Erros",
                        color: "#e53e3e",
                      },
                      {
                        id: 2,
                        value: runLoadTest.timeouts,
                        label: "Timeouts",
                        color: "#f39c12",
                      },
                      {
                        id: 3,
                        value: runLoadTest["non2xx"],
                        label: "Não 2xx",
                        color: "#ccc",
                      },
                    ],
                  },
                ]}
                width={900}
                height={300}
              />
            </ResultValueGraph>
          </ResultItem>

          <ResultItem>
            <ResultLabel>Tempos de resposta (em milisegundos):</ResultLabel>
            <ResultValueGraph style={{ height: "800px" }}>
              <LineChart
                xAxis={[
                  {
                    data: [
                      "Min. latência",
                      "50% demoraram",
                      "75% demoraram",
                      "90% demoraram",
                      "99% demoraram",
                      "Máx." + " latência",
                    ],
                    scaleType: "band",
                  },
                ]}
                series={[
                  {
                    data: [
                      runLoadTest.latency.min,
                      runLoadTest.latency.p50,
                      runLoadTest.latency.p75,
                      runLoadTest.latency.p90,
                      runLoadTest.latency.p99,
                      runLoadTest.latency.max,
                    ],
                    color: "#2ecc71",
                  },
                ]}
                width={900}
                height={300}
              />
            </ResultValueGraph>
          </ResultItem>

          <ResultItem>
            <ResultLabel>Requisições por segundo:</ResultLabel>
            <BarChart
              xAxis={[
                {
                  scaleType: "band",
                  data: ["Média/s", "Máx/s", "Mín/s", "Desvio"],
                },
              ]}
              series={[
                {
                  data: [
                    runLoadTest.requests.average,
                    runLoadTest.requests.max,
                    runLoadTest.requests.min,
                    runLoadTest.requests.stddev,
                  ],
                  color: "#2ecc71",
                },
              ]}
              width={900}
              height={300}
            />
          </ResultItem>

          <ResultItem>
            <ResultLabel>Dados brutos do teste:</ResultLabel>
            <ResultValue>{returnLoadResponse()}</ResultValue>
          </ResultItem>
        </ResultContent>
      </>
    );
  }

  return (
    <>
      <ComponentButton
        onClick={handleRunTest}
        label={
          isRunning
            ? "Executando..."
            : alwaysHaveData
              ? "Ver registros anteriores"
              : "Rodar teste"
        }
        size={"medium"}
        variant={"primary"}
        disabled={isRunning}
      />
    </>
  );
};

export default RunTest;
