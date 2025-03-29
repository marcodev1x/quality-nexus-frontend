import axios, { AxiosHeaders } from "axios";
import React from "react";
import GetToken from "../services/GetToken";
import useApi from "../hooks/useApi";
import { TestsList } from "../Interfaces/TestsList";
import styled from "styled-components";
import { FiTrash } from "react-icons/fi";
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
    transition: background 0.3s ease;
  }
`;

const TableCell = styled.td`
  padding: 15px;
  text-align: left;
  border-bottom: 1px solid #ddd;
  color: #505050;

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
          {tests.map((test, id) => (
            <TableRow
              key={id}
              style={{ cursor: "pointer" }}
              onClick={() => handleModalOpenning(test)}
            >
              <TableCell>{id + 1}</TableCell>
              <TableCell>{test.description}</TableCell>
              <TableCell>{test.config.method}</TableCell>
              <TableCell>{test.config.url}</TableCell>
              <TableCell>
                {renderExpectations(test.config.expectations)}
              </TableCell>
              <TableCell>
                <FiTrash
                  onClick={(e) => {
                    handleDeleteTest(test.id);
                    e.stopPropagation();
                  }}
                />
              </TableCell>
            </TableRow>
          ))}
          {tests.length === 0 && (
            <TableRow>
              <TableCell colSpan={6}>Nenhum teste cadastrado</TableCell>
            </TableRow>
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
