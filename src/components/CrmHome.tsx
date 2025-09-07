import { BrowserRouter, Route, Routes } from "react-router";
import { Clients, Dashboard, Intergrations, Settings, Tasks } from "../pages";

const CrmHome = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/intergrations" element={<Intergrations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/clients" element={<Clients />} />
      </Routes>
    </BrowserRouter>
  );
};

export default CrmHome;
