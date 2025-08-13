import axios from "axios";
import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FillRecipes from "../../../Shared/Components/FillRecipse/FillRecipes";

export default function RecipesData() {
  const [tagsList, setTagsList] = useState([]);
  const [cateList, setAllCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams(); // Get recipe ID from URL

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm();

  // Append form data
  const appendToFormData = (data) => {
    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("price", data.price);
    formData.append("description", data.description);
formData.append("categoriesIds", data.categoryId);
    formData.append("tagId", data.tagId);
    if (data.image && data.image[0]) {
      formData.append("recipeImage", data.image[0]);
    }
    return formData;
  };
  

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const recipeData = appendToFormData(data);

      if (isEdit) {
        // UPDATE
        await axios.put(
          `https://upskilling-egypt.com:3006/api/v1/Recipe/${id}`,
          recipeData,
          {
            headers: {
              Authorization: localStorage.getItem("userToken"),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Recipe updated successfully!");
      } else {
        // ADD
        await axios.post(
          "https://upskilling-egypt.com:3006/api/v1/Recipe/",
          recipeData,
          {
            headers: {
              Authorization: localStorage.getItem("userToken"),
              "Content-Type": "multipart/form-data",
            },
          }
        );
        toast.success("Recipe added successfully!");
      }

      navigate("/dashboard/recipes-list");
    } catch (error) {
      console.error("Error submitting recipe:", error);
      toast.error(error.response?.data?.message || "Failed to save recipe.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const getAllCategories = async () => {
    const response = await axios.get(
      "https://upskilling-egypt.com:3006/api/v1/category?pageSize=50&pageNumber=1",
      { headers: { Authorization: localStorage.getItem("userToken") } }
    );
    setAllCategories(response.data?.data || []);
  };

  // Fetch tags
  const getAllTags = async () => {
    const response = await axios.get(
      "https://upskilling-egypt.com:3006/api/v1/tag",
      { headers: { Authorization: localStorage.getItem("userToken") } }
    );
    setTagsList(response.data || []);
  };

  // Fetch recipe details for edit
  const getRecipeDetails = async () => {
    if (!id) return;
    try {
      const response = await axios.get(
        `https://upskilling-egypt.com:3006/api/v1/Recipe/${id}`,
        { headers: { Authorization: localStorage.getItem("userToken") } }
      );

      const recipe = response.data;
      reset({
        name: recipe.name,
        price: recipe.price,
        description: recipe.description,
        categoryId: recipe.category?.[0]?.id || "",
        tagId: recipe.tag?.id || "",
        image: [],
      });
      setIsEdit(true);
    } catch (error) {
      toast.error("Failed to fetch recipe details.");
    }
  };

  // Initial load
  const fetchData = async () => {
    setIsLoadingData(true);
    await Promise.all([getAllCategories(), getAllTags()]);
    if (id) await getRecipeDetails();
    setIsLoadingData(false);
  };

  useEffect(() => {
    fetchData();
    window.scrollTo(0, 0);
  }, [id]);

  if (isLoadingData) {
    return <div className="text-center py-5">Loading data...</div>;
  }

  return (
    
    <div>
      <FillRecipes/>
      <form
      className="w-75 p-5 m-auto text-white rounded"
      onSubmit={handleSubmit(onSubmit)}
    >
      <h4 className="mb-3">{isEdit ? "Edit Recipe" : "Add New Recipe"}</h4>

      {/* Recipe Name */}
      <input
        {...register("name", { required: "Recipe name is required" })}
        type="text"
        className="form-control my-2 bg-light"
        placeholder="Recipe Name"
      />
      {errors.name && (
        <span className="text-danger">{errors.name.message}</span>
      )}

      {/* Tag Select */}
      <div className="my-2">
        <label className="form-label">Tag</label>
        <select
          {...register("tagId", { required: "Please select a tag" })}
          className="form-control bg-light"
        >
          <option value="">Tag</option>
          {tagsList.map((tag) => (
            <option key={tag.id} value={tag.id}>
              {tag.name}
            </option>
          ))}
        </select>
        {errors.tagId && (
          <span className="text-danger">{errors.tagId.message}</span>
        )}
      </div>

      {/* Price */}
      <input
        {...register("price", { required: "Price is required" })}
        type="number"
        className="form-control my-2 bg-light"
        placeholder="Recipe Price"
      />
      {errors.price && (
        <span className="text-danger">{errors.price.message}</span>
      )}

      {/* Category Select */}
      <div className="my-2">
        <select
          {...register("categoryId", { required: "Category is required" })}
          className="form-control bg-light"
        >
          <option value="">Category</option>
          {cateList.map((cat) => (
            <option key={cat.id} value={cat.id}>
              {cat.name}
            </option>
          ))}
        </select>
        {errors.categoryId && (
          <span className="text-danger">{errors.categoryId.message}</span>
        )}
      </div>

      {/* Description */}
      <textarea
        {...register("description", { required: "Description is required" })}
        className="form-control my-2 bg-light"
        placeholder="Recipe Description"
      ></textarea>
      {errors.description && (
        <span className="text-danger">{errors.description.message}</span>
      )}

      {/* Image Upload */}
      <div className="my-2">
        <label className="form-label">Recipe Image</label>
        <input
          {...register("image")}
          type="file"
          className="form-control"
          accept="image/*"
        />
      </div>

      {/* Buttons */}
      <div className="d-flex justify-content-end p-2">
        <button
          type="button"
          className="btn border-success text-success"
          onClick={() => navigate("/dashboard/recipes-list")}
          disabled={loading}
        >
          Cancel
        </button>
        <button
          type="submit"
          className="btn btn-success mx-2 text-white"
          disabled={loading}
        >
          {loading ? "Saving..." : isEdit ? "Update" : "Save"}
        </button>
      </div>
    </form>
    </div>
  );
}
