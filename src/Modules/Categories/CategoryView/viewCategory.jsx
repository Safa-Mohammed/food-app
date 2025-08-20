import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Shared/Components/Header/header";
import imgRecipesList from "/RecipesList.png";
import {
  axiosInstance,
  CATEGORY_BY_ID_API,
  BASE_URL_IMG,
} from "../../../constants/api";
import NoData from "../../Shared/Components/NoData/noData";

export default function CategoriesView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = await axiosInstance.get(CATEGORY_BY_ID_API(id));
        setCategory(response?.data?.data ?? response?.data ?? null);
      } catch (error) {
      toast.error(
        error?.response?.data?.message
          ? error.response.data.message
          : "Failed"
      );
    } finally {
      setLoading(false);
    }
  };

    if (id) fetchCategory();
  }, [id, navigate]);

  const goBack = () => {
    navigate("/dashboard/categories-list");
  };

  return (
    <>
      <Header
        imgPath={imgRecipesList}
        title="Category Details"
        desc={<span>View detailed information about this category</span>}
      />

      <div className="view-container p-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="m-0">Category Information</h5>
            <button className="btn btn-success" onClick={goBack}>
              <i className="fa fa-arrow-left me-2"></i>
              Back to List
            </button>
          </div>

          {loading ? (
            <div className="text-center py-5">
              <div className="spinner-border text-success" role="status">
                <span className="visually-hidden">Loading...</span>
              </div>
            </div>
          ) : category ? (
            <div className="card-body">
              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="form-label">Category ID</label>
                    <p className="form-control-static">
                      {category.id || "N/A"}
                    </p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="form-label">Category Name</label>
                    <p className="form-control-static">
                      {category?.name ?? "No Name"}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="form-label">Creation Date</label>
                    <p className="form-control-static">
                      {category?.creationDate
                        ? new Date(category.creationDate).toLocaleString()
                        : "Date not available"}
                    </p>
                  </div>
                </div>

                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="form-label">Last Updated</label>
                    <p className="form-control-static">
                      {category?.modificationDate
                        ? new Date(category.modificationDate).toLocaleString()
                        : "Never updated"}
                    </p>
                  </div>
                </div>

                <div className="detail-item mb-3">
                  <label className="form-label">Description</label>
                  <div className="form-control-static p-3 rounded">
                    {category?.description ?? "No description available"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-body text-center py-5">
              <NoData />
            </div>
          )}
        </div>
      </div>
    </>
  );
}
