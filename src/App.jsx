import React from "react";
import AddAd from "./components/AddAd.jsx";
import AdsList from "./components/AdsList.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import Sign from "./pages/Sign.jsx";
import Dashboard from "./components/admin/Dashboard.jsx";
import PrivateRoute from "./components/PrivateRoute";
import './App.css';

function App() {
  return (
    <Router>
      <div className="App">
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/signup" element={<Sign />} />
          <Route
            path="/add-ad"
            element={
              <PrivateRoute>
                <AddAd />
              </PrivateRoute>
            }
          />
          <Route path="/ads" element={<AdsList />} />
          <Route
            path="/admin"
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
