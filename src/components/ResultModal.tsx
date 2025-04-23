import { TestsList } from "../Interfaces/TestsList.tsx";

const ResultModal = (test: TestsList) => {
  return <div>{JSON.stringify(test)}</div>;
};
export default ResultModal;
