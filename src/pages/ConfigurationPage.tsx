import { Outlet } from "react-router";
import ContainerMid from "../components/ContainerMid";
import TabNav from "../components/TabNav.tsx";

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
      <ContainerMid>
        <Outlet />
      </ContainerMid>
    </>
  );
};

export default ConfigurationPage;
