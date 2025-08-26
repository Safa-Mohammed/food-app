import { useNavigate } from "react-router-dom";
import "./NotFound.css";

export default function NotFound() {
  const navigate = useNavigate();

  return (
    <>
      <div className="notfound-container">
        <div className="notfound-content">
       
          <img
            src="/logo1.png" 
            alt="Logo"
            className="notfound-logo"
          />

          <h1 className="notfound-title">Oops.</h1>
          <h2 className="notfound-subtitle">
            <span className="highlight">Page</span> not found
          </h2>
          <p className="notfound-text">
            This page doesn’t exist or was removed! <br />
            We suggest you go back to home.
          </p>
          <button className="notfound-btn" onClick={() => navigate("/")}>
            <i className="fa fa-arrow-left me-2"></i> Back To Home
          </button>
        </div>

      </div>
    </>
  );
}
