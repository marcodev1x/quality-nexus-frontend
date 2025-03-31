import axios, { AxiosHeaders } from "axios";
import React from "react";
import GetToken from "../services/GetToken";
import useApi from "../hooks/useApi";
import { TestsList } from "../Interfaces/TestsList";
import styled from "styled-components";
import { FiTrash, FiInfo, FiPlay } from "react-icons/fi";
import Loader from "../helpers/Loader";
import Toast from "../helpers/Toast";
import ToastSuccess from "../helpers/ToastSuccess";
import ModalRun from "./ModalRun.tsx";
import EnvsVars from "../services/EnvsVars";

const TableContainer = styled.div`
  width: 90%;
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
    border-left: 3px solid #2ecc71;
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

const MethodBadge = styled.span`
  display: inline-block;
  padding: 4px 12px;
  border-radius: 30px;
  font-size: 12px;
  font-weight: 600;
  letter-spacing: 0.5px;
  background: ${(props) => {
    switch (props.method) {
      case "GET":
        return "rgba(46, 204, 113, 0.15)";
      case "POST":
        return "rgba(52, 152, 219, 0.15)";
      case "PUT":
        return "rgba(243, 156, 18, 0.15)";
      case "DELETE":
        return "rgba(231, 76, 60, 0.15)";
      case "PATCH":
        return "rgba(155, 89, 182, 0.15)";
      default:
        return "rgba(149, 165, 166, 0.15)";
    }
  }};
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

const ExpectationsText = styled.div`
  max-width: 300px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  color: #555;
  font-size: 13px;
  padding-right: 10px;

  &:hover {
    white-space: normal;
    word-break: break-word;
  }
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

const IdCell = styled(TableCell)`
  font-weight: 600;
  color: #2ecc71;
  text-align: center;
  width: 60px;
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

const RenderExistingTests = () => {
  const [deleteTestLoading, setDeleteTestLoading] = React.useState(false);
  const [deleteTestError, setDeleteTestError] = React.useState(false);
  const [deleteTest, setDeleteTest] = React.useState(false);
  const [tests, setTests] = React.useState<TestsList[]>([]);
  const [isModalOpen, setIsModalOpen] = React.useState(false);
  const [selectedTest, setSelectedTest] = React.useState<TestsList | null>(
    null,
  );

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
      setTests(userTests);
    }
  }, [userTests]);

  if (isLoading) {
    return <Loader />;
  }

  if (error) {
    return <Toast message="Erro ao carregar os testes" />;
  }

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

  return (
    <TableContainer>
      {deleteTest && <ToastSuccess message="Teste excluído com sucesso" />}
      <StyledTable>
        <TableHeader>
          <tr>
            <TableHeaderCell>Id</TableHeaderCell>
            <TableHeaderCell>Descrição</TableHeaderCell>
            <TableHeaderCell>Método</TableHeaderCell>
            <TableHeaderCell>URL</TableHeaderCell>
            <TableHeaderCell>Expectations</TableHeaderCell>
            <TableHeaderCell>Ações</TableHeaderCell>
          </tr>
        </TableHeader>
        <tbody>
          {tests.length > 0 ? (
            tests.map((test, id) => (
              <TableRow key={id} onClick={() => handleModalOpenning(test)}>
                <IdCell>{id + 1}</IdCell>
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
                <TableCell>
                  <ExpectationsText>
                    {renderExpectations(test.config.expectations)}
                  </ExpectationsText>
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
          testProps={selectedTest}
          isOpen={isModalOpen}
          onClose={handleCloseModal}
        />
      )}
    </TableContainer>
  );
};

export default RenderExistingTests;
