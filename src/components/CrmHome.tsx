import { BrowserRouter, Route, Routes } from "react-router";
import { Clients, Dashboard, Projects, Settings, Tasks } from "../pages";
import Navbar from "./Nav";
import { Provider, useDispatch } from "react-redux";
import { useEffect } from "react";
import { updateTokenData } from "../redux/token";
import { store } from "../redux/store";
type Props = {
  baseurl: string;
  tokens: { access_token: string; refresh_token: string; _id: string } | null;
};

const CrmHome = ({ baseurl = "/", tokens = null  }: Props) => {
  const Home = () => {
    const dispatch = useDispatch();

    useEffect(() => {
      if (tokens) {
        dispatch(updateTokenData(tokens));
      }
      dispatch(updateTokenData(tokens));
    }, [tokens]);

    if (!tokens)
      return (
        <div>
          {" "}
          <p> Loading... </p>{" "}
        </div>
      );
    return (
      <div className="W-full">
        <BrowserRouter basename={baseurl}>
          <Navbar />
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/tasks" element={<Tasks />} />
            <Route path="/clients" element={<Clients />} />
            <Route path="/projects" element={<Projects />} />
          </Routes>
        </BrowserRouter>
      </div>
    );
  };
  return (
    <Provider store={store}>
      <Home />
    </Provider>
  );
};

export default CrmHome;
