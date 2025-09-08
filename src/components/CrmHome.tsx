import { BrowserRouter, Route, Routes } from "react-router";
import { Clients, Dashboard, Intergrations, Settings, Tasks } from "../pages";
import Navbar from "./Nav";
 type Props ={
  baseurl:string
 }

const CrmHome = ({baseurl = "/"}:Props) => {
  return (
    <div className="W-full" >
       <BrowserRouter basename={baseurl} >
    <Navbar/>
      <Routes>
        <Route path="/" element={<Dashboard />} />
        <Route path="/intergrations" element={<Intergrations />} />
        <Route path="/settings" element={<Settings />} />
        <Route path="/tasks" element={<Tasks />} />
        <Route path="/clients" element={<Clients />} />
      </Routes>
    </BrowserRouter>
    </div>
   
  );
};

export default CrmHome;
