import React from "react";
import { useNavigate, Outlet } from "react-router-dom";
import SideBar from "../SideBar/SideBar";
import Navbar from "../Navbar/Navbar";
import Header from "../Header/header";

export default function MasterLayout({loginData}) {
  const navigate = useNavigate();

  const logout = () => {
    // Remove token
    localStorage.removeItem("userToken");
    // Redirect to login using React Router navigation
    navigate("/login");
  };

  return (
    <>
      <div className="d-flex">
        <div className="">
          <SideBar logout={logout} />
        </div>
        <div className=" itemss m-auto "> 
          <Navbar loginData={loginData}/>
          <Outlet />
        </div>
      </div>
    </>
  );
}
