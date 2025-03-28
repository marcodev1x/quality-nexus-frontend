import React from "react";
import styled from "styled-components";
import Input from "../components/Input";
import ComponentButton from "../components/Button";
import { useLocalStorage } from "../hooks/useLocalStorage";
import axios, { AxiosError } from "axios";
import { useNavigate } from "react-router";
import Toast from "../helpers/Toast";
import Loader from "../helpers/Loader";

const RegisterContainer = styled.div`
  display: flex;
  justify-content: start;
  height: 100vh;
  background: url("../../public/bg.webp") no-repeat center center fixed;
  background-size: cover;
`;

const RegisterCard = styled.div`
  background: linear-gradient(135deg, #2ecc71, #222);
  backdrop-filter: blur(10px);
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

const RegisterPage = () => {
  const [emailInput, setEmailInput] = React.useState("");
  const [nameInput, setNameInput] = React.useState("");
  const [passwordInput, setPasswordInput] = React.useState("");
  const [confirmPasswordInput, setConfirmPasswordInput] = React.useState("");
  const [, setValue] = useLocalStorage("token", "");
  const [isLoading, setIsLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const navigate = useNavigate();

  const sendForm = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    try {
      await axios.get(`http://localhost:3000/user/${emailInput}`);
      setError("Este e-mail já está cadastrado");
      setIsLoading(false);
      return;
    } catch (err) {
      console.error(err);
      setError("Email já cadastrado");
    } finally {
      setIsLoading(false);
    }

    try {
      if (
        !nameInput ||
        !emailInput ||
        !passwordInput ||
        !confirmPasswordInput
      ) {
        setError("Preencha todos os campos corretamente");
        return;
      }

      if (passwordInput !== confirmPasswordInput) {
        setError("As senhas não coincidem");
        return;
      }

      const response = await axios.post("http://localhost:3000/user/register", {
        nome: nameInput,
        email: emailInput,
        password: passwordInput,
      });

      if (response.data.user) {
        setValue(response.data.user.token);
        navigate("/home");
      }
    } catch (err) {
      console.error(err as AxiosError);
      setError("Erro");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <RegisterContainer>
      <RegisterCard>
        {error && <Toast message={error} />}
        <Title>Crie sua conta</Title>
        <form onSubmit={sendForm}>
          <Input
            label="Nome"
            name="name"
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
          />
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
          <Input
            label="Confirmar senha"
            name="passwordConfirm"
            type="password"
            value={confirmPasswordInput}
            onChange={(e) => setConfirmPasswordInput(e.target.value)}
          />
          <ComponentButton
            label="Registrar-se"
            size="small"
            variant="primary"
            type="submit"
          />
          {isLoading && <Loader />}
        </form>
      </RegisterCard>
    </RegisterContainer>
  );
};

export default RegisterPage;
