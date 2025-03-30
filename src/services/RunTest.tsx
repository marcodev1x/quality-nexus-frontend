import React from "react";
import { TestRunResponse } from "../types/TestRunResponse";
import { TestsList } from "../Interfaces/TestsList";
import Toast from "../helpers/Toast";
import axios from "axios";
import Loader from "../helpers/Loader";
import ComponentButton from "../components/Button";
import EnvsVars from "./EnvsVars";
import GetToken from "./GetToken";

const RunTest = ({ test }: { test: TestsList }) => {
  const [runTest, setRunTest] = React.useState<TestRunResponse | null>(null);
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const handleRunTest = React.useCallback(async () => {
    setIsLoading(true);
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
      setIsLoading(false);
    }
  }, [test]);

  if (error) return <Toast message={"Erro ao executar o teste"} />;

  if (isLoading) return <Loader />;

  const returnResponse = () => {
    if (!runTest?.response) return;

    if (Array.isArray(runTest.response)) {
      runTest.response.map((r) => r);
    }

    return JSON.stringify(runTest.response);
  };
  return (
    <>
      <ComponentButton
        onClick={handleRunTest}
        label={"Rodar teste"}
        size={"medium"}
        variant={"primary"}
      />
      {runTest && (
        <div>
          <h2>Resultado do teste</h2>
          <p>Status: {runTest.status}</p>
          <p>Tempo de execução: {runTest.duration} ms</p>
          <p>Corpo da resposta: {returnResponse()}</p>
          {runTest.passed ? (
            <p>Resultado: PASSOU {runTest.result}</p>
          ) : (
            <p>Resultado: NÃO PASSOU {runTest.result}</p>
          )}
          {!runTest.passed && <p>Valor retornado: {runTest.error}</p>}
        </div>
      )}
    </>
  );
};

export default RunTest;
