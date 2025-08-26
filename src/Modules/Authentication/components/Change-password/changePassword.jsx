import React, { useState } from "react";
import logo from "../../../../assets/images/logo1.png";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { axiosInstance, CHANGE_PASSWORD_API } from "../../../../constants/api";
import { EMAIL_VALIDATION, PASSWORD_VALIDATION } from "../../../../Services/validation";

export default function ChangePassword() {
  const navigate = useNavigate();

  const [showCurrentPassword, setShowCurrentPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    watch,
  } = useForm();

  const newPassword = watch("newPassword", "");

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const token = localStorage.getItem("userToken");

      if (!token) {
        toast.error("You must be logged in to change password.");
        setLoading(false);
        return;
      }

      // Fixed: Added headers with authorization and captured the response
      const response = await axiosInstance.put(
        CHANGE_PASSWORD_API,
        {
          oldPassword: data.currentPassword,
          newPassword: data.newPassword,
          confirmNewPassword: data.confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      toast.success(response?.data?.message || "Password changed successfully!");
      setTimeout(() => {
        navigate("/dashboard");
      }, 2000);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Password change failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="title py-1">
        <h4>Change Password</h4>
        <p>Please enter your current and new password</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)}>
        {/* Current Password */}
        <div className="mb-3 position-relative">
          <div className="input-group">
            <input
              {...register("currentPassword", PASSWORD_VALIDATION)}
              type={showCurrentPassword ? "text" : "password"}
              className="form-control ps-5 pe-5 z-0"
              placeholder="Current Password"
            />
            <span
              className="position-absolute end-0 top-0 mt-2 me-3"
              onClick={() => setShowCurrentPassword(!showCurrentPassword)}
            >
              <i
                className={
                  showCurrentPassword ? "fa fa-eye" : "fa fa-eye-slash"
                }
              ></i>
            </span>
          </div>
          <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1 z-2">
            <i className="fa fa-lock"></i>
          </div>
          {errors.currentPassword && (
            <small className="text-danger">{errors.currentPassword.message}</small>
          )}
        </div>

        {/* New Password */}
        <div className="mb-3 position-relative">
          <div className="input-group">
            <input
              {...register("newPassword", PASSWORD_VALIDATION)}
              type={showNewPassword ? "text" : "password"}
              className="form-control ps-5 pe-5 z-0"
              placeholder="New Password"
            />
            <span
              className="position-absolute end-0 top-0 mt-2 me-3"
              onClick={() => setShowNewPassword(!showNewPassword)}
            >
              <i
                className={showNewPassword ? "fa fa-eye" : "fa fa-eye-slash"}
              ></i>
            </span>
          </div>
          <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1 z-2">
            <i className="fa fa-lock"></i>
          </div>
          {errors.newPassword && (
            <small className="text-danger">{errors.newPassword.message}</small>
          )}
        </div>

        {/* Confirm Password */}
        <div className="mb-4 position-relative">
          <div className="input-group">
            <input
              {...register("confirmPassword", {
                required: "Confirm password is required",
                validate: (value) =>
                  value === newPassword || "Passwords do not match",
              })}
              type={showConfirmPassword ? "text" : "password"}
              className="form-control ps-5 pe-5 z-0"
              placeholder="Confirm New Password"
            />
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
          </div>
          <div className="position-absolute start-0 top-0 mt-2 ms-2 border-end border-1 px-1 z-2">
            <i className="fa fa-lock"></i>
          </div>
          {errors.confirmPassword && (
            <small className="text-danger">{errors.confirmPassword.message}</small>
          )}
        </div>

        <button
          type="submit"
          className="btn-login py-1 rounded w-100"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Changing...
            </>
          ) : (
            "Change Password"
          )}
        </button>
      </form>
      <ToastContainer />
    </>
  );
}