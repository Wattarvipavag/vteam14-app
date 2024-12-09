import { Routes, Route, Navigate } from "react-router-dom";
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import ProfilePage from "./pages/ProfilePage";

function App() {
  return (
    <div className="container">
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/" element={<HomePage />} />
        <Route path="/profile" element={<ProfilePage />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </div>
  );
}

export default App;
