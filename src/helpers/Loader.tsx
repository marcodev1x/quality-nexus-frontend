import styled from "styled-components";
import { InfinitySpin } from "react-loader-spinner";

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  height: 69vh;
`;

const Loader = () => (
  <LoaderContainer>
    <InfinitySpin width="160" color="#2ecc71" />
  </LoaderContainer>
);

export default Loader;
