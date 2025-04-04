import React from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ComponentButton from "../components/Button";
import Input from "../components/Input";
import axios, {AxiosResponse} from "axios";
import Toast from "../helpers/Toast";
import SubTextWithLink from "../helpers/SubTextWithLink";
import { useNavigate } from "react-router";
import Loader from "../helpers/Loader";
import {LoginResponse} from "../types/LoginResponse.ts";

const LoginContainer = styled.div`
  display: flex;
  justify-content: start;
  height: 100vh;

  @import url("https://fonts.googleapis.com/css?family=Poppins:200,300,400,500,600,700,800,900&display=swap");

  * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: "Poppins", sans-serif;
  }

  section {
    position: relative;
    width: 100%;
    height: 100vh;
    overflow: hidden;
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 100vh;
  }

  section .wave {
    position: absolute;
    left: 0;
    width: 100%;
    height: 100%;
    background: #2ecc71;
    box-shadow: inset 0 0 50px rgba(0, 0, 0, 0.5);
    transition: 0.5s;
  }

  section .wave span {
    content: "";
    position: absolute;
    width: 325vh;
    height: 325vh;
    top: 0;
    left: 50%;
    transform: translate(-50%, -75%);
    background: #ffff;
  }

  .content {
    position: relative;
    z-index: 1;
    font-size: 3em;
    letter-spacing: 2px;
    justify-content: center;
    align-items: center;
    display: flex;
    padding: 1.5rem;
    color: #222;
  }

  section .wave span:nth-child(1) {
    border-radius: 45%;
    background: #2fec71;
    animation: animate 5s linear infinite;
  }

  section .wave span:nth-child(2) {
    border-radius: 40%;
    background: ##2ecc71;
    animation: animate 10s linear infinite;
  }

  section .wave span:nth-child(3) {
    border-radius: 42.5%;
    background: rgba(100, 100, 100, 0.1);
    animation: animate 15s linear infinite;
  }

  @keyframes animate {
    0% {
      transform: translate(-50%, -75%) rotate(0deg);
    }
    100% {
      transform: translate(-50%, -75%) rotate(360deg);
    }
  }
`;

const LoginCard = styled.div`
  background: linear-gradient(135deg, #2ecc71, #2ecc71);
  backdrop-filter: blur(10px);
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 2rem;

  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 428px;
  width: 100%;
  color: #f8f9fa;
`;

const Title = styled.h1`
  font-size: 24px;
  font-weight: 600;
  margin-bottom: 20px;
  color: #f8f9fa;
`;

const LoginPage = () => {
  const [, setValue] = useLocalStorage("token", "");
  const [emailInput, setEmailInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);

  const navigate = useNavigate();

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      if (!emailInput || !passwordInput) {
        setError("Preencha todos os campos");
        setIsLoading(false);
        return;
      }

      const response: AxiosResponse<LoginResponse | null> = await axios.post("http://localhost:3000/user/login", {
        email: emailInput,
        password: passwordInput,
      });

      if (response.data) {
        setValue(response.data.user.token);
        navigate("/home");
        setError(null);
      } else {
        setError("Dados inválidos");
      }
    } catch (err) {
      console.error(err);
      setError("Erro ao conectar ao servidor");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <LoginContainer>
      {error && <Toast message={error} position="top-left" />}
      <LoginCard>
        <Title>Bem-vindo de volta ao</Title>
        <form onSubmit={sendForm}>
          <div style={{ marginLeft: "auto", padding: "2rem" }}>
            <img src="/Quality Nexus White.svg" alt="Quality Nexus" />
          </div>
          <Input
            label="Email"
            name="email"
            type="email"
            value={emailInput}
            onChange={(e) => setEmailInput(e.target.value)}
          />
          <Input
            label="Senha"
            name="password"
            type="password"
            value={passwordInput}
            onChange={(e) => setPasswordInput(e.target.value)}
          />
          <SubTextWithLink
            text="Não tem uma conta?"
            link="/register"
            linkname="Clique aqui"
            isNoRefresh={true}
          />
          <ComponentButton
            label="Login"
            size="small"
            variant="primary"
            type="submit"
            disabled={isLoading}
          />
          {isLoading && <Loader />}
        </form>
      </LoginCard>
      <div style={{ flex: 1 }} />
      <section>
        <div className="wave">
          <span></span>
          <span></span>
          <span></span>
        </div>
        <div className="content">
          <h2>Aqui é onde a qualidade se mantém!</h2>
        </div>
      </section>
    </LoginContainer>
  );
};

export default LoginPage;
