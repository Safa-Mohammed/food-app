import { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link, useLocation } from 'react-router-dom';

export default function SideBar({ logout }){
   const [isCollapse, setIsCollapse] = useState(() => {
    const savedState = localStorage.getItem("sidebarCollapsed");
    return savedState ? JSON.parse(savedState) : false;  
  });

  const toggleCollapse = () => {
    setIsCollapse((prev) => {
      localStorage.setItem("sidebarCollapsed", JSON.stringify(!prev));  
      return !prev;
    });
  };
  const location = useLocation();
  return (
 <div className="w-25 sidebar-continer d-flex ">
 
 <div className="main-content ">
  <Sidebar collapsed={isCollapse} className="sidebaar  position-fixed"  >
        <Menu>
          <img
            src="/3.png"
            alt="logo"
            className="w-75 my-3"
            onClick={toggleCollapse}
          />

          <MenuItem
            icon={<i className="fa fa-home" aria-hidden="true"></i>}
            component={<Link to="/dashboard" />}
            active={location.pathname === "/dashboard"} // 👈
          >
            Home
          </MenuItem>

          <MenuItem
            icon={<i className="fa fa-users" aria-hidden="true"></i>}
            component={<Link to="/dashboard/user-list" />}
            active={location.pathname === "/dashboard/user-list"} // 👈
          >
            Users
          </MenuItem>

          <MenuItem
            icon={<i className="fa fa-cutlery" aria-hidden="true"></i>}
            component={<Link to="/dashboard/recipes-list" />}
            active={location.pathname === "/dashboard/recipes-list"} // 👈
          >
            Recipes
          </MenuItem>

          <MenuItem
            icon={<i className="fa fa-list" aria-hidden="true"></i>}
            component={<Link to="/dashboard/categories-list" />}
            active={location.pathname === "/dashboard/categories-list"} // 👈
          >
            Categories
          </MenuItem>

          <MenuItem
            icon={<i className="fa fa-key" aria-hidden="true"></i>}
            component={<Link to="/change-password" />}
            active={location.pathname === "/change-password"} // 👈
          >
            Change Password
          </MenuItem>

          <MenuItem
            icon={<i className="fa fa-sign-out" aria-hidden="true"></i>}
            onClick={logout}
          >
            Logout
          </MenuItem>
        </Menu>
      </Sidebar>
 </div>
      
    </div>
  )
}
