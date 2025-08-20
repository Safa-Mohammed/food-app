import { useEffect, useState, useRef } from "react";
import Header from "../../../Shared/Components/Header/header";
import imgRecipesList from "/RecipesList.png";
import NoData from "../../../Shared/Components/NoData/noData";
import logo from "/3.png";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import "./RecipesList.css";
import { useNavigate } from "react-router-dom";
import DeleteConfrimation from "../../../Shared/Components/DeleteConfirmation/deleteConfrimation";

// API imports
import {
  axiosInstance,
  RECIPE_API,
  RECIPE_BY_ID_API,
  TAG_API,
  CATEGORY_API,
  BASE_URL_IMG,
} from "../../../../constants/api";

export default function RecipesList() {
  const [recipesList, setRecipesList] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState([]);
  const [nameValue, setNameValue] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [selectedCate, setSelectedCate] = useState("");
  const [loading, setLoading] = useState(true);

  const [tags, setTags] = useState([]);
  const [categories, setCategories] = useState([]);

  const menuRef = useRef(null);
  const navigate = useNavigate();

  const isDataEmpty = !loading && recipesList.length === 0;
  const isDataLoaded = !loading && recipesList.length > 0;

  // Fetch recipes
  const getAllData = async (pageSize, pageNum, name, tag, category) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(RECIPE_API, {
        params: { pageSize, pageNumber: pageNum, name, tag, category },
      });
      setRecipesList(response.data.data || []);
      setNumberOfPages(
        Array(response.data.totalNumberOfPages)
          .fill()
          .map((_, i) => i + 1)
      );
    } catch (error) {
      toast.error(
        error?.response?.data?.message
          ? error.response.data.message
          : "Failed to fetch recipes."
      );
      console.error("Error fetching recipes:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData(3, 1, "", selectedTag, selectedCate);
  }, []);

  // Fetch tags and categories
  useEffect(() => {
    const fetchTags = async () => {
      try {
        const res = await axiosInstance.get(TAG_API);
        setTags(res.data);
      } catch (error) {
        toast.error("Failed to fetch tags.");
      }
    };
    const fetchCategories = async () => {
      try {
        const res = await axiosInstance.get(CATEGORY_API);
        setCategories(res.data.data || res.data || []);
      } catch (error) {
        toast.error("Failed to fetch categories.");
      }
    };
    fetchTags();
    fetchCategories();
  }, []);

  const handleTagChange = (e) => {
    const tagId = e.target.value;
    setSelectedTag(tagId);
    getAllData(3, 1, nameValue, tagId, selectedCate);
  };

  const handleCategoryChange = (e) => {
    const cateId = e.target.value;
    setSelectedCate(cateId);
    getAllData(3, 1, nameValue, selectedTag, cateId);
  };

  const getNameValue = (input) => {
    const name = input.target.value;
    setNameValue(name);
    getAllData(3, 1, name, selectedTag, selectedCate);
  };

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
      getAllData(3, 1, nameValue, selectedTag, selectedCate);
      setDeleteConfirmId(null);
    } catch (error) {
      toast.error(
        error?.response?.data?.message
          ? error.response.data.message
          : "Failed to delete recipe."
      );
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
        <button
          className="btn btn-success me-2"
          onClick={() => navigate("/dashboard/recipes-data")}
        >
          Add New Recipe
        </button>
      </div>

      {/* Filters */}
      <div className="search p-4 d-flex gap-3">
        <input
          type="search"
          className="form-control py-2 my-3"
          placeholder="Search by name ..."
          onChange={getNameValue}
        />
        <select
          className="form-select py-2 my-3"
          value={selectedTag}
          onChange={handleTagChange}
        >
          <option value="">All Tags</option>
          {tags.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        <select
          className="form-select py-2 my-3"
          value={selectedCate}
          onChange={handleCategoryChange}
        >
          <option value="">All Categories</option>
          {Array.isArray(categories) &&
            categories.map((cate) => (
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

        {isDataEmpty && <NoData />}

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
                        src={
                          item.imagePath
                            ? `${BASE_URL_IMG}/${item.imagePath}`
                            : logo
                        }
                        alt={item.name}
                        onError={(e) => (e.currentTarget.src = logo)}
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
                          <button
                            type="button"
                            className="action-menu-item hover-bg"
                            onClick={() =>
                              navigate(`/dashboard/view-recipes/${item.id}`)
                            }
                          >
                            <i className="fa-regular fa-eye me-2 text-success"></i>
                            View
                          </button>
                          <button
                            type="button"
                            className="action-menu-item hover-bg"
                            onClick={() =>
                              navigate(`/dashboard/recipes-data/${item.id}`)
                            }
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
                    onClick={() =>
                      getAllData(3, pageNum, nameValue, selectedTag, selectedCate)
                    }
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
                  <span
                    className="spinner-border spinner-border-sm me-2"
                    role="status"
                    aria-hidden="true"
                  ></span>
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
