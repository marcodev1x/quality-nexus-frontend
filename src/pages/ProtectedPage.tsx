import { useEffect, useState } from "react";
import { Navigate, Outlet } from "react-router";
import GetToken from "../services/GetToken";
import styled from "styled-components";
import LateralMenu from "../components/LateralMenu";
import axios from "axios";
import { UserResponse } from "../types/UserResponse";
import UserContext from "../contexts/userContext";

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

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get("http://localhost:3000/user/public", {
          headers: {
            Authorization: `Bearer ${localStorage.getItem("token") || ""}`,
          },
        });
        setUser(response.data);
      } catch (err) {
        console.warn("Erro ao buscar usuário", err);
      }
    };

    if (verifyAuth) {
      fetchUser();
    }
  }, [verifyAuth]);

  if (!verifyAuth) return <Navigate to="/" />;

  return (
    <UserContext.Provider value={user}>
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
