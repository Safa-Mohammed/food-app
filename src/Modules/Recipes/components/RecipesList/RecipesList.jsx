import { useEffect, useState, useRef } from "react";
import Header from "../../../Shared/Components/Header/header";
import imgRecipesList from "/RecipesList.png";
import axios from "axios";
import NoData from "../../../Shared/Components/NoData/noData";
import logo from "/3.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RecipesList.css";
import { useNavigate } from "react-router-dom";
import DeleteConfrimation from "../../../Shared/Components/DeleteConfirmation/deleteConfrimation";

// Import API constants
import { axiosInstance, RECIPE_API, RECIPE_BY_ID_API } from "../../../../constants/api";

export default function RecipesList() {
  const [recipesList, setRecipesList] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [loading, setLoading] = useState(true);
  const menuRef = useRef(null);
  let navigate = useNavigate();

  // Fetch all recipes
  const getAllData = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(RECIPE_API,);
      setRecipesList(response.data.data || []);
    } catch (error) {
      toast.error("Failed to fetch recipes.");
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData();
  }, []);

  // Toggle menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open delete modal
  const openDeleteModal = (id) => {
    setDeleteConfirmId(id);
    setOpenMenuId(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Delete recipe
  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(RECIPE_BY_ID_API(deleteConfirmId), {
        headers: { Authorization: localStorage.getItem("userToken") },
      });
      toast.success("Recipe deleted successfully.");
      getAllData();
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error("Failed to delete recipe.");
      console.error("Delete failed:", error);
    } finally {
      setDeleteLoading(false);
    }
  };

  return (
    <>
      <Header
        imgPath={imgRecipesList}
        title="Recipes List"
        desc={
          <>
            <span>Manage and edit your recipes here.</span>
            <br />
            <span>You can delete or update any recipe.</span>
          </>
        }
      />

      {/* Title */}
      <div className="title d-flex justify-content-between p-2 align-items-center">
        <div className="description p-2">
          <h4 className="m-0 fs-5">Recipes Table Details</h4>
          <p className="m-0">View, edit or delete recipes</p>
        </div>
        <div>
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/dashboard/recipes-data")}
          >
            Add New Recipe
          </button>
        </div>
      </div>

      {/* Data */}
      <div className="data p-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : recipesList.length > 0 ? (
          <>
            <table className="table table-striped text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Image</th>
                  <th>Price</th>
                  <th>Description</th>
                  <th>Category</th>
                  <th>Tag</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {recipesList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>
                      <img
                        src={
                          item.imagePath
                            ? `https://upskilling-egypt.com:3006/${item.imagePath}`
                            : logo
                        }
                        alt={item.name}
                        onError={(e) => (e.target.src = logo)}
                      />
                    </td>
                    <td>{item.price}</td>
                    <td>{item.description}</td>
                    <td>{item.category?.[0]?.name || ""}</td>
                    <td>{item.tag?.name || ""}</td>
                    <td className="action-cell">
                      <i
                        className="fa-solid fa-ellipsis-h action-icon"
                        onClick={() => toggleMenu(item.id)}
                      ></i>

                      {openMenuId === item.id && (
                        <div className="action-menu" ref={menuRef}>
                          <div
                            className="action-menu-item hover-bg"
                            onClick={() =>
                              navigate(`/dashboard/view-recipes/${item.id}`)
                            }
                          >
                            <i className="fa-regular fa-eye me-2 text-success"></i>
                            View
                          </div>
                          <div
                            className="action-menu-item hover-bg"
                            onClick={() =>
                              navigate(`/dashboard/recipes-data/${item.id}`)
                            }
                          >
                            <i className="fa-regular fa-pen-to-square me-2 text-primary"></i>
                            Edit
                          </div>
                          <div
                            className="action-menu-item hover-bg"
                            onClick={() => openDeleteModal(item.id)}
                          >
                            <i className="fa-regular fa-trash-can me-2 text-danger"></i>
                            Delete
                          </div>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </>
        ) : (
          <NoData />
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirmId !== null && (
        <div className="modal-backdrop">
          <div className="modal-content-custom p-4 text-center d-flex flex-column align-items-center position-relative">
            <i
              className="fa fa-close modal-close-icon"
              onClick={cancelDelete}
            ></i>
            <DeleteConfrimation deleteItem={"Recipe"} />
            <div className="modal-buttons border-top border-dark-subtle pt-4 w-100 d-flex justify-content-end">
              <div className="w-auto">
                <button
                  className="button-delete px-4 d-flex align-items-center justify-content-center"
                  onClick={handleDelete}
                  disabled={deleteLoading}
                >
                  {deleteLoading ? (
                    <>
                      <span
                        className="spinner-border spinner-border-sm me-2"
                        role="status"
                        aria-hidden="true"
                      ></span>
                      Deleting...
                    </>
                  ) : (
                    "Delete This Item"
                  )}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
