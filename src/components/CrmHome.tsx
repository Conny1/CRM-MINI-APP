import { BrowserRouter, Route, Routes } from "react-router";
import { Clients, Dashboard, Reminders, Settings } from "../pages";
import Navbar from "./Nav";
import { Provider, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { loadTokensFromDB, updateTokenData } from "../redux/token";
import { store, type AppDispatch, type RootState } from "../redux/store";
type Props = {
  baseurl: string;
  tokens: { access_token: string; refresh_token: string; _id: string } | null;
};

const CrmHome = ({ baseurl = "/", tokens = null }: Props) => {
  const Home = () => {
    const dispatch = useDispatch<AppDispatch>();
    const { loaded } = useSelector((state: RootState) => state.token);

    useEffect(() => {
      if (tokens && !loaded ) {
        dispatch(updateTokenData(tokens));
        dispatch(loadTokensFromDB());
      }
    }, [tokens, dispatch]);

    if (!tokens)
      return (
        <div>
        
          <p> Loading... </p>{" "}
        </div>
      );
    if (!loaded)
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
            <Route path="/clients" element={<Clients />} />
            <Route path="/reminders" element={<Reminders />} />

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
