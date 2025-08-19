import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import Header from "../../../Shared/Components/Header/header";
import imgUsersList from "/RecipesList.png";
import { axiosInstance, USER_URLS, BASE_URL_IMG } from "../../../../constants/api";
import logo from "/3.png";

export default function ViewUser() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(USER_URLS.USER_BY_ID(id));
        setUser(response.data);
      } catch (error) {
        console.error("Error fetching user:", error);
        toast.error("Failed to load user details");
        navigate("/dashboard/users-list");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id, navigate]);

  const goBack = () => navigate("/dashboard/user-list");

  return (
    <>
      <Header
        imgPath={imgUsersList}
        title="User Details"
        desc={<span>View detailed information about this user.</span>}
      />

      <div className="view-user-container p-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="m-0">User Information</h5>
            <button className="btn btn-success" onClick={goBack}>
              <i className="fa fa-arrow-left me-2"></i>Back to List
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : user ? (
            <div className="card-body">
              {/* Image and Name in one line */}
              <div className="d-flex align-items-center mb-3">
                <img
                  src={user.imagePath ? `${BASE_URL_IMG}${user.imagePath}` : logo}
                  alt={user.userName}
                  onError={(e) => (e.target.src = logo)}
                  className="rounded-circle me-3"
                  style={{ width: "80px", height: "80px", objectFit: "cover" }}
                />
                <h4 className="m-0">{user.userName}</h4>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Email</label>
                  <p>{user.email}</p>
                </div>
                <div className="col-md-6">
                  <label>Phone</label>
                  <p>{user.phoneNumber}</p>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <label>Country</label>
                  <p>{user.country}</p>
                </div>
                
              </div>

              
            </div>
          ) : (
            <div className="card-body text-center py-5">
              <p>No user data available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
