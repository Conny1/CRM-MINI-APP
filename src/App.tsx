import "./App.css";
import { CRMHome } from "./components";

function App() {
  return (
    <CRMHome
      baseurl="/"
      tokens={{
        refresh_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NjY1NzY3MzksImV4cCI6MTc2NzE4MTUzOX0.myGQcrUUCSgpOZzxIPY6bj79DT87qCCht5dZBV9Zkqo",
        access_token:
          "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI2OGMwMGI1ZmJhYzk2NzczOTYzOGQ0MmUiLCJpYXQiOjE3NjY1NzY3MzksImV4cCI6MTc2NzE4MTUzOX0.kGA_tzp2CoLv75OkLA5FR0QW_wNW6F5z34KYb4rdLLA",
        _id: "68c00b5fbac967739638d42e",
      }}
    />
  );
}

export default App;
