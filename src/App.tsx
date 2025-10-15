import "./App.css";
import { CRMHome } from "./components";

function App() {
  return (
    <CRMHome
      baseurl="/"
      tokens={{
        refresh_token:
            "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NjA1MjkwNTQsImV4cCI6MTc2MTEzMzg1NH0.cAuGjVt0vmzCOhPtXtZtP5iLKKgTOerahq_lUnHXqLo"
,
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NjA1MjY4MDUsImV4cCI6MTc2MDUyNjg2NX0.tWGeuk323ZbzHg-yQO3px1ZbmpbbjNnq6oie3kR4VSk",
        _id: "68c00b5fbac967739638d42e",
      }}
    />
  );
}

export default App;
