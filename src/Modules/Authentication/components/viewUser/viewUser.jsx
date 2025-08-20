import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import { axiosInstance, BASE_URL_IMG, USER_URLS } from "../../../../constants/api";
import Header from "../../../Shared/Components/Header/header";
import imgUsersList from "/RecipesList.png";
import logo from "/3.png";
import NoData from "../../../Shared/Components/NoData/noData";

export default function UserView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [errorDetails, setErrorDetails] = useState(null);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        setLoading(true);
        setErrorDetails(null);
        
        // Try to get the user by ID - adjust this URL based on your API
        const response = await axiosInstance.get(`/users/${id}`);
        
        if (response.data) {
          setUser(response.data);
        } else {
          throw new Error("No user data received");
        }
      } catch (error) {
        console.error("Error fetching user details:", error);
        
        // Store error details for debugging
        setErrorDetails({
          message: error.message,
          response: error.response?.data,
          status: error.response?.status
        });
        
        toast.error(
          error?.response?.data?.message
            ? error.response.data.message
            : "Failed to fetch user details."
        );
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchUser();
    } else {
      toast.error("No user ID provided");
      setLoading(false);
    }
  }, [id, navigate]);

  const goBack = () => {
    navigate("/dashboard/user-list");
  };

  const retryFetch = () => {
    setLoading(true);
    setErrorDetails(null);
    // Retry the fetch operation
    const fetchUser = async () => {
      try {
        const response = await axiosInstance.get(`/users/${id}`);
        setUser(response.data);
      } catch (error) {
        console.error("Error retrying fetch:", error);
        toast.error("Failed again. Please check your connection and API.");
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  };

  return (
    <>
      <Header
        imgPath={imgUsersList}
        title="User Details"
        desc={<span>View detailed information about this user</span>}
      />

      <div className="view-container p-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="m-0">User Information</h5>
            <button className="btn btn-success" onClick={goBack}>
              <i className="fa fa-arrow-left me-2"></i>
              Back to List
            </button>
          </div>

          <div className="card-body-wrapper">
            {loading && (
              <div className="text-center py-5">
                <div className="spinner-border text-success" role="status">
                  <span className="visually-hidden">Loading...</span>
                </div>
                <p className="mt-2">Loading user details...</p>
              </div>
            )}

            {!loading && errorDetails && (
              <div className="card-body text-center py-5">
                <div className="alert alert-danger">
                  <h5>Error Loading User Details</h5>
                  <p>We couldn't load the user details. This could be due to:</p>
                  <ul className="text-start">
                    <li>Invalid user ID: {id}</li>
                    <li>Network connectivity issues</li>
                    <li>API endpoint not responding</li>
                  </ul>
                  
                  <button className="btn btn-primary mt-3" onClick={retryFetch}>
                    <i className="fa fa-refresh me-2"></i>
                    Try Again
                  </button>
                  
                  <div className="mt-4 text-start">
                    <h6>Debug Information:</h6>
                    <pre className="bg-light p-3 small">
                      {JSON.stringify(errorDetails, null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            )}

            {!loading && !user && !errorDetails && (
              <div className="card-body text-center py-5">
                <NoData />
                <p className="mt-3">No user data available for ID: {id}</p>
              </div>
            )}

            {!loading && user && (
              <div className="card-body">
                <div className="row mb-4">
                  <div className="col-md-3">
                    <div className="image-container rounded p-2 text-center">
                      <img
                        src={
                          user?.imagePath
                            ? `${BASE_URL_IMG}${user.imagePath}`
                            : logo
                        }
                        className="img-fluid rounded w-75 p-2 rounded-4"
                        alt={user?.userName || "User image"}
                        onError={(e) => (e.target.src = logo)}
                      />
                    </div>
                  </div>
                  <div className="col-md-9">
                    <div className="row">
                      <div className="col-md-6">
                        <div className="detail-item mb-3">
                          <label className="form-label fw-bold">Username</label>
                          <p className="form-control-static">
                            {user?.userName || "No Username"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="detail-item mb-3">
                          <label className="form-label fw-bold">Email</label>
                          <p className="form-control-static">
                            {user?.email || "N/A"}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="row">
                      <div className="col-md-6">
                        <div className="detail-item mb-3">
                          <label className="form-label fw-bold">Country</label>
                          <p className="form-control-static">
                            {user?.country || "No Country"}
                          </p>
                        </div>
                      </div>
                      <div className="col-md-6">
                        <div className="detail-item mb-3">
                          <label className="form-label fw-bold">Phone Number</label>
                          <p className="form-control-static">
                            {user?.phoneNumber || "No Phone Number"}
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="row">
                  <div className="col-md-6">
                    <div className="detail-item mb-3">
                      <label className="form-label fw-bold">User ID</label>
                      <p className="form-control-static">
                        {user?.id || "N/A"}
                      </p>
                    </div>
                  </div>
                  <div className="col-md-6">
                    <div className="detail-item mb-3">
                      <label className="form-label fw-bold">Registration Date</label>
                      <p className="form-control-static">
                        {user?.creationDate
                          ? new Date(user.creationDate).toLocaleString()
                          : "Date not available"}
                      </p>
                    </div>
                  </div>
                </div>

                {user?.modificationDate && (
                  <div className="row">
                    <div className="col-md-6">
                      <div className="detail-item mb-3">
                        <label className="form-label fw-bold">Last Updated</label>
                        <p className="form-control-static">
                          {user.modificationDate
                            ? new Date(user.modificationDate).toLocaleString()
                            : "Never updated"}
                        </p>
                      </div>
                    </div>
                  </div>
                )}

                {user?.bio && (
                  <div className="detail-item mb-3">
                    <label className="form-label fw-bold">Bio</label>
                    <div className="form-control-static p-3 rounded bg-light">
                      {user.bio}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
}