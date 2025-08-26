import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
  COUNTERY_VALIDATION,
  EMAIL_VALIDATION,
  PASSWORD_VALIDATION,
  PHONE_VALIDATION,
  USERNAME_VALIDATION,
} from "../../../../Services/validation";
import { publicAxios, REGISTER_API } from "../../../../constants/api";

export default function Register() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [profileImage, setProfileImage] = useState(null);

  // 👀 states for password visibility
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    if (data.password !== data.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("userName", data.userName);
      formData.append("email", data.email);
      formData.append("country", data.country);
      formData.append("phoneNumber", data.phoneNumber);
      formData.append("password", data.password);
      formData.append("confirmPassword", data.confirmPassword);
      if (profileImage) formData.append("profileImage", profileImage);

      const response = await publicAxios.post(REGISTER_API, formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      toast.success(response.data?.message || "Registration successful!");
      localStorage.setItem("verifyEmail", data.email);
      setTimeout(() => navigate("/verify-account"), 2000);
    } catch (error) {
      const msg =
        error.response?.data?.message ||
        "Registration failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <div className="title py-1">
        <h4>Register</h4>
        <p>Welcome Back! Please enter your details</p>
      </div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="row">
          {/* Left side */}
          <div className="col-md-6">
            {/* Username */}
            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-id-card"></i>
              </span>
              <input
                {...register("userName", USERNAME_VALIDATION)}
                className="form-control"
                placeholder="UserName"
              />
            </div>
            {errors.userName && (
              <small className="text-danger">{errors.userName.message}</small>
            )}

            {/* Country */}
            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-globe"></i>
              </span>
              <input
                {...register("country", COUNTERY_VALIDATION)}
                className="form-control"
                placeholder="Country"
              />
            </div>
            {errors.country && (
              <small className="text-danger">{errors.country.message}</small>
            )}

            {/* Password with eye 👀 */}
            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-lock"></i>
              </span>
              <input
                {...register("password", PASSWORD_VALIDATION)}
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Password"
              />
              <span
                className="input-group-text bg-white"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fa ${showPassword ? "fa-eye" : "fa-eye-slash"}`}></i>
              </span>
            </div>
            {errors.password && (
              <small className="text-danger">{errors.password.message}</small>
            )}
          </div>

          {/* Right side */}
          <div className="col-md-6">
            {/* Email */}
            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-envelope"></i>
              </span>
              <input
                {...register("email", EMAIL_VALIDATION)}
                type="email"
                className="form-control"
                placeholder="Enter your E-mail"
              />
            </div>
            {errors.email && (
              <small className="text-danger">{errors.email.message}</small>
            )}

            {/* Phone */}
            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-phone"></i>
              </span>
              <input
                {...register("phoneNumber", PHONE_VALIDATION)}
                className="form-control"
                placeholder="Phone Number"
              />
            </div>
            {errors.phoneNumber && (
              <small className="text-danger">
                {errors.phoneNumber.message}
              </small>
            )}

            {/* Confirm Password with eye 👀 */}
            <div className="mb-3 input-group">
              <span className="input-group-text bg-white">
                <i className="fa fa-check-circle"></i>
              </span>
              <input
                {...register("confirmPassword", PASSWORD_VALIDATION)}
                type={showConfirmPassword ? "text" : "password"}
                className="form-control"
                placeholder="Confirm Password"
              />
              <span
                className="input-group-text bg-white"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              >
                <i
                  className={`fa ${
                    showConfirmPassword ? "fa-eye" : "fa-eye-slash"
                  }`}
                ></i>
              </span>
            </div>
            {errors.confirmPassword && (
              <small className="text-danger">
                {errors.confirmPassword.message}
              </small>
            )}
          </div>
        </div>

        <div className="d-flex justify-content-end align-items-center mt-3">
          <Link to="/login" className="text-success text-decoration-none">
            Login Now?
          </Link>
        </div>

        <button
          type="submit"
          className="btn btn-success w-100 mt-3"
          disabled={loading}
        >
          {loading ? (
            <>
              <span
                className="spinner-border spinner-border-sm me-2"
                role="status"
                aria-hidden="true"
              ></span>
              Registering...
            </>
          ) : (
            "Register"
          )}
        </button>
      </form>
    </>
  );
}
