import React, { useContext } from "react";
import FillRecipes from "../../../Shared/Components/FillRecipse/FillRecipes";
import Header from "../../../Shared/Components/Header/header";
import imgDashoard from "/Group 48102127.png";
import { AuthContext } from "../../../../context/authContext";  

export default function Dashboard() {
  // Access loginData from context
  const { loginData } = useContext(AuthContext);

  return (
    <>
      <Header
        imgPath={imgDashoard}
        title={`Welcome ${loginData?.userName || "User"} !`} // fallback
        desc={
          <>
            <span>This is a welcoming screen for the entry of the application,</span>
            <br />
            <span>You can now see the options</span>
          </>
        }
      />

      <div>
        <FillRecipes />
      </div>

      {/* Dashboard content */}
    </>
  );
}
