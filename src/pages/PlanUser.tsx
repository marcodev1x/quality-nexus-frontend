import useUser from "../hooks/useUser.ts";
import FirstTopContainer from "../components/FirstTopContainer.tsx";
import ComponentButton from "../components/Button.tsx";
import axios from "axios";
import EnvsVars from "../services/EnvsVars.ts";
import React from "react";
import GetToken from "../services/GetToken.tsx";
import styled from "styled-components";
import { FiCheckCircle } from "react-icons/fi";

const CardToBuy = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  background-color: #fff;
  border: 1px solid #ccc;
  border-radius: 8px;
  padding: 12px;
  margin-top: 12px;
`

const StyledList = styled.ul`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PlanUser = () => {
  const [buy, setBuy] = React.useState<string>("");

  const user = useUser();
  const returnNamedPlan = () => {
    if (user?.role === "free")
      return user?.role[0].toUpperCase() + user?.role.slice(1).toLowerCase();

    if (user?.role === "plan") return "Pago";
    else return "Unknown User";
  };

  const retriveBuyURL = async () => {
    if (user?.role === "plan") return;

    const retrieveUserData = await axios.get(`${EnvsVars.API_URL}/user/public`, {
      headers: {
        Authorization: `Bearer ${GetToken()}`,
      },
    });
    const data = await axios.post(
      `${EnvsVars.API_URL}/payments/checkout-session`,
      {
        email: user?.email ? user.email : retrieveUserData.data.email,
      },
    );
    setBuy(data.data.url);
  };

  React.useEffect(() => {
    retriveBuyURL();
  }, []);

  return (
    <FirstTopContainer>
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          flexDirection: "column",
          gap: "12px",
        }}
      >
        <div>
          <h1>Plano atual: {returnNamedPlan()}</h1>
        </div>
        <div>
          {returnNamedPlan() === "Free" && (
            <div>
              <h3 style={{ fontWeight: "normal", color: "#232" }}>
                Você está no plano gratuito, considere fazer um upgrade para o
                plano premium
              </h3>
              <a href={buy} target={"_blank"}>
                <ComponentButton label={"Comprar"} disabled={!buy}></ComponentButton>
              </a>
            </div>
          )}
          {returnNamedPlan() === "Pago" && (
            <div>
              <h3 style={{ fontWeight: "normal", color: "#232" }}>
                Você está no plano premium, aproveite seus benefícios e comece a
                testar. Obrigado por utilizar o Quality Nexus!
              </h3>
            </div>
          )}
        </div>
      </div>
    </FirstTopContainer>
  );
};
export default PlanUser;
