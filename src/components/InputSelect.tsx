import React from "react";
import styled from "styled-components";
import { InputSelectProps } from "../Interfaces/InputSelectProps";

const Select = styled.select`
  width: 240px;
  padding: 10px;
  border: 1px solid #2ecc71;
  border-radius: 4px;
  font-size: 16px;
  background: #fff;
  color: #333;
  cursor: pointer;
  transition: border-color 0.3s;

  &:focus {
    border-color: #2ecc71;
    outline: none;
  }
`;

const Label = styled.label`
  font-weight: 600;
  display: flex;
  color: #333;
`;

const Container = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const InputSelect = ({ label, options, changeState }: InputSelectProps) => {
  const [selectedOption, setSelectedOption] = React.useState("");
  const arrayOptions = [...options];

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedOption(e.target.value);
    changeState(e.target.value);
  };

  return (
    <>
      <Container>
        <Label>{label}</Label>
        <Select onChange={handleChange} value={selectedOption}>
          {arrayOptions.map((option) => (
            <option key={option} value={option}>
              {option}
            </option>
          ))}
        </Select>
      </Container>
    </>
  );
};

export default InputSelect;
