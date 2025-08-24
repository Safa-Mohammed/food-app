import { useEffect, useState, useRef, useContext } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import './RecipesList.css'
import Header from "../../../Shared/Components/Header/header";
import NoData from "../../../Shared/Components/NoData/noData";
import DeleteConfrimation from "../../../Shared/Components/DeleteConfirmation/deleteConfrimation";
import { AuthContext } from "../../../../context/authContext";

import imgRecipesList from "/RecipesList.png";
import logo from "/3.png";

import {
  axiosInstance,
  RECIPE_API,
  RECIPE_BY_ID_API,
  TAG_API,
  CATEGORY_API,
  BASE_URL_IMG,
  FAV_URLS // Import FAV_URLS for favorite functionality
} from "../../../../constants/api";

export default function RecipesList() {
  const [recipesList, setRecipesList] = useState([]);
  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);
  const { loginData } = useContext(AuthContext);

  const [loading, setLoading] = useState(true);
  const [numberOfPages, setNumberOfPages] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCate, setSelectedCate] = useState("");

  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [favoriteLoading, setFavoriteLoading] = useState(null); // Track which recipe is being favorited

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const isDataEmpty = !loading && recipesList.length === 0;
  const isDataLoaded = !loading && recipesList.length > 0;

  // Fetch recipes with filters
  const getAllData = async (pageSize = 10, pageNum = 1, name = "", tag = "", category = "") => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(RECIPE_API, {
        params: { pageSize, pageNumber: pageNum, name, tag, category },
      });
      setRecipesList(response.data.data || []);
      setNumberOfPages(
        Array(response.data.totalNumberOfPages || 1)
          .fill()
          .map((_, i) => i + 1)
      );
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to fetch recipes.");
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  // Fetch all tags
  const fetchTags = async () => {
    try {
      const res = await axiosInstance.get(TAG_API, {
        params: { pageNumber: 1, pageSize: 1000 }, // get all tags
      });
      setTags(res.data.data || res.data || []);
    } catch (error) {
      toast.error("Failed to fetch tags.");
    }
  };

  // Fetch all categories
  const fetchCategories = async () => {
    try {
      const res = await axiosInstance.get(CATEGORY_API, {
        params: { pageNumber: 1, pageSize: 1000 }, // get all categories
      });
      setCategories(res.data.data || res.data || []);
    } catch (error) {
      toast.error("Failed to fetch categories.");
    }
  };

  // Add to favorites function
  const handleFavorite = async (recipeId) => {
    setFavoriteLoading(recipeId);
    try {
      await axiosInstance.post(FAV_URLS.ADD_FAVORITE, {
        recipeId: recipeId
      });
      toast.success("Recipe added to favorites successfully!");
      setOpenMenuId(null); // Close the menu after adding to favorites
    } catch (error) {
      console.error("Error adding to favorites:", error);
      if (error.response?.status === 400 && error.response?.data?.message?.includes("already exists")) {
        toast.info("This recipe is already in your favorites!");
      } else {
        toast.error(error.response?.data?.message || "Failed to add to favorites.");
      }
    } finally {
      setFavoriteLoading(null);
    }
  };

  // Initial data fetch
  useEffect(() => {
    getAllData(10, 1);
    fetchTags();
    fetchCategories();
  }, []);

  // Handle search by name
  const getNameValue = (e) => {
    const name = e.target.value;
    setNameValue(name);
    getAllData(10, 1, name, selectedTag, selectedCate);
  };

  // Handle tag change
  const handleTagChange = (e) => {
    const tagId = e.target.value;
    setSelectedTag(tagId);
    getAllData(10, 1, nameValue, tagId, selectedCate);
  };

  // Handle category change
  const handleCategoryChange = (e) => {
    const cateId = e.target.value;
    setSelectedCate(cateId);
    getAllData(10, 1, nameValue, selectedTag, cateId);
  };

  // Handle dropdown menu toggle
  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Delete modal handlers
  const openDeleteModal = (id) => {
    setDeleteConfirmId(id);
    setOpenMenuId(null);
  };

  const cancelDelete = () => setDeleteConfirmId(null);

  const handleDelete = async () => {
    setDeleteLoading(true);
    try {
      await axiosInstance.delete(RECIPE_BY_ID_API(deleteConfirmId), {
        headers: { Authorization: localStorage.getItem("userToken") },
      });
      toast.success("Recipe deleted successfully.");
      getAllData(10, 1, nameValue, selectedTag, selectedCate);
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to delete recipe.");
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

      {/* Title & Add Button */}
      <div className="title d-flex justify-content-between p-2 align-items-center">
        <div className="description p-2">
          <h4 className="m-0 fs-5">Recipes Table Details</h4>
          <p className="m-0">View, edit or delete recipes</p>
        </div>
        {loginData?.userGroup == "SuperAdmin" ? (
          <button
            className="btn btn-success me-2"
            onClick={() => navigate("/dashboard/recipes-data")}
          >
            Add New Recipe
          </button>
        ) : ''}
      </div>

      {/* Filters */}
      <div className="search p-4 d-flex gap-3">
        <input
          type="search"
          className="form-control py-2 my-3"
          placeholder="Search by name ..."
          value={nameValue}
          onChange={getNameValue}
        />
        <select className="form-select py-2 my-3" value={selectedTag} onChange={handleTagChange}>
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <select className="form-select py-2 my-3" value={selectedCate} onChange={handleCategoryChange}>
          <option value="">All Categories</option>
          {categories.map((cate) => (
            <option key={cate.id} value={cate.id}>
              {cate.name}
            </option>
          ))}
        </select>
      </div>

      {/* Data Section */}
      <div className="data p-3">
        {loading && (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {isDataEmpty && (
          <div className="text-center py-5">
            {selectedTag || selectedCate || nameValue ? (
              <div>
                <NoData />
                <button
                  className="btn btn-outline-primary mt-2"
                  onClick={() => {
                    setSelectedTag("");
                    setSelectedCate("");
                    setNameValue("");
                    getAllData(10, 1);
                  }}
                >
                  Clear Filters
                </button>
              </div>
            ) : (
              <NoData />
            )}
          </div>
        )}

        {isDataLoaded && (
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
                        src={item.imagePath ? `${BASE_URL_IMG}/${item.imagePath}` : logo}
                        alt={item.name}
                        onError={(e) => (e.currentTarget.src = logo)}
                        style={{ width: "50px", height: "50px", objectFit: "cover" }}
                      />
                    </td>
                    <td>{item.price ?? ""}</td>
                    <td>{item.description ?? ""}</td>
                    <td>{item.category?.[0]?.name || ""}</td>
                    <td>{item.tag?.name || ""}</td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => toggleMenu(item.id)}
                        aria-label="Open actions menu"
                      >
                        <i className="fa-solid fa-ellipsis-h"></i>
                      </button>

                      {openMenuId === item.id && (
                        <div className="action-menu" ref={menuRef}>
                          {loginData?.userGroup === "SuperAdmin" ? (
                            <>
                              <button
                                type="button"
                                className="action-menu-item hover-bg"
                                onClick={() => navigate(`/dashboard/view-recipes/${item.id}`)}
                              >
                                <i className="fa-regular fa-eye me-2 text-success"></i>
                                View
                              </button>
                              <button
                                type="button"
                                className="action-menu-item hover-bg"
                                onClick={() => navigate(`/dashboard/recipes-data/${item.id}`)}
                              >
                                <i className="fa-regular fa-pen-to-square me-2 text-primary"></i>
                                Edit
                              </button>
                              <button
                                type="button"
                                className="action-menu-item hover-bg"
                                onClick={() => openDeleteModal(item.id)}
                              >
                                <i className="fa-regular fa-trash-can me-2 text-danger"></i>
                                Delete
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                type="button"
                                className="action-menu-item hover-bg"
                                onClick={() => navigate(`/dashboard/view-recipes/${item.id}`)}
                              >
                                <i className="fa-regular fa-eye me-2 text-success"></i>
                                View
                              </button>
                              <button
                                type="button"
                                className="action-menu-item hover-bg"
                                onClick={() => handleFavorite(item.id)}
                                disabled={favoriteLoading === item.id}
                              >
                                {favoriteLoading === item.id ? (
                                  <>
                                    <span className="spinner-border spinner-border-sm me-2"></span>
                                    Adding...
                                  </>
                                ) : (
                                  <>
                                    <i className="fa-regular fa-heart me-2 text-warning"></i>
                                    Favorite
                                  </>
                                )}
                              </button>
                            </>
                          )}
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <nav aria-label="Page navigation example">
              <ul className="pagination justify-content-center">
                {numberOfPages.map((pageNum) => (
                  <li
                    key={pageNum}
                    className="page-item"
                    onClick={() => getAllData(10, pageNum, nameValue, selectedTag, selectedCate)}
                  >
                    <a className="page-link" href="#">
                      {pageNum}
                    </a>
                  </li>
                ))}
              </ul>
            </nav>
          </>
        )}
      </div>

      {/* Delete Modal */}
      {deleteConfirmId && (
        <div className="modal-backdrop">
          <div className="modal-content-custom p-4 text-center d-flex flex-column align-items-center position-relative">
            <i className="fa fa-close modal-close-icon" onClick={cancelDelete}></i>
            <DeleteConfrimation deleteItem={"Recipe"} />
            <div className="modal-buttons border-top border-dark-subtle pt-4 w-100 d-flex justify-content-end">
              <button
                className="button-delete px-4 d-flex align-items-center justify-content-center"
                onClick={handleDelete}
                disabled={deleteLoading}
              >
                {deleteLoading && (
                  <span className="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                )}
                {deleteLoading ? "Deleting..." : "Delete This Item"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}