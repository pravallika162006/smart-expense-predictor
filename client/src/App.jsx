import { Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Analytics from "./pages/Analytics";
import Expenses from "./pages/Expenses";
import Predictions from "./pages/Predictions";
import Settings from "./pages/Settings";

function App() {
  return (
    <Routes>

      <Route path="/" element={<Login />} />

      <Route path="/register" element={<Register />} />

      <Route path="/dashboard" element={<Dashboard />} />
      
      <Route path="/analytics" element={<Analytics />} />
      
      <Route path="/expenses" element={<Expenses />} />
      
      <Route path="/predictions" element={<Predictions />} />
      
      <Route path="/settings" element={<Settings />} />

    </Routes>
  );
}

export default App;