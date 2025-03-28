import { createContext } from "react";
import { UserResponse } from "../types/UserResponse";

const UserContext = createContext<UserResponse | null>(null);

export default UserContext;
