import React from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/LoginPage";
import Register from "./pages/Register"; // Make sure file name matches

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect root to /login */}
        <Route path="/" element={<Navigate to="/login" />} />
        {/* Auth Pages */}
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
