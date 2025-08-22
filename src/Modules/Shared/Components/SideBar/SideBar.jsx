// SideBar.jsx
import { Sidebar, Menu, MenuItem } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

export default function SideBar({ logout, isCollapse, onToggle }) {
  const location = useLocation();

  return (
    <div className="sidebar-container">
      <Sidebar collapsed={isCollapse} className="sidebaar py-4">
        <Menu>
          {/* Logo = collapse toggle */}
          <div className="logo-container" onClick={onToggle}>
            <img
              src="/3.png"
              alt="logo"
              className="logo w-100"
            />
          </div>

          <MenuItem icon={<i className="fa fa-home"></i>}
            component={<Link to="/dashboard" />}
            active={location.pathname === "/dashboard"}>
            Home
          </MenuItem>

          <MenuItem icon={<i className="fa fa-users"></i>}
            component={<Link to="/dashboard/user-list" />}
            active={location.pathname === "/dashboard/user-list"}>
            Users
          </MenuItem>

          <MenuItem icon={<i className="fa fa-cutlery"></i>}
            component={<Link to="/dashboard/recipes-list" />}
            active={location.pathname === "/dashboard/recipes-list"}>
            Recipes
          </MenuItem>

          <MenuItem icon={<i className="fa fa-list"></i>}
            component={<Link to="/dashboard/categories-list" />}
            active={location.pathname === "/dashboard/categories-list"}>
            Categories
          </MenuItem>

          <MenuItem icon={<i className="fa fa-key"></i>}
            component={<Link to="/change-password" />}
            active={location.pathname === "/change-password"}>
            Change Password
          </MenuItem>

          <MenuItem icon={<i className="fa fa-sign-out"></i>} onClick={logout}>
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
    </div>
  );
}
