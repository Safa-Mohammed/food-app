import React from "react";

export default function Navbar({ loginData }) {
  return (
    <div>
      <nav className="navbar navbar-expand-lg ">
        <div className="container-fluid">
          <a className="navbar-brand" href="#">
            Food App
          </a>

          {/* Hamburger toggle button */}
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

          {/* Collapsible content */}
          <div className="collapse navbar-collapse" id="navbarSupportedContent">
            <ul className="navbar-nav ms-auto mb-2 mb-lg-0">
              <li className="nav-item">
                <a className="nav-link active" href="#">
                  {loginData ? loginData.userName : "defaultUser"}
                </a>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </div>
  );
}
