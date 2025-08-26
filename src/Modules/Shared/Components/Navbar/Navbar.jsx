// Navbar.jsx
import  { useContext } from "react";
import { AuthContext } from "../../../../context/authContext";

export default function Navbar() {
  const { loginData } = useContext(AuthContext); 

  return (
    <div>
      <nav className="navbar navbar-expand-lg">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Food App
          </a>

          <button
            className="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarSupportedContent"
            aria-controls="navbarSupportedContent"
            aria-expanded="false"
            aria-label="Toggle navigation"
          >
            <span className="navbar-toggler-icon"></span>
          </button>

          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <span className="nav-link active">
                  {loginData?.userName || "Defualt User"} 
                </span>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
