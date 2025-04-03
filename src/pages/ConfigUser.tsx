import React from "react";

import useUser from "../hooks/useUser";
import Input from "../components/Input";
import styled from "styled-components";
import ComponentButton from "../components/Button";
import { FiCheck, FiUser, FiX } from "react-icons/fi";
import axios from "axios";
import ToastSuccess from "../helpers/ToastSuccess";
import EnvsVars from "../services/EnvsVars";
import GetToken from "../services/GetToken";
import Toast from "../helpers/Toast";
import Loader from "../helpers/Loader";

const PageTitle = styled.h1`
  font-size: 2.5rem;
  margin-bottom: 2.5rem;
  font-family: "Sedgwick Ave Display", "cursive";
  color: #2ecc71;
  letter-spacing: 0.1rem;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const ConfigUser = () => {
  const user = useUser();

  const [nome, setNome] = React.useState<string | undefined>(user?.nome);
  const [email, setEmail] = React.useState<string | undefined>(user?.email);
  const [error, setError] = React.useState<string | null>(null);
  const [isEditing, setIsEditing] = React.useState<boolean>(false);
  const [senha, setSenha] = React.useState<string>("");
  const [confirmSenha, setConfirmSenha] = React.useState<string>("");
  const [isLoading, setIsLoading] = React.useState<boolean>(false);
  const [toast, setToast] = React.useState<boolean>(false);

  React.useEffect(() => {
    if (user) {
      setNome(user.nome || "");
      setEmail(user.email || "");
    }
  }, [user]);

  const sendFormUpdateUser = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);
    setToast(false);

    if (senha !== confirmSenha) {
      setError("As senhas não coincidem");
      setIsLoading(false);
      return;
    }

    try {
      const response = await axios.put(
        `${EnvsVars.API_URL}/user/update`,
        {
          email: user?.email,
          senha: senha || undefined,
          nome: nome,
          newEmail: email || user?.email,
        },
        { headers: { Authorization: `Bearer ${GetToken()}` } },
      );

      console.log(response);
      setIsEditing(false);
      setToast(true);

      return response.data;
    } catch (err) {
      console.error(err);
      setError("Erro ao atualizar usuário");
    } finally {
      setIsLoading(false);
      setIsEditing(false);
    }
  };

  return (
    <>
      {isLoading && <Loader />}
      {toast && <ToastSuccess message="Usuário atualizado com sucesso!" />}
      {error && <Toast message={error} position="top-right" />}
      <PageTitle>Configurações do Usuário</PageTitle>
      {user && (
        <div>
          <Form onSubmit={sendFormUpdateUser}>
            <Input
              labelColor="#222"
              label="Nome"
              name="Nome"
              type="text"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
            />
            <Input
              style={{ width: "420px" }}
              labelColor="#222"
              label="Email"
              name="Email"
              type="text"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
            {isEditing && (
              <>
                <Input
                  labelColor="#222"
                  label="Senha"
                  name="Senha"
                  type="password"
                  value={senha}
                  onChange={(e) => setSenha(e.target.value)}
                />
                <Input
                  labelColor="#222"
                  label="Confirmar senha"
                  name="confirmarSenha"
                  type="password"
                  value={confirmSenha}
                  onChange={(e) => setConfirmSenha(e.target.value)}
                />
                <div style={{ display: "flex", gap: "12px" }}>
                  <ComponentButton
                    label="Cancelar"
                    size="large"
                    style={{ background: "#f00" }}
                    type="button"
                    icon={<FiX />}
                    onClick={() => setIsEditing(false)}
                  />
                  <ComponentButton
                    label="Salvar"
                    size="large"
                    type="submit"
                    icon={<FiCheck />}
                  />
                </div>
              </>
            )}
            {!isEditing && (
              <ComponentButton
                label="Editar perfil"
                size="large"
                type="button"
                icon={<FiUser />}
                onClick={() => setIsEditing(true)}
              />
            )}
          </Form>
        </div>
      )}
    </>
  );
};

export default ConfigUser;
