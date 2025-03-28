import { useNavigate } from "react-router";

const Logout = () => {
  const navigate = useNavigate();
  localStorage.removeItem("token");
  navigate("/");
};

export default Logout;
