import React from "react";
import styled from "styled-components";
import { useLocalStorage } from "../hooks/useLocalStorage";
import ComponentButton from "../components/Button";
import Input from "../components/Input";
import axios from "axios";
import Toast from "../helpers/Toast";
import SubTextWithLink from "../helpers/SubTextWithLink";
import { useNavigate } from "react-router";
import Loader from "../helpers/Loader";

const LoginContainer = styled.div`
  display: flex;
  justify-content: start;
  height: 100vh;
  background: url("../../public/bg.webp") no-repeat center center fixed;
  background-size: cover;
`;

const LoginCard = styled.div`
  background: linear-gradient(135deg, #2ecc71, #222);
  backdrop-filter: blur(40px);
  align-items: center;
  justify-content: center;
  display: flex;
  flex-direction: column;
  padding: 2rem;
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  max-width: 400px;
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
    setIsLoading(true);

    if (!emailInput || !passwordInput) {
      setError("Preencha todos os campos");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.post("http://localhost:3000/user/login", {
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
    }
    setIsLoading(false);
  };

  return (
    <LoginContainer>
      <LoginCard>
        <Title>Bem-vindo de volta!</Title>
        {error && <Toast message={error} />}
        <form onSubmit={sendForm}>
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
    </LoginContainer>
  );
};

export default LoginPage;
