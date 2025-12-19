import "./App.css";
import { CRMHome } from "./components";

function App() {
  return (
    <CRMHome
      baseurl="/"
      tokens={{
        refresh_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NjYxNDYyMDIsImV4cCI6MTc2Njc1MTAwMn0.UI0LDNeMm7-IWqIP12Qf0OXMVjSLj7UtXWUkE-o2Wag",
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NjYxNDYyMDIsImV4cCI6MTc2NjE0NjI2Mn0.uNGrIIzslV5EVQq_-S1zAR_rvwfH_G6dcD79MTBo9K8",
        _id: "68c00b5fbac967739638d42e",
      }}
    />
  );
}

export default App;
