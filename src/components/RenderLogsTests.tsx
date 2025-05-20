import React from "react";
import useApi from "../hooks/useApi.ts";
import EnvsVars from "../services/EnvsVars.ts";
import { AxiosHeaders } from "axios";
import GetToken from "../services/GetToken.tsx";
import styled from "styled-components";
import ContainerMid from "./ContainerMid.tsx";
import { addHours, format } from "date-fns";
import { ptBR } from "date-fns/locale";
import { FiCheckCircle, FiX } from "react-icons/fi";
import { MethodBadge } from "./RenderExistingTests.tsx";
import { TestsList } from "../Interfaces/TestsList.tsx";
import ComponentButton from "./Button.tsx";
import ModalRun from "./ModalRun.tsx";
import Loader from "../helpers/Loader.tsx";

const TableContainer = styled.div`
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
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  background: rgba(255, 255, 255, 0.15);
  border: 1px solid #d8d8d8;
  display: flex;
  flex-direction: column;
  border-radius: 8px;
  gap: 1rem;
  width: 400px;
`;

export const TitleSedwick = styled.h1`
  font-size: 32px;
  font-weight: 800;
  font-family: "Segoe UI", Tahoma, Geneva, Verdana, sans-serif;
  word-spacing: 4px;
  color: #433;
`;

const TitleEvent = styled.h1`
  display: flex;
  gap: 8px;
  font-size: 14px;
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
`;

const TitleContainer = styled.div`
  display: flex;
  gap: 1rem;
  height: fit-content;
`;

const RenderLogsTests = () => {
  const [isModalOpen, setIsModalOpen] = React.useState<boolean>(false);
  const [selectedTest, setSelectedTest] = React.useState<null | TestsList>(
    null,
  );

  const headerMemo = React.useMemo(() => {
    return new AxiosHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${GetToken()}`,
    });
  }, []);

  const { data, isLoading } = useApi(
    "GET",
    `${EnvsVars.API_URL}/tests/tests-logs`,
    null,
    headerMemo,
  );

  const handleModalOpenning = (test: any) => {
    const testData = {
      ...test,
      results: test.results || null,
    };
    setSelectedTest(testData);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTest(null);
    setIsModalOpen(false);
  };

  const validateTypeTest = (type: TestsList["type"]) => {
    if (type === "integration") return "API";
    if (type === "load") return "Carga";
    if (type === "performance") return "Performance";
    return "N/A";
  };

  const LogsTestsFn = () => {
    let dataToFill: any = data;

    if (Array.isArray(dataToFill)) {
      if(dataToFill.length === 0) return <div> Nenhum registro de teste encontrado. Comece a testar!</div>

      return dataToFill.map((log, idx) => (
        <TableColumn key={idx} status={log.status}>
          <TitleContainer>
            <TitleEvent>{log.description}</TitleEvent>
            <MethodBadge method={log.config.method}>
              {log.config.method}
            </MethodBadge>
            <SubTitles>
              <Badge>{validateTypeTest(log.type)}</Badge>
            </SubTitles>
          </TitleContainer>
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
          <ComponentButton
            onClick={(e) => {
              e.stopPropagation();
              handleModalOpenning(log);
            }}
            label="Ver logs"
          />
        </TableColumn>
      ));
    }

    return;
  };

  const TotalTests = () => {
    if (Array.isArray(data)) {
      return <TitleSedwick>Histórico de Testes</TitleSedwick>;
    }
  };

  const formatData = (data: Date) => {
    if (!data) return "Sem data definida";

    const BrazilDate = addHours(data, -3);
    return format(new Date(BrazilDate), "dd/MM/yyyy HH:mm:ss", {
      locale: ptBR,
    });
  };

  return (
    <>
      {isLoading && <Loader />}
      <ContainerMid>
        <TotalTests />
        <TableContainer>
          <LogsTestsFn />
        </TableContainer>
        {isModalOpen && selectedTest && (
          <ModalRun
            isOpen={isModalOpen}
            onClose={handleCloseModal}
            testProps={selectedTest}
            alwaysHaveData={true}
          />
        )}
      </ContainerMid>
    </>
  );
};
export default RenderLogsTests;
