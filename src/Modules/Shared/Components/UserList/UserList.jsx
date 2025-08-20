import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { axiosInstance, BASE_URL_IMG, USER_URLS } from "../../../../constants/api";
import './UserList.css'
import Header from "../../../Shared/Components/Header/header";
import imgUsersList from "/RecipesList.png";
import NoData from "../../../Shared/Components/NoData/noData";
import DeleteConfrimation from "../../../Shared/Components/DeleteConfirmation/deleteConfrimation";
import logo from "/3.png";

export default function UsersList() {
  const [usersList, setUsersList] = useState([]);
  const [openMenuId, setOpenMenuId] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [deleting, setDeleting] = useState(false);
  const [numberOfPages, setNumberOfPages] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 4;

  const navigate = useNavigate();

  // Determine UI states
  const isDataEmpty = !loading && usersList.length === 0;
  const isDataLoaded = !loading && usersList.length > 0;

  const getVisiblePages = () => {
    const total = numberOfPages.length;
    const maxVisible = 5;
    let start = Math.max(currentPage - 2, 1);
    let end = Math.min(start + maxVisible - 1, total);

    if (end - start < maxVisible - 1) {
      start = Math.max(end - maxVisible + 1, 1);
    }

    return numberOfPages.slice(start - 1, end);
  };

  const getAllUsers = async (pageSize, pageNumber) => {
    try {
      setLoading(true);
      const response = await axiosInstance.get(USER_URLS.GET_ALL_USERS, {
        params: { pageSize, pageNumber },
      });
      setNumberOfPages(
        Array(response.data.totalNumberOfPages)
          .fill()
          .map((_, i) => i + 1)
      );
      setUsersList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching users:", error);
      toast.error(
        error?.response?.data?.message
          ? error.response.data.message
          : "Failed to load users"
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllUsers(pageSize, currentPage);
  }, [currentPage]);

  const toggleMenu = (id) => setOpenMenuId(openMenuId === id ? null : id);

  const openDeleteModal = (id) => {
    setDeleteConfirmId(id);
    setOpenMenuId(null);
  };

  const cancelDelete = () => setDeleteConfirmId(null);

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      setDeleting(true);
      await axiosInstance.delete(USER_URLS.DELETE_USER(deleteConfirmId));
      toast.success("User deleted successfully!");
      getAllUsers(pageSize, currentPage);
      setDeleteConfirmId(null);
    } catch (error) {
      console.error("Delete failed:", error);
      toast.error(
        error?.response?.data?.message
          ? error.response.data.message
          : "Failed to delete user. Please try again."
      );
    } finally {
      setDeleting(false);
    }
  };

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        !event.target.closest(".action-menu") &&
        !event.target.closest(".btn-icon")
      ) {
        setOpenMenuId(null);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <>
      <Header
        imgPath={imgUsersList}
        title="Users List"
        desc={
          <>
            <span>You can view all registered users in the system.</span>
            <span> Manage and monitor user details here.</span>
          </>
        }
      />

      <div className="title d-flex justify-content-between p-2 align-items-center">
        <div className="description p-2">
          <h4 className="m-0 fs-5">Users Table Details</h4>
          <p className="m-0">You can check all details</p>
        </div>
      </div>

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
          <table className="table table-striped text-center">
            <thead>
              <tr>
                <th>Name</th>
                <th>Image</th>
                <th>Email</th>
                <th>Country</th>
                <th>Phone</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {usersList.map((user) => (
                <tr key={user.id}>
                  <td>{user?.userName || "N/A"}</td>
                  <td>
                    <img
                      src={user?.imagePath ? `${BASE_URL_IMG}${user.imagePath}` : logo}
                      alt={user?.userName || "User"}
                      onError={(e) => (e.target.src = logo)}
                      className="w-25"
                    />
                  </td>
                  <td>{user?.email || "N/A"}</td>
                  <td>{user?.country || "N/A"}</td>
                  <td>{user?.phoneNumber || "N/A"}</td>
                  <td className="action-cell">
                    <button
                      type="button"
                      className="btn-icon"
                      onClick={() => toggleMenu(user.id)}
                      aria-label="Open actions menu"
                    >
                      <i className="fa-solid fa-ellipsis-h"></i>
                    </button>

                    {openMenuId === user.id && (
                      <div className="action-menu">
                        <button
                          type="button"
                          className="action-menu-item hover-bg"
                          onClick={() => navigate(`/dashboard/view-user/${user.id}`)}
                          aria-label={`View ${user.userName}`}
                        >
                          <i className="fa-regular fa-eye me-2 text-success"></i>
                          View
                        </button>

                        <button
                          type="button"
                          className="action-menu-item hover-bg"
                          onClick={() => openDeleteModal(user.id)}
                          aria-label={`Delete ${user.userName}`}
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
        )}
      </div>

      {/* Pagination */}
      <nav aria-label="Page navigation example">
        <ul className="pagination justify-content-center">
          <li className={`page-item ${currentPage === 1 ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => currentPage > 1 && setCurrentPage(currentPage - 1)}
            >
              &laquo;
            </button>
          </li>

          {getVisiblePages().map((pageNum) => (
            <li key={pageNum} className={`page-item ${currentPage === pageNum ? "active" : ""}`}>
              <button className="page-link" onClick={() => setCurrentPage(pageNum)}>
                {pageNum}
              </button>
            </li>
          ))}

          <li className={`page-item ${currentPage === numberOfPages.length ? "disabled" : ""}`}>
            <button
              className="page-link"
              onClick={() => currentPage < numberOfPages.length && setCurrentPage(currentPage + 1)}
            >
              &raquo;
            </button>
          </li>
        </ul>
      </nav>

      {/* Delete Confirmation Modal */}
      {deleteConfirmId !== null && (
        <div className="modal-backdrop">
          <div className="modal-content-custom p-4 text-center d-flex flex-column align-items-center position-relative">
            <i className="fa fa-close modal-close-icon" onClick={cancelDelete}></i>
            <DeleteConfrimation deleteItem={"User"} />
            <div className="modal-buttons border-top border-dark-subtle pt-4 w-100 d-flex justify-content-center">
              <button className="button-delete px-4" onClick={handleDelete} disabled={deleting}>
                {deleting ? (
                  <>
                    <span className="spinner-border spinner-border-sm me-2"></span>
                    Deleting...
                  </>
                ) : (
                  "Delete This User"
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
