import styled from "styled-components";

import {
  FiHome,
  FiLoader,
  FiLogOut,
  FiPercent,
  FiSettings,
} from "react-icons/fi";
import { NavLink, useNavigate } from "react-router";
import useUser from "../hooks/useUser";
const StyledMenu = styled.nav`
  display: flex;
  flex-direction: column;
  position: relative;
  left: 0;
  top: 0;
  width: 250px;
  height: 100vh;
  background: #fff;
  padding: 2rem;

  h1 {
    color: #333;
    text-align: center;
    margin-left: -20px;
    margin-top: 8px;
    font-weight: 600;
    margin-bottom: 0.5rem;
  }

  ul {
    list-style: none;
    padding: 0;
    display: flex;
    flex-direction: column;
    gap: 1rem;
  }

  li {
    display: flex;
    align-items: center;
    gap: 1rem;
    padding: 1rem;
    color: #333;
    font-size: 1.1rem;
    font-weight: 500;
    border-radius: 8px;
    cursor: pointer;
    transition: all 0.3s ease-in-out;

    &:hover {
      background: #d1f5df;
      color: #2ecc71;
    }

    &.active {
      background: #2ecc71;
      color: #fff;
      font-weight: bold;
    }

    svg {
      font-size: 1.3rem;
    }
  }

  .logout {
    margin-top: auto;
    color: #e74c3c;

    &:hover {
      background: #fde2e2;
      color: #c0392b;
    }
  }
  .plan {
    padding: 0.32rem 1.5rem;
    border-radius: 16px;
    text-align: center;
    background: #d1f5df;
    color: #2ecc71;

    width: fit-content;

    margin: 12px auto 24px 60px;
  }
`;

const LateralMenu = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  const user = useUser();

  const filterPlan = () => {
    if (user?.role === "free") {
      return "Plano gratuito";
    } else if (user?.role === "plan") {
      return "Plano pago";
    } else {
      return "Guest";
    }
  };

  return (
    <StyledMenu>
      <div>
        <img src="/Quality Nexus.svg" alt="Quality Nexus" />
      </div>
      <h1>Bem-vindo, {user?.nome}</h1>
      <p className="plan">{filterPlan()}</p>

      <ul>
        <NavLink
          to="/home"
          style={{ textDecoration: "none" }}
          className={location.pathname === "/home" ? "active" : ""}
        >
          <li className={location.pathname === "/home" ? "active" : ""}>
            <FiHome />
            Dashboard
          </li>
        </NavLink>
        <NavLink
          to="/interno/integration"
          style={{ textDecoration: "none" }}
          className={
            location.pathname === "/interno/integration" ? "active" : ""
          }
        >
          <li
            className={
              location.pathname === "/interno/integration" ? "active" : ""
            }
          >
            <FiPercent />
            Integração
          </li>
        </NavLink>
        <NavLink
          to="/interno/load"
          style={{ textDecoration: "none" }}
          className={location.pathname === "/interno/load" ? "active" : ""}
        >
          <li className={location.pathname === "/interno/load" ? "active" : ""}>
            <FiLoader />
            Carga
          </li>
        </NavLink>
        <NavLink
          to="/configuracoes/user"
          style={{ textDecoration: "none" }}
          className={location.pathname === "/configuracoes" ? "active" : ""}
        >
          <li
            className={location.pathname === "/configuracoes" ? "active" : ""}
          >
            <FiSettings />
            Configurações
          </li>
        </NavLink>
        <li className="logout" onClick={handleLogout}>
          <FiLogOut />
          Sair
        </li>
      </ul>
    </StyledMenu>
  );
};

export default LateralMenu;
