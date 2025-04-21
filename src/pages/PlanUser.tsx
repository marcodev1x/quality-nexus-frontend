import useUser from "../hooks/useUser.ts";
import FirstTopContainer from "../components/FirstTopContainer.tsx";
import ComponentButton from "../components/Button.tsx";
import axios from "axios";
import EnvsVars from "../services/EnvsVars.ts";
import React from "react";

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

    const data = await axios.post(
      `${EnvsVars.API_URL}/payments/checkout-session`,
      {
        email: user?.email,
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
                <ComponentButton label={"Comprar"}></ComponentButton>
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
