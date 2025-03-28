import { useContext } from "react";
import UserContext from "../contexts/userContext";

const useUser = () => useContext(UserContext);

export default useUser;
