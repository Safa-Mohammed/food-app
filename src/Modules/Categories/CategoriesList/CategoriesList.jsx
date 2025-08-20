import { useEffect, useState, useRef } from "react";
import { useForm } from "react-hook-form";
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
import { CATEGORY_VALIDATION } from "../../../Services/validation";

export default function CategoriesList() {
  const [categoryList, setCategoryList] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [isEdit, setIsEdit] = useState(false);
  const [editCategoryId, setEditCategoryId] = useState(null);
  const [deleting, setDeleting] = useState(false);
  const [nameValue, setNameValue] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [numberOfPages, setNumberOfPages] = useState([]);

  const navigate = useNavigate();
  const menuRef = useRef(null);

  const { register, handleSubmit, reset, setValue, formState: { errors, isSubmitting } } = useForm();

  // Fetch paginated categories
  const getAllData = async (pageSize, pageNum, name = "") => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(PAGINATED_CATEGORIES_API, {
        params: { pageSize, pageNumber: pageNum, name },
      });
      setCategoryList(response?.data?.data || []);
      setNumberOfPages(
        Array(response?.data?.totalNumberOfPages || 0)
          .fill()
          .map((_, i) => i + 1)
      );
      setCurrentPage(pageNum);
    } catch (error) {
      console.error("Error fetching categories:", error);
      toast.error("Failed to load categories");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllData(3, 1);
  }, []);

  // Toggle menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Handle click outside menu
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Delete category
  const openDeleteModal = (id) => {
    setDeleteConfirmId(id);
    setOpenMenuId(null);
  };
  const cancelDelete = () => setDeleteConfirmId(null);

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setDeleting(true);
      await axiosInstance.delete(CATEGORY_BY_ID_API(deleteConfirmId), {
        headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
      });
      toast.success("Category deleted successfully!");
      getAllData(3, currentPage, nameValue);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      const errorMessage =
        error?.response?.data?.message ||
        error?.response?.data?.error ||
        "Failed to delete category";
      toast.error(errorMessage);
    } finally {
      setDeleting(false);
    }
  };

  // Search
  const getNameValue = (input) => {
    const name = input?.target?.value || "";
    setNameValue(name);
    getAllData(3, 1, name);
  };

  // Add/Edit category
  const onSubmit = async (data) => {
    const payload = { name: data?.categoryName?.trim() || "" };
    try {
      if (isEdit && editCategoryId) {
        await axiosInstance.put(CATEGORY_BY_ID_API(editCategoryId), payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });
        toast.success("Category updated successfully!");
      } else {
        await axiosInstance.post(CATEGORY_API, payload, {
          headers: { Authorization: `Bearer ${localStorage.getItem("userToken")}` },
        });
        toast.success("Category added successfully!");
      }
      setShowModal(false);
      reset();
      setIsEdit(false);
      setEditCategoryId(null);
      getAllData(3, currentPage, nameValue);
    } catch (error) {
      console.error("Save failed:", error);
      let errorMessage = "Failed to save category"; // default
      if (error?.response?.data?.errors) {
        errorMessage = Object.values(error.response.data.errors).join(", ");
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error?.response?.data?.error) {
        errorMessage = error.response.data.error;
      }
      toast.error(errorMessage);
    }
  };

  // Open modals
  const openAddModal = () => {
    setIsEdit(false);
    setEditCategoryId(null);
    reset({ categoryName: "" });
    setShowModal(true);
  };
  const openEditModal = (category) => {
    setIsEdit(true);
    setEditCategoryId(category?.id || null);
    setValue("categoryName", category?.name || "");
    setShowModal(true);
    setOpenMenuId(null);
  };

  return (
    <>
      <Header
        imgPath={imgRecipesList}
        title="Categories List"
        desc={
          <span>You can now add your items that any user can order from the Application and edit them.</span>
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

      {/* Search Section */}
      <div className="search p-4">
        <input
          type="search"
          className="w-100 py-2 form-control my-3"
          placeholder="Search by name ..."
          value={nameValue}
          onChange={getNameValue}
        />
      </div>

      {/* Data Table Section using ternary */}
      <div className="data p-3">
        {loading ? (
          <div className="text-center py-5">
            <div className="spinner-border text-success" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        ) : categoryList?.length === 0 ? (
          <div className="text-center py-5">
            <NoData />
          </div>
        ) : (
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
                  <tr key={item?.id || Math.random()}>
                    <td>{item?.id || "-"}</td>
                    <td>{item?.name || "N/A"}</td>
                    <td>{item?.creationDate ? new Date(item.creationDate).toLocaleDateString() : "-"}</td>
                    <td className="action-cell">
                      <button
                        type="button"
                        className="btn-icon"
                        onClick={() => toggleMenu(item?.id)}
                        aria-label="Open actions menu"
                      >
                        <i className="fa-solid fa-ellipsis-h"></i>
                      </button>

                      {openMenuId === item?.id && (
                        <div className="action-menu" ref={menuRef}>
                          <button
                            type="button"
                            className="action-menu-item hover-bg"
                            onClick={() => navigate(`/dashboard/view-itemcategory/${item?.id}`)}
                            aria-label={`View ${item?.name || ""}`}
                          >
                            <i className="fa-regular fa-eye me-2 text-success"></i>View
                          </button>
                          <button
                            type="button"
                            className="action-menu-item hover-bg"
                            onClick={() => openEditModal(item)}
                            aria-label={`Edit ${item?.name || ""}`}
                          >
                            <i className="fa-regular fa-pen-to-square me-2 text-primary"></i>Edit
                          </button>
                          <button
                            type="button"
                            className="action-menu-item hover-bg"
                            onClick={() => openDeleteModal(item?.id)}
                            aria-label={`Delete ${item?.name || ""}`}
                          >
                            <i className="fa-regular fa-trash-can me-2 text-danger"></i>Delete
                          </button>
                        </div>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            {numberOfPages?.length > 1 && (
              <nav aria-label="Page navigation example">
                <ul className="pagination justify-content-center">
                  <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => getAllData(3, currentPage - 1, nameValue)}
                      disabled={currentPage === 1}
                    >
                      &laquo;
                    </button>
                  </li>

                  {numberOfPages.map((pageNum) => (
                    <li
                      key={pageNum}
                      className={`page-item ${currentPage === pageNum ? 'active' : ''}`}
                    >
                      <button
                        className="page-link"
                        onClick={() => getAllData(3, pageNum, nameValue)}
                      >
                        {pageNum}
                      </button>
                    </li>
                  ))}

                  <li className={`page-item ${currentPage === numberOfPages?.length ? 'disabled' : ''}`}>
                    <button
                      className="page-link"
                      onClick={() => getAllData(3, currentPage + 1, nameValue)}
                      disabled={currentPage === numberOfPages?.length}
                    >
                      &raquo;
                    </button>
                  </li>
                </ul>
              </nav>
            )}
          </>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="modal-backdrop">
          <div className="modal-content-custom p-4 text-center d-flex flex-column align-items-center position-relative">
            <i className="fa fa-close modal-close-icon" onClick={cancelDelete}></i>
            <DeleteConfrimation deleteItem={"Category"} />
            <div className="modal-buttons border-top border-dark-subtle pt-4 w-100 d-flex justify-content-center gap-3">
              <button className="btn btn-outline-secondary px-4" onClick={cancelDelete} disabled={deleting}>
                Cancel
              </button>
              <button className="btn btn-danger px-4" onClick={handleDelete} disabled={deleting}>
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete"
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
            <h5 className="mb-4 text-center">{isEdit ? "Edit Category" : "Add New Category"}</h5>
            <form onSubmit={handleSubmit(onSubmit)} className="py-3">
              <div className="mb-4">
                <label htmlFor="categoryName" className="form-label">Category Name</label>
                <input
                  id="categoryName"
                  type="text"
                  className={`form-control ${errors?.categoryName ? "is-invalid" : ""}`}
                  placeholder="Enter category name"
                  {...register("categoryName", CATEGORY_VALIDATION)}
                />
                {errors?.categoryName && (
                  <div className="invalid-feedback d-block text-start">{errors.categoryName.message}</div>
                )}
              </div>

              <div className="d-flex justify-content-end gap-3 mt-4">
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
                <button type="submit" className="btn btn-success" disabled={isSubmitting}>
                  {isSubmitting
                    ? (
                      <>
                        <span className="spinner-border spinner-border-sm me-2"></span>
                        {isEdit ? "Saving..." : "Adding..."}
                      </>
                    )
                    : isEdit ? "Save Changes" : "Add Category"
                  }
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
