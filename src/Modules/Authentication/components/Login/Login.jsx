import React from "react";
import logo from "../../../../assets/images/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { LOGIN_API } from "../../../../constants/api";
import { useContext } from "react";
import { AuthContext } from "../../../../context/authContext";

export default function Login() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();
let {saveUserData}=useContext(AuthContext)
  const onSubmit = async (data) => {
    try {
      const response = await axios.post(LOGIN_API, data);
      console.log(response);
      localStorage.setItem("userToken", response.data.token);
      saveUserData();
      toast.success("Login successful!");

      setTimeout(() => {
        navigate("/dashboard");
      }, 3000);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Login failed. Please try again.";
      toast.error(msg);
    }
  };

  return (
    <div className="auth-container">
      <div className="container-fluid">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-md-6 rounded-2 px-5 py-5 bg-white">
            <div className="logo-container bg-transparent text-center">
              <img className="w-50" src={logo} alt="logo" />
            </div>
            <div className="title py-1">
              <h4>Log In</h4>
              <p>Welcome Back! Please enter your details</p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="mb-3 position-relative">
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  })}
                  type="email"
                  className="form-control ps-5"
                  placeholder="Enter your E-mail"
                />
                <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1">
                  <i className="fa fa-envelope"></i>
                </div>
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              {/* Password */}
              <div className="mb-3 position-relative">
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: {
                      value: 8,
                      message: "Password must be at least 8 characters",
                    },
                  })}
                  type="password"
                  className="form-control ps-5"
                  placeholder="Password"
                />
                <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1">
                  <i className="fa fa-lock"></i>
                </div>
                {errors.password && (
                  <small className="text-danger">{errors.password.message}</small>
                )}
              </div>

              <div className="links d-flex justify-content-between my-2">
                <Link to="/register" className="text-black text-decoration-none">
                  Register Now?
                </Link>
                <Link
                  to="/forget-password"
                  className="text-success text-decoration-none"
                >
                  Forgot Password?
                </Link>
              </div>

              <button type="submit" className="btn-login py-1 rounded">
                Login
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}