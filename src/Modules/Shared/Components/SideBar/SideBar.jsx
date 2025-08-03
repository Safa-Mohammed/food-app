import React from "react";

export default function SideBar({ logout }) {
  return (
    <div className="w-100 bg-danger">
      {/* Call the logout function on button click */}
      <button className="btn btn-info" onClick={logout}>
        Logout
      </button>
    </div>
  );
}
