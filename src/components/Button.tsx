import styled from "styled-components";
import ButtonProps from "../Interfaces/ButtonProps";

const Button = styled.button<ButtonProps>`
  background-color: ${(props) =>
    props.variant === "primary" ? "#222" : "#ffffff"};
  border-radius: 8px;
  color: ${(props) => (props.variant === "primary" ? "#fff" : "#2ecc71")};
  margin-top: 0.65rem;
  padding: 10px 20px;
  cursor: pointer;
  font-weight: 600;
  transition:
    background-color 0.3s ease,
    color 0.3s ease;
  font-size: ${(props) =>
    props.size === "small"
      ? "14px"
      : props.size === "medium"
        ? "16px"
        : "18px"};
  border: 0;

  &:hover {
    background-color: ${(props) =>
      props.variant === "primary" ? "#333" : "#4ecc71"};
    color: ${(props) => (props.variant === "primary" ? "#ffffff" : "#2ecc71")};
  }
`;

const ComponentButton = ({ label, size, variant, ...props }: ButtonProps) => {
  return (
    <Button {...props} size={size} variant={variant}>
      {label}
    </Button>
  );
};

export default ComponentButton;
