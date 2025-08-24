import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import { axiosInstance, RESET_REQUEST_API } from "../../../../constants/api";
import { EMAIL_VALIDATION } from "../../../../Services/validation";

export default function ForgetPassword() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);  

  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm();

  const onSubmit = async (data) => {
    setLoading(true); 
    try {
       let response =await axiosInstance.post(RESET_REQUEST_API, { email: data.email });
      toast.success( response?.data?.message||"Password reset link sent! Please check your email.");

      
      setTimeout(() => {
       navigate("/reset-password", { state: { email: data.email } });
      }, 2500);
    } catch (error) {
      const msg =
        error.response?.data?.message || "Request failed. Please try again.";
      toast.error(msg);
    } finally {
      setLoading(false); 
    }
  };

  return (
<>
<div className="title py-4">
              <h4>Forgot Your Password?</h4>
              <p className="fs-6">
                No worries! Please enter your email and we will send a password
                reset link.
              </p>
            </div>
            <form onSubmit={handleSubmit(onSubmit)}>
              <div className="mb-3 position-relative">
                <div className="input-group">
                  <input
                    {...register("email",EMAIL_VALIDATION)}
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

              <button
                type="submit"
                className="btn-login py-1 rounded"
                disabled={loading} 
              >
                {loading ? (
                  <>
                    <i className="fa fa-spinner fa-spin me-2"></i>
                    Sending...
                  </>
                ) : (
                  "Submit"
                )}
              </button>
            </form>
</>
  );
}
