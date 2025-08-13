import React, { useState } from "react";
import logo from "../../../../assets/images/logo1.png";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import { useLocation, useNavigate } from "react-router-dom";
import { BASE_URL } from "../../../../constants/api";

const RESET_PASSWORD_API = `${BASE_URL}/Users/Reset`;

export default function ResetPassword() {
  const location = useLocation();
  const prefilledEmail = location.state?.email || "";
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const password = watch("password", "");

  const onSubmit = async (data) => {
    try {
      const response = await axios.post(RESET_PASSWORD_API, {
        email: data.email,
        seed: data.otp,
        password: data.password,
        confirmPassword: data.confirmPassword,
      });

      toast.success("Password reset successful!");
      setTimeout(() => {
        navigate("/login");
      }, 1500);
    } catch (error) {
    let msg = "Reset failed. Please try again.";
    if (error.response?.data?.message) {
      const backendMsg = error.response.data.message.toLowerCase();

      if (
        backendMsg.includes("invalid verification code") ||
        backendMsg.includes("otp")
      ) {
        msg = "Invalid OTP. Please check your code.";
      } else {
        msg = error.response.data.message;
      }
    }
    toast.error(msg);
  }
};

  return (
    <div className="auth-container">
      <div className="container-fluid">
        <div className="row vh-100 justify-content-center align-items-center">
          <div className="col-md-6 rounded-2 px-5 py-5 bg-white">
            <div className="logo-container bg-transparent text-center mb-4">
              <img className="w-25" src={logo} alt="logo" />
            </div>

            <h4 className="mb-3">Reset Password</h4>
            <p className="mb-4">Please Enter Your OTP or Check Your Inbox</p>

            <form onSubmit={handleSubmit(onSubmit)}>
              {/* Email */}
              <div className="mb-3 position-relative">
                <div className="input-group">
                  <input
                    {...register("email")}
                    type="email"
                    className="form-control ps-5 z-0"
                    value={prefilledEmail}
                    disabled
                  />
                </div>
                <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1 z-2">
                  <span>
                    <i className="fa fa-envelope"></i>
                  </span>
                </div>
                {errors.email && (
                  <small className="text-danger">{errors.email.message}</small>
                )}
              </div>

              <div className="mb-3 position-relative">
  <div className="input-group">
    <input
      {...register("otp", {
        required: "Please enter your OTP",
        pattern: {
          value: /^[a-zA-Z0-9]{4}$/,
          message: "OTP should be 4 letters or numbers",
        },
      })}
      type="text"
      className="form-control ps-5 z-0"
      placeholder="OTP"
    />
  </div>
                <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1 z-2">
                  <span>
                    <i className="fa fa-lock"></i>
                  </span>
                </div>
                {errors.otp && (
                  <small className="text-danger">{errors.otp.message}</small>
                )}
              </div>

            {/* Password */}
<div className="mb-3 position-relative">
  <div className="input-group">
    <input
      {...register("password", {
        required: "Password is required",
        minLength: {
          value: 6,
          message: "Password must be at least 6 characters",
        },
        pattern: {
          value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
          message:
            "Password must include uppercase, lowercase, number, and special character",
        },
      })}
      type={showPassword ? "text" : "password"}
      className="form-control ps-5 pe-5 z-0"
      placeholder="Password"
    />
  </div>

  {/* Left icon */}
  <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1 z-2">
    <span>
      <i className="fa fa-lock"></i>
    </span>
  </div>

  {/* Right eye icon */}
  <span
    className="position-absolute end-0 top-0 mt-2 me-3"
    onClick={() => setShowPassword(!showPassword)}
  >
    <i className={showPassword ? "fa fa-eye" : "fa fa-eye-slash"}></i>
  </span>

  {errors.password && (
    <small className="text-danger">{errors.password.message}</small>
  )}
</div>


              {/* Confirm Password */}
              <div className="mb-4 position-relative">
                <div className="input-group">
                  <input
                    {...register("confirmPassword", {
                      required: "Confirm Password is required",
                      validate: (value) =>
                        value === password || "Passwords do not match",
                    })}
                    type={showConfirmPassword ? "text" : "password"}
                    className="form-control ps-5 pe-5 z-0"
                    placeholder="Confirm Password"
                  />
                </div>

                {/* Left icon */}
                <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1 z-2">
                  <span>
                    <i className="fa fa-lock"></i>
                  </span>
                </div>

                {/* Right eye icon */}
                <span
                  className="position-absolute end-0 top-0 mt-2 me-3"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                >
                  <i
                    className={
                      showConfirmPassword ? "fa fa-eye" : "fa fa-eye-slash"
                    }
                  ></i>
                </span>

                {errors.confirmPassword && (
                  <small className="text-danger">
                    {errors.confirmPassword.message}
                  </small>
                )}
              </div>

              <button type="submit" className="btn btn-success w-100 py-2">
                Reset Password
              </button>
            </form>
          </div>
        </div>
      </div>
      <ToastContainer position="top-right" autoClose={5000} />
    </div>
  );
}
