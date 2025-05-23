import React from "react";
import styled from "styled-components";

const Container = styled.div`
  display: flex;
  flex-wrap: wrap;
  justify-content: start;
  align-items: start;
  max-width: 100%;
  padding: 44px;
  margin: 0 auto;
  @media (max-width: 1024px) {
    gap: 16px;
    padding: 16px;
  }

  @media (max-width: 768px) {
    flex-direction: column;
    gap: 12px;
  }
`;

const ContainerMid = ({ children }: { children: React.ReactNode }) => (
  <Container>{children}</Container>
);

export default ContainerMid;
