import { useEffect, useState } from "react";
import Header from "../../../Shared/Components/Header/header";
import imgRecipesList from "/RecipesList.png";
import { axiosInstance, FAV_URLS, BASE_URL_IMG } from "../../../../constants/api";
import { toast } from "react-toastify";
import NoData from "../../../Shared/Components/NoData/noData";
import logo from "/3.png";
import DeleteConfirmation from "../../../Shared/Components/DeleteConfirmation/deleteConfrimation";
import './FavouritesList.css'

export default function RecipesList() {
  const [favList, setFavList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8; // Number of cards per page

  const getAllFavs = async () => {
    try {
      const response = await axiosInstance.get(FAV_URLS.GET_ALL);
      setFavList(response.data.data || []);
    } catch (error) {
      console.error("Error fetching favorites:", error);
      toast.error("Failed to load favorites");
    }
  };

  const openDeleteModal = (fav) => {
    setSelectedFavorite(fav);
    setShowDeleteModal(true);
  };

  const closeDeleteModal = () => {
    setShowDeleteModal(false);
    setSelectedFavorite(null);
  };

  const deleteFavorite = async () => {
    if (!selectedFavorite) return;

    setLoading(true);
    try {
      await axiosInstance.delete(FAV_URLS.DELETE_FAVORITE(selectedFavorite.id));
      toast.success("Recipe removed from favorites successfully");
      setFavList(prevList => prevList.filter(fav => fav.id !== selectedFavorite.id));
      closeDeleteModal();
    } catch (error) {
      console.error("Error deleting favorite:", error);
      if (error.response?.data?.message) {
        toast.error(`Failed: ${error.response.data.message}`);
      } else {
        toast.error("Failed to remove recipe from favorites");
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    getAllFavs();
  }, []);

  // Calculate pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = favList.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(favList.length / itemsPerPage);

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  return (
    <>
      <Header
        imgPath={imgRecipesList}
        title={"Welcome Upskilling !"}
        desc={"This is a welcoming screen for the entry of the application , you can now see the options"}
      />

      <div className="container mt-4">
        <div className="row">
          {currentItems.length > 0 ? (
            currentItems.map((fav) => (
              <div key={fav.id} className="col-md-3 mb-4 ">
                <div className="card h-100 shadow-sm recipe-card">
                  <div className="recipe-card-container">
                    <button
                      onClick={() => openDeleteModal(fav)}
                      disabled={loading}
                      className="recipe-card-heart"
                    >
                      <i className="fas fa-heart"></i>
                    </button>

                    <img
                      src={fav.recipe.imagePath ? `${BASE_URL_IMG}${fav.recipe.imagePath}` : logo}
                      alt={fav.recipe.name}
                      onError={(e) => (e.currentTarget.src = logo)}
                      className="recipe-card-img"
                    />
                  </div>

                  <div className="card-body">
                    <h5 className="card-title">{fav.recipe.name}</h5>
                    <p className="card-text">{fav.recipe.description}</p>
                  </div>
                </div>
              </div>
            ))
          ) : (
            <NoData />
          )}
        </div>

        {/* Pagination Controls */}
        {favList.length > itemsPerPage && (
          <nav className="mt-4">
            <ul className="pagination justify-content-center">
              {Array.from({ length: totalPages }, (_, i) => (
                <li
                  key={i + 1}
                  className={`page-item ${currentPage === i + 1 ? "active" : ""}`}
                >
                  <button className="page-link" onClick={() => handlePageChange(i + 1)}>
                    {i + 1}
                  </button>
                </li>
              ))}
            </ul>
          </nav>
        )}
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteModal && (
        <div className="modal fade show d-block" tabIndex="-1" style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
          <div className="modal-dialog modal-dialog-centered">
            <div className="modal-content">
              <div className="modal-header border-0">
                <button
                  type="button"
                  className="btn-close"
                  onClick={closeDeleteModal}
                  disabled={loading}
                ></button>
              </div>
              <div className="modal-body">
                <DeleteConfirmation deleteItem="Favorite Recipe" />
              </div>
              <div className="modal-footer border-0 justify-content-center">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={closeDeleteModal}
                  disabled={loading}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-danger"
                  onClick={deleteFavorite}
                  disabled={loading}
                >
                  {loading ? (
                    <>
                      <span className="spinner-border spinner-border-sm me-2" />
                      Deleting...
                    </>
                  ) : (
                    "Delete"
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
