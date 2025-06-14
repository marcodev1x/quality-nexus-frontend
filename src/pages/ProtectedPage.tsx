import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import GetToken from "../services/GetToken";
import styled from "styled-components";
import LateralMenu from "../components/LateralMenu";
import axios from "axios";
import { UserResponse } from "../types/UserResponse";
import UserContext from "../contexts/userContext";
import EnvsVars from "../services/EnvsVars";
import TallyForm from "../components/TallyForm";

const Layout = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
  position: relative;

  &::before,
  &::after {
    content: "";
    position: fixed;
    border-radius: 50%;
    filter: blur(80px);
    opacity: 0.4;
    z-index: -1;
  }

  &::before {
    background: #2ecc71; /* Verde principal */
    width: 300px;
    height: 300px;
    top: -50px;
    left: 30%;
    animation: float1 8s ease-in-out infinite;
  }

  &::after {
    background: #27ae60; /* Verde secundário */
    width: 400px;
    height: 400px;
    bottom: 10%;
    right: 20%;
    animation: float2 10s ease-in-out infinite;
  }

  @keyframes float1 {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(15px, 15px);
    }
    100% {
      transform: translate(0, 0);
    }
  }

  @keyframes float2 {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(-15px, 15px);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;

const Content = styled.main`
  flex: 1;
  position: relative;
  z-index: 1;

  &::before {
    content: "";
    position: fixed;
    width: 250px;
    height: 250px;
    background: #1abc9c; /* Verde azulado */
    border-radius: 50%;
    filter: blur(70px);
    opacity: 0.3;
    top: 60%;
    left: 10%;
    z-index: -1;
    animation: float3 12s ease-in-out infinite;
  }

  @keyframes float3 {
    0% {
      transform: translate(0, 0);
    }
    50% {
      transform: translate(10px, -15px);
    }
    100% {
      transform: translate(0, 0);
    }
  }
`;

const ProtectedPage = () => {
  const verifyAuth = GetToken();
  const [user, setUser] = useState<UserResponse | null>(null);
  const [quantityAccess, setQuantityAccess] = useState<number>(0);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`${EnvsVars.API_URL}/user/public`, {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.warn("Erro ao buscar usuário", err);
      }
    };

    const fetchQuantityAccess = async () => {
      try {
        const response = await axios.get(`${EnvsVars.API_URL}/user/quantity-access`, {
          headers: {
            Authorization: `Bearer ${GetToken() || null}`
          }
        })
        setQuantityAccess(response.data.quantityAccess)
      } catch(err) {
        console.warn("Erro ao buscar quantidade de acesso", err);
      }
    }

    if (verifyAuth) {
      fetchUser();
      fetchQuantityAccess();
    }
  }, [verifyAuth]);

  console.log(quantityAccess)

  if (!verifyAuth) return <Navigate to="/" />;

  Tally.loadEmbeds();


  return (
    <UserContext.Provider value={user}>
      <TallyForm src="https://tally.so/embed/nG4zR2?hideTitle=1&transparentBackground=1&dynamicHeight=1" quantityAccess={quantityAccess} formCode="nG4zR2"/>
      <Layout>
        <LateralMenu />
        <Content>
          <Outlet />
        </Content>
      </Layout>
    </UserContext.Provider>
  );
};

export default ProtectedPage;
