import { useState } from 'react';
import { Sidebar, Menu, MenuItem, SubMenu } from 'react-pro-sidebar';
import { Link } from 'react-router-dom';

export default function SideBar({ logout }) {

  const [isCollapse,setIsCollapse]=useState(false)
  let toggleCollapse =() =>{
setIsCollapse(!isCollapse)
  }
  return (
<div className="w-100  sidebar-continer d-flex">
      {/* Call the logout function on button click */}
      {/* <button className="btn btn-info" onClick={logout}>
        Logout
      </button> */}

      <Sidebar collapsed={isCollapse} className='sidebaar'>
 
<Menu >
   
  <img src="/3.png" alt="logo" className='w-75 my-3'  onClick={toggleCollapse}/>
  <MenuItem
    icon={<i className="fa fa-home" aria-hidden="true"></i>}
    component={<Link to="/dashboard" />}
  >
    Home
  </MenuItem>

  <MenuItem
    icon={<i className="fa fa-users" aria-hidden="true"></i>}
    component={<Link to="/dashboard/user-list" />}
  >
    Users
  </MenuItem>

  <MenuItem
    icon={<i className="fa fa-cutlery" aria-hidden="true"></i>}
    component={<Link to="/dashboard/recipes-list" />}
  >
    Recipes
  </MenuItem>

  <MenuItem
    icon={<i className="fa fa-list" aria-hidden="true"></i>}
    component={<Link to="/dashboard/categories-list" />}
  >
    Categories
  </MenuItem>

  <MenuItem
    icon={<i className="fa fa-key" aria-hidden="true"></i>}
    component={<Link to="/change-password" />}
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
  )
}
