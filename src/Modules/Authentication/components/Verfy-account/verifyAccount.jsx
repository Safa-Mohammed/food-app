import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { publicAxios ,VERIFY_REGISTER_API } from "../../../../constants/api"; 



export default function VerifyRegister() {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm();

  // Get email from localStorage when component loads
  useEffect(() => {
    const savedEmail = localStorage.getItem("verifyEmail");
    if (savedEmail) {
      setEmail(savedEmail);
      setValue("email", savedEmail); // autofill in form
    }
  }, [setValue]);

  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const response = await publicAxios.put(VERIFY_REGISTER_API, {
        email: email,  
        code: data.code,
      });

      toast.success(response.data?.message || "Verification successful!");
      // Clear saved email
      localStorage.removeItem("verifyEmail");

      setTimeout(() => navigate("/login"), 2000);
    } catch (error) {
      console.log(error.response?.data);
      const msg =
        error.response?.data?.message || "Verification failed. Try again.";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="container mt-5">
      <h2>Verify Registration</h2>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div className="mb-3">
          <label>Email</label>
          <input
            type="email"
            className="form-control"
            value={email} // show email
            disabled // prevent editing
            {...register("email")}
          />
        </div>

        <div className="mb-3">
          <label>Verification Code</label>
          <input
            type="text"
            className="form-control"
            {...register("code", { required: "Code is required" })}
          />
          {errors.code && (
            <small className="text-danger">{errors.code.message}</small>
          )}
        </div>

        <button type="submit" className="btn btn-success w-100" disabled={loading}>
          {loading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </div>
  );
}
