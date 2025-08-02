import React from "react";
import logo from "../../../../assets/images/logo1.png";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { RESET_REQUEST_API } from "../../../../constants/api";

export default function ForgetPassword() {
  const navigate = useNavigate();

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(RESET_REQUEST_API, { email: data.email });
      toast.success("Password reset link sent! Please check your email.");

      // Navigate after a short delay to let user see the toast
      setTimeout(() => {
        navigate("/reset-password");
      }, 2500);
      
    } catch (error) {
      const msg = error.response?.data?.message || "Request failed. Please try again.";
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
            <div className="title py-4">
              <h4>Forgot Your Password?</h4>
              <p className="fs-6">
                No worries! Please enter your email and we will send a password reset link.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3 position-relative">
                <div className="input-group">
                  <input
                    {...register("email", {
                      required: "Email is required",
                      pattern: {
                        value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                        message: "Invalid email address",
                      },
                    })}
                    type="email"
                    className="form-control ps-5 z-0"
                    placeholder="Enter your E-mail"
                  />
                </div>
                <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1 z-2">
                  <i className="fa fa-envelope"></i>
                </div>
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              <button type="submit" className="btn-login py-1 rounded">
                Submit
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}