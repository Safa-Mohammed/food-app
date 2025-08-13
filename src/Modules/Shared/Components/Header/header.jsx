import { useLocation } from "react-router-dom";

export default function Header({ title, desc, imgPath }) {
  const { pathname } = useLocation();

  return (
    <div className="container-fluid">
      <div className="bg-success p-3 rounded-3">
        <div className="row align-items-center justify-content-between">

          {/* Text Column */}
          <div className="col-12 col-md-8 mb-3 mb-md-0 px-5">
            {title && (
              <h4 className="text-white fw-bold">
                <span className="fw-bold fs-2 fs-md-1 me-2">
                  {title.split(" ")[0]}
                </span>
                <span className="fw-normal fs-5 fs-md-3">
                  {title.split(" ").slice(1).join(" ")}
                </span>
              </h4>
            )}
            <p className="text-white">{desc}</p>
          </div>

          {/* Image Column */}
          {(pathname === "/dashboard" || imgPath) && (
            <div className="col-12 col-md-4 d-flex justify-content-end">
              <img
                src={pathname === "/dashboard" ? "/bg-header.png" : imgPath}
                alt="Header"
                className="img-fluid rounded"
                style={{
                  maxHeight: pathname === "/dashboard" ? "250px" : "150px", 
                  objectFit: "contain"
                }}
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
