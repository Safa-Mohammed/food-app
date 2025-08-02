import React from "react";
import logo from "../../../../assets/images/logo1.png";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";
import "@fortawesome/fontawesome-free/css/all.min.css";

const REGISTER_API = "https://upskilling-egypt.com:3006/api/v1/Users/Register";

export default function Register() {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm();

  const password = watch("password");

  const onSubmit = async (data) => {
    try {
      await axios.post(REGISTER_API, data);
      toast.success("Registration successful!");
      setTimeout(() => navigate("/login"), 3000);
    } catch (error) {
      const msg = error.response?.data?.message || "Registration failed.";
      toast.error(msg);
    }
  };

  return (
    <div className="auth-container d-flex justify-content-center align-items-center vh-100 bg-light">
      <div className="register-form bg-white p-5 rounded shadow w-75">
              <div className="img-logo text-center"> <img src={logo} alt="logo" className="w-25" /></div>
        <div className="text-left mb-4">

          <h4 className="mt-3">Register</h4>
          <p>Welcome Back! Please enter your details</p>
        </div>

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="row">
            {/* Left side */}
            <div className="col-md-6">
              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-id-card"></i>
                </span>
                <input
                  {...register("userName", { required: "User name is required" })}
                  className="form-control"
                  placeholder="UserName"
                />
              </div>
              {errors.userName && <small className="text-danger">{errors.userName.message}</small>}

              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-globe"></i>
                </span>
                <input
                  {...register("country", { required: "Country is required" })}
                  className="form-control"
                  placeholder="Country"
                />
              </div>
              {errors.country && <small className="text-danger">{errors.country.message}</small>}

              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-lock"></i>
                </span>
                <input
                  {...register("password", {
                    required: "Password is required",
                    minLength: { value: 8, message: "Min 8 characters" },
                  })}
                  type="password"
                  className="form-control"
                  placeholder="Password"
                />
              </div>
              {errors.password && <small className="text-danger">{errors.password.message}</small>}
            </div>

            {/* Right side */}
            <div className="col-md-6">
              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-envelope"></i>
                </span>
                <input
                  {...register("email", {
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email format",
                    },
                  })}
                  type="email"
                  className="form-control"
                  placeholder="Enter your E-mail"
                />
              </div>
              {errors.email && <small className="text-danger">{errors.email.message}</small>}

              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-phone"></i>
                </span>
                <input
                  {...register("phoneNumber", { required: "Phone is required" })}
                  className="form-control"
                  placeholder="PhoneNumber"
                />
              </div>
              {errors.phoneNumber && <small className="text-danger">{errors.phoneNumber.message}</small>}

              <div className="mb-3 input-group">
                <span className="input-group-text bg-white">
                  <i className="fa fa-check-circle"></i>
                </span>
                <input
                  {...register("confirmPassword", {
                    required: "Confirm password is required",
                    validate: (value) =>
                      value === password || "Passwords do not match",
                  })}
                  type="password"
                  className="form-control"
                  placeholder="Confirm Password"
                />
              </div>
              {errors.confirmPassword && (
                <small className="text-danger">{errors.confirmPassword.message}</small>
              )}
            </div>
          </div>

          <div className="d-flex justify-content-end align-items-center mt-3">
            <Link to="/login" className="text-success text-decoration-none">
              Login Now?
            </Link>
          </div>

          <button type="submit" className="btn btn-success w-100 mt-3">
            Register
          </button>
        </form>

        <ToastContainer position="top-right" autoClose={5000} />
      </div>
    </div>
  );
}
