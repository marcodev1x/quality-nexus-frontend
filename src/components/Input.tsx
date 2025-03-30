import styled from "styled-components";
import { InputProps } from "../Interfaces/InputProps";

const InputStyle = styled.div<InputProps>`
  display: flex;
  flex-direction: column;
  gap: 8px;

  label {
    font-weight: 600;
    color: #333;
  }

  a {
    text-decoration: none;
  }

  input {
    padding: 10px;
    border: 1px solid #2ecc71;
    margin-bottom: 16px;
    border-radius: 8px;
    font-size: 16px;
    transition:
      border-color 0.3s ease,
      box-shadow 0.3s ease;

    &:focus {
      outline: none;
      border-color: #2ecc71;
      box-shadow: 0px 0px 5px rgba(76, 175, 80, 0.5);
    }
  }
`;

const Input = ({
  label,
  name,
  type,
  value,
  labelColor,
  size,
  ...props
}: InputProps) => {
  return (
    <InputStyle>
      <label htmlFor={name} style={{ color: labelColor || "#fff" }}>
        {label}
      </label>
      <input id={name} type={type} name={name} value={value} {...props} />
    </InputStyle>
  );
};

export default Input;
