import React from 'react'
import SideBar from '../SideBar/SideBar'
import Navbar from '../Navbar/Navbar'
import Header from '../Header/header'
import { Outlet } from 'react-router-dom'

export default function MasterLayout() {
  return (
    <>
    <div className='d-flex'> 
      <div className='w-25'>
<SideBar/>
      </div>
       <div >
<Navbar/>
<Header/>
<Outlet/>
      </div>
      </div></>
  )
}
