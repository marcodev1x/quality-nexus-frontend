import { BrowserRouter, Route, Routes } from "react-router";
import "./App.css";
import LoginPage from "./pages/LoginPage";
import GlobalStyle from "./styles/global";
import RegisterPage from "./pages/RegisterPage";
import DashboardPage from "./pages/DashboardPage";
import ConfigurationPage from "./pages/ConfigurationPage";
import Integration from "./pages/IntegrationPage";
import Performance from "./pages/PerformancePage";
import LoaderPage from "./pages/LoaderPage";
import ProtectedPage from "./pages/ProtectedPage";

function App() {
  return (
    <>
      <GlobalStyle />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          <Route element={<ProtectedPage />}>
            <Route path="/home" element={<DashboardPage />} />
            <Route path="/configuracoes" element={<ConfigurationPage />} />
            <Route path="/interno/integration" element={<Integration />} />
            <Route path="/interno/performance" element={<Performance />} />
            <Route path="/interno/load" element={<LoaderPage />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
