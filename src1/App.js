import React from "react";
import AddAd from "./components/addAd";
import AdsList from "./components/adsList";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Home from "./pages/Home";
import Login from "./pages/Login";


function App() {
  return (
    <div className="App">
      <Router>
        <Navbar />
        <div style={{ padding: "4rem" }}>
          <Routes>
            <Route path="/Home" element={<Home />} />
            <Route path="/Login" element={<Login />} />
            <Route path="/AddAd" element={<AddAd />} />
            <Route path="/AdsList" element={<AdsList />} />
          </Routes>
        </div>
      </Router>
    </div>
  );
}

export default App;
