import axios, { AxiosHeaders } from "axios";
import React from "react";
import GetToken from "../services/GetToken";
import useApi from "../hooks/useApi";
import { TestsList } from "../Interfaces/TestsList";
import styled from "styled-components";
import { FiTrash, FiInfo } from "react-icons/fi";
import Loader from "../helpers/Loader";
import Toast from "../helpers/Toast";
import ToastSuccess from "../helpers/ToastSuccess";
import ModalRun from "./ModalRun.tsx";
import EnvsVars from "../services/EnvsVars";
import { useLocation } from "react-router";
import { TitleSedwick } from "./RenderLogsTests.tsx";
import useUser from "../hooks/useUser.ts";

const TableContainer = styled.div`
  width: 100%;
  margin: 24px;
  overflow-x: auto;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);

  @media (max-width: 768px) {
    width: 100%;
    margin: 10px 0;
    border-radius: 0;
  }
`;

const StyledTable = styled.table`
  width: 100%;
  border-collapse: collapse;
  border-radius: 12px;
  overflow: hidden;

  @media (max-width: 768px) {
    font-size: 14px;
  }
`;

const TableHeader = styled.thead`
  background: #2ecc71;
  color: #f8f9fa;
  text-transform: uppercase;
  font-weight: bold;
`;

const TableRow = styled.tr`
  &:nth-child(even) {
    background: #f8f8f8;
  }

  &:hover {
    background: rgba(46, 204, 113, 0.1);
    transition: all 0.3s ease;
  }

  cursor: pointer;
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  color: #505050;
  vertical-align: middle;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const TableHeaderCell = styled.th`
  padding: 15px;
  text-align: left;

  @media (max-width: 768px) {
    padding: 10px;
  }
`;

const EmptyRow = styled.tr`
  height: 100px;
`;

const EmptyCell = styled(TableCell)`
  text-align: center;
  color: #888;
  font-style: italic;
`;

export const MethodBadge = styled.span<{ method: string }>`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  width: fit-content;

  color: ${(props) => {
    switch (props.method) {
      case "GET":
        return "#27ae60";
      case "POST":
        return "#2980b9";
      case "PUT":
        return "#d35400";
      case "DELETE":
        return "#c0392b";
      case "PATCH":
        return "#8e44ad";
      default:
        return "#7f8c8d";
    }
  }};
`;

const UrlText = styled.div`
  color: #2980b9;
  max-width: 250px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  font-size: 13px;

  &:hover {
    text-decoration: underline;
  }
`;

const Description = styled.div`
  font-weight: 500;
  color: #333;
`;

const ActionsCell = styled(TableCell)`
  width: 80px;
  text-align: center;
`;

const ActionButton = styled.div`
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: rgba(231, 76, 60, 0.1);
  color: #e74c3c;
  cursor: pointer;
  transition: all 0.2s ease;

  &:hover {
    background: #e74c3c;
    color: white;
    transform: scale(1.1);
    box-shadow: 0 2px 5px rgba(0, 0, 0, 0.1);
  }
`;

const EmptyStateMessage = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: column;
  gap: 10px;
  padding: 20px;
  color: #777;

  svg {
    font-size: 24px;
    color: #2ecc71;
    opacity: 0.7;
  }
`;

console.log(EnvsVars.API_URL);

const RenderExistingTests = ({ onTestCountChange }: { onTestCountChange: (count: number) => void }) => {
  const [deleteTestLoading, setDeleteTestLoading] = React.useState(false);
  const [deleteTestError, setDeleteTestError] = React.useState(false);
  const [deleteTest, setDeleteTest] = React.useState(false);
  const [tests, setTests] = React.useState<TestsList[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<TestsList | null>(
    null,
  );

  const user = useUser();

  const location = useLocation();

  const headerMemo = React.useMemo(() => {
    return new AxiosHeaders({
      "Content-Type": "application/json",
      Authorization: `Bearer ${GetToken()}`,
    });
  }, []);

  const {
    data: userTests,
    isLoading,
    error,
  } = useApi<TestsList[]>(
    "GET",
    `${EnvsVars.API_URL}/tests/find-tests`,
    null,
    headerMemo,
  );

  React.useEffect(() => {
    if (userTests) {
      const filteringTypesIntegration = userTests.filter(
        (test) => test.type === "integration",
      );
      const filteringTypesLoad = userTests.filter(
        (test) => test.type === "load",
      );

      if (location.pathname === "/interno/integration")
        setTests(filteringTypesIntegration);
      if (location.pathname === "/interno/load") setTests(filteringTypesLoad);
    }
  }, [userTests, location]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return (
      <Toast position={"top-right"} message="Erro ao carregar os testes" />
    );
  }

  const handleDeleteTest = async (id: number) => {
    setDeleteTestLoading(true);
    setDeleteTestError(false);
    setDeleteTest(false);

    try {
      const deleteTest = await axios.delete(
        `http://localhost:3000/tests/delete/${id}`,
        { headers: headerMemo },
      );

      setDeleteTest(true);

      setTests((prev) => prev.filter((test) => test.id !== id));
      return deleteTest;
    } catch (err) {
      console.warn(err);
      setDeleteTestError(true);
    } finally {
      setDeleteTestLoading(false);
    }
    if (deleteTestLoading) {
      return <Loader />;
    }

    if (deleteTestError) {
      return <Toast message="Erro ao excluir o teste" />;
    }

    if (deleteTest) {
      return <ToastSuccess message="Teste excluído com sucesso" />;
    }
  };

  const handleModalOpenning = (test: TestsList) => {
    setSelectedTest(test);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setSelectedTest(null);
    setIsModalOpen(false);
  };

  const titleLimitSetter = () => {
    if (location.pathname === "/interno/integration") {
      if(tests.length >= Number(EnvsVars.LIMIT_TESTS_PER_TEST_TYPE) && user?.role === "free") return "Limite de testes atingido em APIs"
      return "Testes de API";
    }

    if (location.pathname === "/interno/load") {
      if(tests.length >= Number(EnvsVars.LIMIT_TESTS_PER_TEST_TYPE) && user?.role === "free") return "Limite de testes atingido em Cargas"
      return "Testes de carga";
    }
  }

  onTestCountChange(tests.length);

  return (
    <>
      <TitleSedwick style={{ marginBottom: "2rem", marginTop: "3rem" }}>
        {titleLimitSetter()}
      </TitleSedwick>
      <TableContainer>
        {deleteTest && <ToastSuccess message="Teste excluído com sucesso" />}
        <StyledTable>
          <TableHeader>
            <tr>
              <TableHeaderCell>Descrição</TableHeaderCell>
              <TableHeaderCell>Método</TableHeaderCell>
              <TableHeaderCell>URL</TableHeaderCell>
              <TableHeaderCell>Ações</TableHeaderCell>
            </tr>
          </TableHeader>
          <tbody>
            {tests.length > 0 ? (
              tests.map((test, id) => (
                <TableRow key={id} onClick={() => handleModalOpenning(test)}>
                  <TableCell>
                    <Description>{test.description}</Description>
                  </TableCell>
                  <TableCell>
                    <MethodBadge method={test.config.method}>
                      {test.config.method}
                    </MethodBadge>
                  </TableCell>
                  <TableCell>
                    <UrlText>{test.config.url}</UrlText>
                  </TableCell>

                  <ActionsCell>
                    <ActionButton
                      onClick={(e) => {
                        handleDeleteTest(test.id);
                        e.stopPropagation();
                      }}
                    >
                      <FiTrash size={16} />
                    </ActionButton>
                  </ActionsCell>
                </TableRow>
              ))
            ) : (
              <EmptyRow>
                <EmptyCell colSpan={6}>
                  <EmptyStateMessage>
                    <FiInfo size={24} />
                    <span>Nenhum teste cadastrado</span>
                  </EmptyStateMessage>
                </EmptyCell>
              </EmptyRow>
            )}
          </tbody>
        </StyledTable>
        {selectedTest && (
          <ModalRun
            alwaysHaveData={false}
            testProps={selectedTest}
            isOpen={isModalOpen}
            onClose={handleCloseModal}
          />
        )}
      </TableContainer>
    </>
  );
};

export default RenderExistingTests;
