// MasterLayout.jsx
import React, { useState } from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import Navbar from "../Navbar/Navbar";

export default function MasterLayout({ loginData }) {
  const navigate = useNavigate();
  const [isCollapse, setIsCollapse] = React.useState(() => {
    const saved = localStorage.getItem("sidebarCollapsed");
    return saved ? JSON.parse(saved) : false;
  });

  const logout = () => {
    localStorage.removeItem("userToken");
    navigate("/login");
  };

  const handleToggle = () => {
    setIsCollapse(prev => {
      const newState = !prev;
      localStorage.setItem("sidebarCollapsed", JSON.stringify(newState));
      return newState;
    });
  };

  return (
    <div className={`layout ${isCollapse ? "collapsed" : ""}`}>
      <div className="sidebar-container">
        <SideBar logout={logout} isCollapse={isCollapse} onToggle={handleToggle} />
      </div>

      <div className="main-content p-2">
        <Navbar loginData={loginData} />
        <Outlet />
      </div>
    </div>
  );
}
