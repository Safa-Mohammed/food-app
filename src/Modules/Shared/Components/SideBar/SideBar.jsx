// SideBar.jsx
import { Sidebar, Menu, MenuItem } from "react-pro-sidebar";
import { Link, useLocation } from "react-router-dom";
import { AuthContext } from "../../../../context/authContext";
import { useContext } from "react";

export default function SideBar({ logout, isCollapse, onToggle }) {
  const location = useLocation();
  const { loginData } = useContext(AuthContext);

  console.log(loginData);

  return (
    <div className="sidebar-container">
      <Sidebar collapsed={isCollapse} className="sidebaar py-4">
        <Menu>
          {/* Logo = collapse toggle */}
          <div className="logo-container" onClick={onToggle}>
            <img src="/3.png" alt="logo" className="logo w-100" />
          </div>
      <MenuItem
                icon={<i className="fa fa-home"></i>}
                component={<Link to="/dashboard" />}
                active={location.pathname === "/dashboard"}
              >
                Home
              </MenuItem>
          {/* SuperAdmin menu items */}
          {loginData?.userGroup === "SuperAdmin" && (
            <>
        

              <MenuItem
                icon={<i className="fa fa-users"></i>}
                component={<Link to="/dashboard/user-list" />}
                active={location.pathname === "/dashboard/user-list"}
              >
                Users
              </MenuItem>

              <MenuItem
                icon={<i className="fa fa-list"></i>}
                component={<Link to="/dashboard/categories-list" />}
                active={location.pathname === "/dashboard/categories-list"}
              >
                Categories
              </MenuItem>
            </>
          )}

          {/* Recipes (always visible) */}
          <MenuItem
            icon={<i className="fa fa-cutlery"></i>}
            component={<Link to="/dashboard/recipes-list" />}
            active={location.pathname === "/dashboard/recipes-list"}
          >
            Recipes
          </MenuItem>

          {/* Favourites (not SuperAdmin) */}
          {loginData?.userGroup !== "SuperAdmin" && (
            <MenuItem
              icon={<i className="fa fa-heart"></i>}
              component={<Link to="/dashboard/fav-list" />}
              active={location.pathname === "/dashboard/fav-list"}
            >
              Favourites
            </MenuItem>
          )}

          {/* Change Password */}
          <MenuItem
            icon={<i className="fa fa-key"></i>}
            component={<Link to="/change-password" />}
            active={location.pathname === "/change-password"}
          >
            Change Password
          </MenuItem>

          {/* Logout */}
          <MenuItem icon={<i className="fa fa-sign-out"></i>} onClick={logout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}
