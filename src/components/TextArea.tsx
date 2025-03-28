import React from "react";
import styled from "styled-components";

const StyledContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`;

const StyledTextArea = styled.textarea`
  padding: 12px;
  border: 1px solid #2ecc71;
  border-radius: 4px;
  font-size: 16px;
  color: #222;
  background-color: #fff;
  resize: vertical;
  font-family: "New Roman", sans-serif;
  &:focus {
    outline: none;
    border-color: #2ecc71;
    box-shadow: 0px 0px 5px rgba(76, 175, 80, 0.5);
  }
`;

const StyledLabel = styled.label`
  label {
    font-weight: 600;
    color: #111;
  }
`;

interface TextAreaProps {
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  placeholder?: string;
}

const TextArea: React.FC<
  TextAreaProps &
    React.ComponentProps<"textarea"> & { labelColor?: string; label: string }
> = ({ value, onChange, placeholder, name, labelColor, label }) => {
  return (
    <StyledContainer>
      <StyledLabel
        htmlFor={name}
        style={{
          color: labelColor || "#fff",
          fontWeight: 600,
        }}
      >
        {label}
      </StyledLabel>
      <StyledTextArea
        value={value}
        onChange={onChange}
        placeholder={placeholder}
      />
    </StyledContainer>
  );
};

export default TextArea;
