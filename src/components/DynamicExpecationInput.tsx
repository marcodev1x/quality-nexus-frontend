import styled from "styled-components";
import InputSelect from "./InputSelect";

const HeadersContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const HeaderRow = styled.div`
  display: flex;
  gap: 12px;
`;

const InputField = styled.input`
  flex: 1;
  padding: 8px;
  border: 1px solid #2ecc71;
  border-radius: 6px;
  font-size: 14px;
  outline: none;
  transition: border-color 0.2s;

  &:focus {
    border-color: #2ecc71;
  }
`;

const AddButton = styled.button`
  background-color: #2ecc71;
  color: #f8f9fa;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #222;
  }
`;

const RemoveButton = styled.button`
  background-color: #c0392b;
  color: #f8f9fa;
  border: none;
  padding: 8px 12px;
  font-size: 14px;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: #e74c3c;
  }
`;

export const operatorOptions = [
  "equal",
  "notEqual",
  "deepEqual",
  "notDeepEqual",
  "strictEqual",
  "notStrictEqual",
  "isAbove",
  "isAtLeast",
  "isBelow",
  "isAtMost",
  "isTrue",
  "isFalse",
  "isNull",
  "isNotNull",
  "exists",
  "notExists",
];

const DynamicExpecationInput = ({
  expectation,
  setExpectations,
}: {
  expectation: { key: string; expected: string; value: string }[];
  setExpectations: (
    expectations: { key: string; expected: string; value: string }[],
  ) => void;
}) => {
  const addHeader = () => {
    setExpectations([
      ...expectation,
      { key: "", expected: "equal", value: "" },
    ]);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value" | "expected",
    value: string,
  ) => {
    const newExpectation = [...expectation];
    newExpectation[index][field] = value;
    setExpectations(newExpectation);
  };

  const removeExpectation = (index: number) => {
    const newExpectation = [...expectation];
    newExpectation.splice(index, 1);
    setExpectations(newExpectation);
  };

  return (
    <HeadersContainer>
      {expectation.map((e, index) => (
        <HeaderRow key={index}>
          <InputField
            type="text"
            placeholder="Chave"
            value={e.key}
            onChange={(e) => updateHeader(index, "key", e.target.value)}
          />
          <InputSelect
            label=""
            options={operatorOptions.map((option) => option)}
            changeState={(e) => updateHeader(index, "expected", e)}
          />
          <InputField
            type="text"
            placeholder="Valor"
            value={e.value}
            onChange={(e) => updateHeader(index, "value", e.target.value)}
          />
          <RemoveButton type="button" onClick={() => removeExpectation(index)}>
            Remover
          </RemoveButton>
        </HeaderRow>
      ))}
      <AddButton type="button" onClick={addHeader}>
        Adicionar Assert
      </AddButton>
    </HeadersContainer>
  );
};

export default DynamicExpecationInput;
