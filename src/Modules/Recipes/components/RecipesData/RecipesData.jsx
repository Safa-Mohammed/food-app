import { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "react-toastify";
import FillRecipes from "../../../Shared/Components/FillRecipse/FillRecipes";
import { axiosInstance, RECIPE_API, CATEGORY_API, TAG_API } from "../../../../constants/api";
import { CATEGORY_VALIDATION, DESCRIBTION_VALIDATION, PRICE_VALIDATION, RECIPE_NAME_VALIDATION, TAG_VALIDATION } from "../../../../Services/validation";

export default function RecipesData() {
  const [tagsList, setTagsList] = useState([]);
  const [cateList, setCateList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [isLoadingData, setIsLoadingData] = useState(true);
  const [isEdit, setIsEdit] = useState(false);

  const navigate = useNavigate();
  const { id } = useParams();

  const { register, handleSubmit, reset, formState: { errors } } = useForm();

  // Prepare FormData
  const appendToFormData = (data) => {
    const formData = new FormData();
    formData.append("name", data.name || "");
    formData.append("price", data.price || "");
    formData.append("description", data.description || "");
    formData.append("categoriesIds", data.categoryId || "");
    formData.append("tagId", data.tagId || "");
    if (data.image && data.image[0]) formData.append("recipeImage", data.image[0]);
    return formData;
  };

  // Submit handler
  const onSubmit = async (data) => {
    setLoading(true);
    try {
      const recipeData = appendToFormData(data);
      if (isEdit) {
        await axiosInstance.put(`${RECIPE_API}/${id}`, recipeData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Recipe updated successfully!", { autoClose: 2000 });
      } else {
        await axiosInstance.post(RECIPE_API, recipeData, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        toast.success("Recipe added successfully!", { autoClose: 2000 });
      }
      navigate("/dashboard/recipes-list");
    } catch (error) {
      toast.error(error?.response?.data?.message || "Failed to save recipe.");
    } finally {
      setLoading(false);
    }
  };

  // Fetch categories
  const getAllCategories = async () => {
    try {
      const response = await axiosInstance.get(`${CATEGORY_API}?pageSize=50&pageNumber=1`);
      setCateList(response?.data?.data || []);
    } catch {
      toast.error("Failed to load categories.");
    }
  };

  // Fetch tags
  const getAllTags = async () => {
    try {
      const response = await axiosInstance.get(TAG_API);
      setTagsList(response?.data || []);
    } catch {
      toast.error("Failed to load tags.");
    }
  };

  // Fetch recipe for edit
  const getRecipeDetails = async () => {
    if (!id) return;
    try {
      const response = await axiosInstance.get(`${RECIPE_API}/${id}`);
      const recipe = response?.data;
      reset({
        name: recipe?.name || "",
        price: recipe?.price || "",
        description: recipe?.description || "",
        categoryId: recipe?.category?.[0]?.id || "",
        tagId: recipe?.tag?.id || "",
        image: [],
      });
      setIsEdit(true);
    } catch {
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

  // Button text logic
  let submitButtonText = "Save";
  if (loading) submitButtonText = "Saving...";
  else if (isEdit) submitButtonText = "Update";

  // Show loading data
  if (isLoadingData) return <div className="text-center py-5">Loading data...</div>;

  return (
    <div>
      <FillRecipes />
      <form className="w-75 p-5 m-auto text-white rounded" onSubmit={handleSubmit(onSubmit)}>
        <h4 className="mb-3">{isEdit ? "Edit Recipe" : "Add New Recipe"}</h4>

        {/* Recipe Name */}
        <input {...register("name", RECIPE_NAME_VALIDATION)} type="text" className="form-control my-2 bg-light" placeholder="Recipe Name" />
        {errors.name && <span className="text-danger">{errors.name.message}</span>}

        {/* Tag */}
        <div className="my-2">
          <label className="form-label">Tag</label>
          <select {...register("tagId", TAG_VALIDATION)} className="form-control bg-light">
            <option value="">Select Tag</option>
            {tagsList.map((tag) => <option key={tag.id} value={tag.id}>{tag.name}</option>)}
          </select>
          {errors.tagId && <span className="text-danger">{errors.tagId.message}</span>}
        </div>

        {/* Price */}
        <input {...register("price", PRICE_VALIDATION)} type="number" className="form-control my-2 bg-light" placeholder="Recipe Price" min="0" step="0.01" />
        {errors.price && <span className="text-danger">{errors.price.message}</span>}

        {/* Category */}
        <div className="my-2">
          <select {...register("categoryId", CATEGORY_VALIDATION)} className="form-control bg-light">
            <option value="">Select Category</option>
            {cateList.map((cat) => <option key={cat.id} value={cat.id}>{cat.name}</option>)}
          </select>
          {errors.categoryId && <span className="text-danger">{errors.categoryId.message}</span>}
        </div>

        {/* Description */}
        <textarea {...register("description", DESCRIBTION_VALIDATION)} className="form-control my-2 bg-light" placeholder="Recipe Description"></textarea>
        {errors.description && <span className="text-danger">{errors.description.message}</span>}

        {/* Image */}
        <div className="my-2">
          <label className="form-label">Recipe Image</label>
          <input {...register("image")} type="file" className="form-control" accept="image/*" />
        </div>

        {/* Buttons */}
        <div className="d-flex justify-content-end p-2">
          <button type="button" className="btn border-success text-success" onClick={() => navigate("/dashboard/recipes-list")} disabled={loading}>Cancel</button>
          <button type="submit" className="btn btn-success mx-2 text-white" disabled={loading}>{submitButtonText}</button>
        </div>
      </form>
    </div>
  );
}