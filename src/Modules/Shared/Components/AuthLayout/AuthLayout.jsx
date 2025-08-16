import logo from "../../../../assets/images/logo1.png";
import { Outlet } from 'react-router-dom'
import { ToastContainer } from "react-toastify";


export default function AuthLayout() {
  return (
        <div className="auth-container">
      <div className="container-fluid">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-md-6 rounded-2 px-5 py-5 bg-white">
            <div className="logo-container bg-transparent text-center">
              <img className="w-50" src={logo} alt="logo" />
            </div>
            
    <Outlet></Outlet>
    </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>

  )
}
