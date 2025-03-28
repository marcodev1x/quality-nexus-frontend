import React from "react";
import styled from "styled-components";

const StyledContainerTopper = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 24px;
  padding: 24px;
`;

const FirstTopContainer = ({ children }: { children: React.ReactNode }) => {
  return <StyledContainerTopper>{children}</StyledContainerTopper>;
};

export default FirstTopContainer;
