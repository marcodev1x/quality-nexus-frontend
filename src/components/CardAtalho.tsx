import styled from "styled-components";
import { CardProps } from "../Interfaces/CardProps";
import { NavLink } from "react-router";

const CardContainer = styled.div`
  background: rgba(255, 255, 255, 0.15);
  border-radius: 12px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  padding: 40px;
  display: flex;
  align-items: center;
  flex-direction: column;
  gap: 10px;
  justify-content: center;
  font-size: 16px;
  font-weight: bold;
  color: #f8f9fa;
  width: 220px;
  height: 120px;
  transition:
    transform 0.3s ease-in-out,
    background 0.3s ease-in-out;

  &:hover {
    transform: scale(1.05);
    background: rgba(255, 255, 255, 0.25);
  }

  h3 {
    color: #222;
  }

  p {
    color: #555;
    font-weight: 400;
    text-align: center;
    margin-top: 8px;
  }
`;

const StyledNavLink = styled(NavLink)`
  text-decoration: none;
  color: black;
  font-weight: bold;
  padding: 8px 12px;
  border-radius: 8px;
  transition: background 0.3s ease-in-out;
`;

const CardAtalho = ({ title, to, icon, description, button }: CardProps) => {
  return (
    <CardContainer>
      <h3>
        {icon} {title}
      </h3>
      <p>{description}</p>
      <StyledNavLink to={to}>{button}</StyledNavLink>
    </CardContainer>
  );
};

export default CardAtalho;
