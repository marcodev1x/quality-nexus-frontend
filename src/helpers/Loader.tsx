import { InfinitySpin } from "react-loader-spinner";
import styled from "styled-components";

const LoaderContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
`;

const Loader = () => (
  <LoaderContainer>
    <InfinitySpin
      height="100"
      width="100"
      color="#c7f5df"
      ariaLabel="loading"
    />
  </LoaderContainer>
);

export default Loader;
