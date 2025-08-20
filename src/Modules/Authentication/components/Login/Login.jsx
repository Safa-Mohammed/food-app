import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance, LOGIN_API } from "../../../../constants/api";
import { useState } from "react";
import {
  EMAIL_VALIDATION,
  PASSWORD_VALIDATION,
} from "../../../../Services/validation";

export default function Login({ getLoginData }) {
  const navigate = useNavigate();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (data) => {
    try {
      const response = await axiosInstance.post(LOGIN_API, data);
      console.log(response);
      localStorage.setItem("userToken", response.data.token);
      toast.success(response?.data?.message || "Login successful!");

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
    <>
      <div className="title py-1">
        <h4>Log In</h4>
        <p>Welcome Back! Please enter your details</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Email */}
        <div className="mb-3 position-relative">
          <input
            {...register("email", EMAIL_VALIDATION)}
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
            {...register("password", PASSWORD_VALIDATION)}
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

        <button
          type="submit"
          className="btn-login py-1 rounded"
          disabled={isSubmitting}
        >
          {isSubmitting ? "Loading..." : "Submit"}
        </button>
      </form>
    </>
  );
}
