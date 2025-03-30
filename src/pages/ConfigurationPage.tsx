import { Outlet } from "react-router";
import TabNav from "../components/TabNav.tsx";
import styled from "styled-components";

const ContainerConfig = styled.div`
  display: flex;
  flex-direction: column;
  align-items: start;
  justify-content: center;
  padding: 44px;
`;

const ConfigurationPage = () => {
  const configRouters = [
    {
      nameRouter: "Usuário",
      routePush: "/configuracoes/user",
    },
    {
      nameRouter: "Plano",
      routePush: "/configuracoes/plan",
    },
  ];

  return (
    <>
      <TabNav pageOptions={configRouters} />
      <>
        <ContainerConfig>
          <Outlet />
        </ContainerConfig>
      </>
    </>
  );
};

export default ConfigurationPage;
