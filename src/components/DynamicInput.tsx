import styled from "styled-components";

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

const DynamicHeaders = ({
  headers,
  setHeaders,
}: {
  headers: { key: string; value: string }[];
  setHeaders: (headers: { key: string; value: string }[]) => void;
}) => {
  const addHeader = () => {
    setHeaders([...headers, { key: "", value: "" }]);
  };

  const updateHeader = (
    index: number,
    field: "key" | "value",
    value: string,
  ) => {
    const newHeaders = [...headers];
    newHeaders[index][field] = value;
    setHeaders(newHeaders);
  };

  const removeHeader = (index: number) => {
    const newHeaders = [...headers];
    newHeaders.splice(index, 1);
    setHeaders(newHeaders);
  };

  return (
    <HeadersContainer>
      {headers.map((header, index) => (
        <HeaderRow key={index}>
          <InputField
            type="text"
            placeholder="Chave"
            value={header.key}
            onChange={(e) => updateHeader(index, "key", e.target.value)}
          />
          <InputField
            type="text"
            placeholder="Valor"
            value={header.value}
            onChange={(e) => updateHeader(index, "value", e.target.value)}
          />
          <RemoveButton type="button" onClick={() => removeHeader(index)}>
            Remover
          </RemoveButton>
        </HeaderRow>
      ))}
      <AddButton type="button" onClick={addHeader}>
        Adicionar Header
      </AddButton>
    </HeadersContainer>
  );
};

export default DynamicHeaders;
