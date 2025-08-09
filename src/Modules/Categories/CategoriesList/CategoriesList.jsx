import { useEffect, useState, useRef } from "react";
import Header from "../../Shared/Components/Header/header";
import imgRecipesList from "/RecipesList.png";
import axios from "axios";
import "./CategoriesList.css"; // External CSS for styles
import NoData from "../../Shared/Components/NoData/noData";
import imgGril from "/Gril.png";

export default function CategoriesList() {
  const [categoryList, setCategoryList] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true); // Loading state
  const menuRef = useRef(null);

  const pageSize = 10;

  // Fetch categories with pagination
  const getAllDate = async (page = 1) => {
    try {
      setLoading(true); // Start loading before request
      const response = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/Category/?pageSize=${pageSize}&pageNumber=${page}`,
        { headers: { Authorization: localStorage.getItem("userToken") } }
      );
      setCategoryList(response.data.data);
      setTotalPages(response.data.totalNumberOfPages || 1);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false); // Stop loading after request
    }
  };

  // Load categories when page number changes
  useEffect(() => {
    getAllDate(pageNumber);
  }, [pageNumber]);

  // Toggle action menu
  const toggleMenu = (id) => {
    setOpenMenuId(openMenuId === id ? null : id);
  };

  // Close action menu if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  // Open delete confirmation modal
  const openDeleteModal = (id) => {
    setDeleteConfirmId(id);
    setOpenMenuId(null);
  };

  // Cancel delete modal
  const cancelDelete = () => {
    setDeleteConfirmId(null);
  };

  // Delete category and refresh current page
  const handleDelete = async () => {
    try {
      await axios.delete(
        `https://upskilling-egypt.com:3006/api/v1/Category/${deleteConfirmId}`,
        { headers: { Authorization: localStorage.getItem("userToken") } }
      );
      getAllDate(pageNumber);
      setDeleteConfirmId(null);
    } catch (error) {
      console.log("Delete failed:", error);
    }
  };

  // Pagination controls
  const goToPrevPage = () => {
    if (pageNumber > 1) setPageNumber(pageNumber - 1);
  };
  const goToNextPage = () => {
    if (pageNumber < totalPages) setPageNumber(pageNumber + 1);
  };
  const goToPage = (page) => {
    if (page >= 1 && page <= totalPages) setPageNumber(page);
  };

  // Render page numbers dynamically
  const renderPageNumbers = () => {
    let pages = [];
    for (let i = 1; i <= totalPages; i++) {
      pages.push(
        <button
          key={i}
          onClick={() => goToPage(i)}
          className={`btn btn-sm rounded-circle px-2 ${
            i === pageNumber ? "btn-success" : "btn-outline-success"
          }`}
          style={{ margin: "0 3px" }}
        >
          {i}
        </button>
      );
    }
    return pages;
  };

  return (
    <>
      <Header
        imgPath={imgRecipesList}
        title="Categories List"
        desc={
          <>
            <span>
              You can now add your items that any user can order it from the
              Application and you can edit
            </span>
            <br />
            <span>the Application and you can edit</span>
          </>
        }
      />

      {/* Title */}
      <div className="title d-flex justify-content-between p-2 align-items-center">
        <div className="description p-2">
          <h4 className="m-0 fs-5">Categories Table Details</h4>
          <p className="m-0">You can check all details</p>
        </div>
        <div>
          <button className="btn btn-success me-2">Add New Category</button>
        </div>
      </div>

      {/* Table / Loading / NoData */}
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
                    <td>{item.creationDate}</td>
                    <td className="action-cell">
                      <i
                        className="fa-solid fa-ellipsis-h action-icon"
                        onClick={() => toggleMenu(item.id)}
                        style={{ cursor: "pointer" }}
                      ></i>

                      {openMenuId === item.id && (
                        <div className="action-menu" ref={menuRef}>
                          <div className="action-menu-item hover-bg" style={{ cursor: "pointer" }}>
                            <i className="fa-regular fa-eye me-2 text-success"></i>
                            View
                          </div>
                          <div className="action-menu-item hover-bg" style={{ cursor: "pointer" }}>
                            <i className="fa-regular fa-pen-to-square me-2 text-primary"></i>
                            Edit
                          </div>
                          <div
                            className="action-menu-item hover-bg"
                            onClick={() => openDeleteModal(item.id)}
                            style={{ cursor: "pointer" }}
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

            {/* Pagination Controls */}
            <div className="pagination-controls d-flex justify-content-center align-items-center my-3">
              <button
                className="btn btn-success me-2"
                onClick={goToPrevPage}
                disabled={pageNumber === 1}
              >
                Previous
              </button>
              {renderPageNumbers()}
              <button
                className="btn btn-success ms-2"
                onClick={goToNextPage}
                disabled={pageNumber === totalPages}
              >
                Next
              </button>
            </div>
          </>
        ) : (
          <NoData /> // Only after loading is finished and data is empty
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="modal-backdrop">
          <div className="modal-content-custom p-4 text-center d-flex flex-column align-items-center position-relative">
            <i
              className="fa fa-close modal-close-icon"
              onClick={cancelDelete}
              style={{ cursor: "pointer" }}
            ></i>
            <img src={imgGril} className="w-50 mb-3" alt="Delete Illustration" />
            <h4 className="mb-3">Delete This Category?</h4>
            <p className="mb-4">
              Are you sure you want to delete this item? If you are sure just click
              on delete it.
            </p>
            <div className="modal-buttons border-top border-dark-subtle pt-4 w-100 d-flex justify-content-center">
              <div className="text-end w-100">
                <button className="button-delete px-4" onClick={handleDelete}>
                  Delete This Item
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
