import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../Shared/Components/Header/header";
import imgRecipesList from "/RecipesList.png";
import { CATEGORY_BY_ID_API } from '../../../constants/api';

export default function ViewCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [category, setCategory] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchCategory = async () => {
      try {
        setLoading(true);
        const response = 
       await axios.get(CATEGORY_BY_ID_API(id),
          { headers: { Authorization: localStorage.getItem("userToken") } }
        );
        setCategory(response.data);
      } catch (error) {
        console.error("Error fetching category:", error);
        toast.error("Failed to load category details");
        navigate("/dashboard/categories");
      } finally {
        setLoading(false);
      }
    };

    fetchCategory();
  }, [id, navigate]);

  const goBack = () => {
    navigate("/dashboard/categories-list");
  };

  return (
    <>
      <Header
        imgPath={imgRecipesList}
        title="Category Details"
        desc={
          <>
            <span>View detailed information about this category</span>
          </>
        }
      />

      <div className="view-category-container p-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="m-0">Category Information</h5>
            <button className="btn btn-success" onClick={goBack}>
              <i className="fa fa-arrow-left me-2 "></i>
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
                  <div className="detail-item">
                    <label>Category ID</label>
                    <p>{category.id}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <label>Name</label>
                    <p>{category.name}</p>
                  </div>
                </div>
              </div>

              <div className="row mb-3">
                <div className="col-md-6">
                  <div className="detail-item">
                    <label>Creation Date</label>
                    <p>{new Date(category.creationDate).toLocaleString()}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item">
                    <label>Last Updated</label>
                    <p>
                      {category.modificationDate
                        ? new Date(category.modificationDate).toLocaleString()
                        : "Never updated"}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="card-body text-center py-5">
              <p>No category data available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}