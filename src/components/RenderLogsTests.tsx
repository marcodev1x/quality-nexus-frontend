import React from "react";
import useApi from "../hooks/useApi.ts";
import EnvsVars from "../services/EnvsVars.ts";
import { AxiosHeaders } from "axios";
import GetToken from "../services/GetToken.tsx";
import styled from "styled-components";
import ContainerMid from "./ContainerMid.tsx";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { MethodBadge } from "./RenderExistingTests.tsx";
import { TestsList } from "../Interfaces/TestsList.tsx";

const TableContainer = styled.div`
  width: 100%;
  margin: 24px 0 0 0;
  overflow-x: auto;
  gap: 2rem;
  display: flex;
  flex: 1 400px;
  position: absolute;
  flex-wrap: wrap;
  padding: 2rem 0 2rem 4px;

  @media (max-width: 768px) {
    width: 100%;
    margin: 10px 0;
    border-radius: 0;
  }
`;

const TableColumn = styled.div<{ status: string }>`
  padding: 24px;
  margin-top: 24px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid #d8d8d8;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  gap: 1rem;
  width: 200px;
`;

const Title = styled.h1`
  font-size: 32px;
  font-weight: 600;
  font-family: "Sedgwick Ave Display";
  word-spacing: 4px;
  color: #2ecc71;
`;

const TitleEvent = styled.h1`
  display: flex;
  gap: 8px;
  font-size: 18px;
  color: #333333;
  font-weight: 600;
`;

const SubTitles = styled.h2`
  font-size: 16px;
  color: #393939;
  font-weight: 600;
`;

const StatusBar = styled.div`
  display: flex;
  align-items: center;
  gap: 6px;
  height: 100%;
`;

const StatusText = styled.p`
  font-size: 16px;
  color: #393939;
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

const RenderLogsTests = () => {
  const headerMemo = React.useMemo(() => {
    return new AxiosHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${GetToken()}`,
    });
  }, []);

  const { data, isLoading, error } = useApi(
    "GET",
    `${EnvsVars.API_URL}/tests/tests-logs`,
    null,
    headerMemo,
  );

  const validateTypeTest = (type: TestsList["type"]) => {
    if (type === "integration") return "Integração";
    if (type === "load") return "Carga";
    if (type === "performance") return "Performance";
    return "N/A";
  };

  const LogsTestsFn = () => {
    let dataToFill: any = data;

    if (Array.isArray(dataToFill)) {
      return dataToFill.map((log, idx) => (
        <TableColumn key={idx} status={log.status}>
          <TitleEvent>
            {log.description}
            <MethodBadge method={log.config.method}>
              {log.config.method}
            </MethodBadge>
            <SubTitles>
              <Badge>{validateTypeTest(log.type)}</Badge>
            </SubTitles>
          </TitleEvent>
          <div style={{ display: "flex", gap: "10px" }}>
            <SubTitles>Status:</SubTitles>
            {log.status === "completed" ? (
              <StatusBar>
                <StatusText>completo</StatusText>
                <FiCheckCircle color={"#2ecc71"} />
              </StatusBar>
            ) : (
              <StatusBar>
                <StatusText>falha</StatusText>
                <FiX color={"#e74c3c"} />
              </StatusBar>
            )}
          </div>
          <p>{formatData(log.createdAt)}</p>
        </TableColumn>
      ));
    }

    return <p>dqokqwodk</p>;
  };

  const TotalTests = () => {
    if (Array.isArray(data)) {
      return <Title>Total de registros: {data.length}</Title>;
    }
  };

  const formatData = (data: Date) => {
    return format(new Date(data), "dd/MM/yyyy HH:mm:ss", {
      locale: ptBR,
    });
  };

  return (
    <>
      {isLoading && <div>Loading...</div>}
      {error && <div>{JSON.stringify(error)}</div>}
      <ContainerMid>
        <TotalTests />
        <TableContainer>
          <LogsTestsFn />
        </TableContainer>
      </ContainerMid>
    </>
  );
};
export default RenderLogsTests;
