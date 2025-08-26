import { useContext } from "react";
import { AuthContext } from "../../../../context/authContext";
import "./FillRecipes.css";

export default function FillRecipes() {
  const { loginData } = useContext(AuthContext);
  
  const isNotSuperAdmin = loginData?.userGroup !== "SuperAdmin";
  
  const descriptionText = isNotSuperAdmin 
    ? "You can now show the meals easily using the table, click here and show it with the table!"
    : "You can now fill the meals easily using the table and form, click here and fill it with the table!";
  
  const buttonText = isNotSuperAdmin ? "Show Recipes" : "Fill Recipes";

  return (
    <div className="recipes-banner d-flex justify-content-between align-items-center flex-wrap">
      <div>
        <h2 className="text-black">
          Fill the <span className="tilte-banner">Recipes</span> !
        </h2>
        <p>{descriptionText}</p>
      </div>

      <button className="btn btn-custom d-flex align-items-center">
        {buttonText}
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="18"
          height="18"
          fill="none"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          viewBox="0 0 24 24"
          className="ms-2"
        >
          <line x1="5" y1="12" x2="19" y2="12" />
          <polyline points="12 5 19 12 12 19" />
        </svg>
      </button>
    </div>
  );
}