import { useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { useParams, useNavigate } from "react-router-dom";
import Header from "../../../Shared/Components/Header/header";
import imgRecipesList from "/RecipesList.png";
import logo from "/3.png";
import "./RecipesView.css";
import { RECIPE_BY_ID_API } from "../../../../constants/api";

export default function RecipesView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [recipe, setRecipe] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRecipe = async () => {
      try {
        setLoading(true);
        const response = await axios.get(RECIPE_BY_ID_API(id), {
          headers: { Authorization: localStorage.getItem("userToken") },
        });
        setRecipe(response.data);
      } catch (error) {
        console.error("Error fetching recipe:", error);
        toast.error("Failed to load recipe details");
        navigate("/dashboard/recipes-list");
      } finally {
        setLoading(false);
      }
    };

    fetchRecipe();
  }, [id, navigate]);

  const goBack = () => {
    navigate("/dashboard/recipes-list");
  };

  return (
    <>
      <Header
        imgPath={imgRecipesList}
        title="Recipe Details"
        desc={<span>View detailed information about this recipe</span>}
      />

      <div className="view-container p-4">
        <div className="card">
          <div className="card-header d-flex justify-content-between align-items-center">
            <h5 className="m-0">Recipe Information</h5>
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
          ) : recipe ? (
            <div className="card-body">
              <div className="row mb-4">
                <div className="col-md-3">
                  <div className="image-container rounded p-2 text-center">
                    <img
                      src={
                        recipe.imagePath
                          ? `https://upskilling-egypt.com:3006/${recipe.imagePath}`
                          : logo
                      }
                      className="img-fluid rounded w-75 p-2 rounded-4"
                      alt={recipe.name}
                      onError={(e) => (e.target.src = logo)}
                    />
                  </div>
                </div>
                <div className="col-md-9">
                  <div className="row">
                    <div className="col-md-6">
                      <div className="detail-item mb-3">
                        <label className="form-label">Recipe Name</label>
                        <p className="form-control-static">{recipe.name}</p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-item mb-3">
                        <label className="form-label">Price</label>
                        <p className="form-control-static">${recipe.price}</p>
                      </div>
                    </div>
                  </div>

                  <div className="row">
                    <div className="col-md-6">
                      <div className="detail-item mb-3">
                        <label className="form-label">Category</label>
                        <p className="form-control-static">
                          {recipe.category?.[0]?.name || "No Category"}
                        </p>
                      </div>
                    </div>
                    <div className="col-md-6">
                      <div className="detail-item mb-3">
                        <label className="form-label">Tag</label>
                        <p className="form-control-static">
                          {recipe.tag?.name || "No Tag"}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="form-label">Recipe ID</label>
                    <p className="form-control-static">{recipe.id}</p>
                  </div>
                </div>
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="form-label">Creation Date</label>
                    <p className="form-control-static">
                      {new Date(recipe.creationDate).toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>

              <div className="row">
                <div className="col-md-6">
                  <div className="detail-item mb-3">
                    <label className="form-label">Last Updated</label>
                    <p className="form-control-static">
                      {recipe.modificationDate
                        ? new Date(recipe.modificationDate).toLocaleString()
                        : "Never updated"}
                    </p>
                  </div>
                </div>
              </div>

              <div className="detail-item mb-3">
                <label className="form-label">Description</label>
                <div className="form-control-static p-3 rounded">
                  {recipe.description || "No description available"}
                </div>
              </div>

            
            </div>
          ) : (
            <div className="card-body text-center py-5">
              <p className="text-muted">No recipe data available</p>
            </div>
          )}
        </div>
      </div>
    </>
  );
}
