// had lapp hiya principal app dyalna
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

// hna fin kandirou routing w layout principal
function App() {
  return (
    // Router bach n9dro nnt9lo bin les pages
    <Router>
      <div className="App">
        {/* navbar li gha tb9a f fog */}
        <Navbar />
        {/* routes dial kol page */}
        <Routes>
          {/* homepage */}
          <Route path="/" element={<Home />} />
          {/* page dial login */}
          <Route path="/login" element={<Login />} />
          {/* page dial inscription */}
          <Route path="/signup" element={<Sign />} />
          {/* page dial izafat i3lan jdid, khasha login */}
          <Route
            path="/add-ad"
            element={
              <PrivateRoute>
                <AddAd />
              </PrivateRoute>
            }
          />
          {/* page dial lista dial les annonces */}
          <Route path="/ads" element={<AdsList />} />
          {/* page dial ladmin */}
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
