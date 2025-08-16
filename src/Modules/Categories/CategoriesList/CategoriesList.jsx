// CategoriesList.js
import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

// API Constants
import {
  axiosInstance,
  CATEGORY_API,
  CATEGORY_BY_ID_API,
  PAGINATED_CATEGORIES_API,
} from "../../../constants/api";

// Components
import Header from "../../Shared/Components/Header/header";
import imgRecipesList from "/RecipesList.png";
import "./CategoriesList.css";
import NoData from "../../Shared/Components/NoData/noData";
import DeleteConfrimation from "../../Shared/Components/DeleteConfirmation/deleteConfrimation";

export default function CategoriesList() {
  // State management
  const [categoryList, setCategoryList] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [pageNumber, setPageNumber] = useState(1);
  const [deleting, setDeleting] = useState(false);
  const navigate = useNavigate();
  const menuRef = useRef(null);

  // Form handling
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm();

  // Data fetching
const getAllData = async (page = 1, size = 5) => {
  try {
    setLoading(true);
    const response = await axiosInstance.get(PAGINATED_CATEGORIES_API(page, size));
    
    setCategoryList(response.data.data || []);
    setTotalPages(response.data.totalNumberOfPages || 1);
  } catch (error) {
    console.error("Error fetching categories:", error);
    toast.error("Failed to load categories");
  } finally {
    setLoading(false);
  }
};

  useEffect(() => {
    getAllData(pageNumber, 5);
  }, [pageNumber]);

  // UI handlers
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Delete operations
  const openDeleteModal = (id) => {
    setDeleteConfirmId(id);
    setOpenMenuId(null);
  };

  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  const handleDelete = async () => {
    try {
      setDeleting(true);
      await axiosInstance.delete(CATEGORY_BY_ID_API(deleteConfirmId));
      toast.success(" Category deleted successfully!");
      getAllData(pageNumber);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error.response?.data?.message
          ? ` ${error.response.data.message}`
          : " Failed to delete category. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  // Form submission
  const onSubmit = async (data) => {
    try {
      if (isEdit && editCategoryId) {
        // Update existing category
        await axiosInstance.put(
          CATEGORY_BY_ID_API(editCategoryId),
          { name: data.categoryName.trim() },
          { headers: { Authorization: localStorage.getItem("userToken") } }
        );
        toast.success("Category updated successfully!");
      } else {
        // Create new category
        await axiosInstance.post(
          CATEGORY_API,
          { name: data.categoryName.trim() },
          { headers: { Authorization: localStorage.getItem("userToken") } }
        );
        toast.success("Category added successfully!");
      }
      setShowModal(false);
      reset();
      setIsEdit(false);
      setEditCategoryId(null);
      getAllData(pageNumber);
    } catch (error) {
      console.error("Save failed:", error);
      toast.error(error.response?.data?.message || "Failed to save category");
    }
  };

  // Modal handlers
  const openAddModal = () => {
    setIsEdit(false);
    setEditCategoryId(null);
    reset();
    setShowModal(true);
  };

  const openEditModal = (category) => {
    setIsEdit(true);
    setEditCategoryId(category.id);
    setValue("categoryName", category.name);
    setShowModal(true);
    setOpenMenuId(null);
  };

  // Render component
  return (
    <>
      <Header
        imgPath={imgRecipesList}
        title="Categories List"
        desc={
          <>
            <span>
              You can now add your items that any user can order from the
              Application and you can edit
            </span>
            <span> the Application and you can edit</span>
          </>
        }
      />

      {/* Title Section */}
      <div className="title d-flex justify-content-between p-2 align-items-center">
        <div className="description p-2">
          <h4 className="m-0 fs-5">Categories Table Details</h4>
          <p className="m-0">You can check all details</p>
        </div>
        <div>
          <button className="btn btn-success me-2" onClick={openAddModal}>
            Add New Category
          </button>
        </div>
      </div>

      {/* Data Table Section */}
      <div className="data p-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : categoryList.length > 0 ? (
          <>
            <table className="table table-striped text-center">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Name</th>
                  <th>Creation Date</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {categoryList.map((item) => (
                  <tr key={item.id}>
                    <td>{item.id}</td>
                    <td>{item.name}</td>
                    <td>{new Date(item.creationDate).toLocaleDateString()}</td>
                    <td className="action-cell">
                      <i
                        className="fa-solid fa-ellipsis-h action-icon"
                        onClick={() => toggleMenu(item.id)}
                      ></i>

                      {openMenuId === item.id && (
                        <div className="action-menu " ref={menuRef}>
                          <div
                            className="action-menu-item hover-bg"
                            onClick={() =>
                              navigate(
                                `/dashboard/view-itemcategory/${item.id}`
                              )
                            }
                          >
                            <i className="fa-regular fa-eye me-2 text-success"></i>
                            View
                          </div>
                          <div
                            className="action-menu-item hover-bg"
                            onClick={() => openEditModal(item)}
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

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="modal-backdrop">
          <div className="modal-content-custom p-4 text-center d-flex flex-column align-items-center position-relative">
            <i
              className="fa fa-close modal-close-icon"
              onClick={cancelDelete}
            ></i>
            <DeleteConfrimation deleteItem={"Category"} />
            <div className="modal-buttons border-top border-dark-subtle pt-4 w-100 d-flex justify-content-center">
              <button
                className="button-delete px-4"
                onClick={handleDelete}
                disabled={deleting}
              >
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete This Item"
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Add/Edit Category Modal */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-content-custom p-4 position-relative">
            <i
              className="fa fa-close modal-close-icon"
              onClick={() => {
                setShowModal(false);
                reset();
                setIsEdit(false);
                setEditCategoryId(null);
              }}
            ></i>
            <h5 className="mb-4">
              {isEdit ? "Edit Category" : "Add New Category"}
            </h5>
            <form onSubmit={handleSubmit(onSubmit)} className="py-5 ">
              <div className="mb-4">
                <input
                  type="text"
                  className={`form-control ${
                    errors.categoryName && "is-invalid "
                  }`}
                  placeholder=" Category Name"
                  {...register("categoryName", {
                    required: "Category name is required",
                    minLength: {
                      value: 3,
                      message: "Minimum 3 characters required",
                    },
                    maxLength: {
                      value: 50,
                      message: "Maximum 50 characters allowed",
                    },
                  })}
                />
                {errors.categoryName && (
                  <div className="invalid-feedback d-block text-start">
                    {errors.categoryName.message}
                  </div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-3">
                <button
                  type="button"
                  className="btn btn-outline-secondary"
                  onClick={() => {
                    setShowModal(false);
                    reset();
                    setIsEdit(false);
                    setEditCategoryId(null);
                  }}
                  disabled={isSubmitting}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn btn-success"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2"></span>
                      {isEdit ? "Saving..." : "Adding..."}
                    </>
                  ) : isEdit ? (
                    "Save Changes"
                  ) : (
                    "Add Category"
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
