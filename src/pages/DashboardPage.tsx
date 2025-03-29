import { FiGitBranch, FiLoader, FiPercent } from "react-icons/fi";
import ComponentButton from "../components/Button";
import CardAtalho from "../components/CardAtalho";
import styled from "styled-components";

const CardsContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 16px;
  width: 100%;

  padding: 20px;
  transition: margin-left 0.3s ease-in-out;

  @media (max-width: 768px) {
    padding: 10px;
  }

  .cards-container {
    display: flex;
    margin-top: 36px;
    flex-wrap: wrap;
    flex-direction: row;
    gap: 80px;
  }
`;

const DashboardPage = () => {
  return (
    <>
      <CardsContainer>
        <div className="cards-container">
          <CardAtalho
            title="Testes de integração"
            to="/interno/integration"
            icon={<FiPercent />}
            description="Realize testes de integração rapidamente."
            button={
              <ComponentButton
                label="Acessar"
                size="medium"
                variant="primary"
              />
            }
          />
          <CardAtalho
            title="Testes de performance"
            to="/interno/performance"
            icon={<FiGitBranch />}
            description="Realize testes de performance rapidamente."
            button={
              <ComponentButton
                label="Acessar"
                size="medium"
                variant="primary"
              />
            }
          />
          <CardAtalho
            title="Testes de carregamento"
            to="/interno/load"
            icon={<FiLoader />}
            description="Realize testes de carregamento rapidamente."
            button={
              <ComponentButton
                label="Acessar"
                size="medium"
                variant="primary"
              />
            }
          />
        </div>
      </CardsContainer>
    </>
  );
};

export default DashboardPage;
