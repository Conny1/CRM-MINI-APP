import "./App.css";
import { CRMHome } from "./components";

function App() {
  return (
    <CRMHome
      baseurl="/"
      tokens={{
        refresh_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NjcxODI0MTIsImV4cCI6MTc2Nzc4NzIxMn0.c9jX6r4NBp0MexIGk7nKiOSeBBc3nTDygaZzifSRIjE",
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NjcxODI0MTIsImV4cCI6MTc2Nzc4NzIxMn0.maAPT11Wd5cJnpEi5TJpgUiv7zOS7-qBOBr9VqdsIjk",
        _id: "68c00b5fbac967739638d42e",
      }}
    />
  );
}

export default App;
