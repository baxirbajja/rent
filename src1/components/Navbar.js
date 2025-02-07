import React from "react";
import { Link } from "react-router-dom";
import "./Navbar.css";
const Navbar = () => {
  return (
    <nav>
      <ul>
        <li>
          <Link to="/Home">Home</Link>
          <Link to="/Login">Login/Sign Up</Link>
          <Link to="/AddAd">Add</Link>
        </li>
        <li>
          <Link to="/AdsList">Lists</Link>
        </li>
      </ul>
    </nav>
  );
};

export default Navbar;
