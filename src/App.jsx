// App.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/js/bootstrap.bundle.min.js";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import React, { useEffect, useState } from "react";
import {
  createBrowserRouter,
  RouterProvider,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode";
import { ToastContainer } from "react-toastify";

// Layouts
import AuthLayout from "./Modules/Shared/Components/AuthLayout/AuthLayout";
import MasterLayout from "./Modules/Shared/Components/MasterLayout/MasterLayout";

// Auth Pages
import Login from "./Modules/Authentication/components/Login/Login";
import Register from "./Modules/Authentication/components/Register/Register";
import ForgetPassword from "./Modules/Authentication/components/Forget-password/ForgetPassword";
import ResetPassword from "./Modules/Authentication/components/ResetPassword/ResetPassword";
import ChangePassword from "./Modules/Authentication/components/Change-password/changePassword";
import VerifyAccount from "./Modules/Authentication/components/Verfy-account/verifyAccount";

// Other Pages
import CategoriesData from "./Modules/Categories/categoriesData/categoriesData";
import CategoriesList from "./Modules/Categories/CategoriesList/CategoriesList";
import FavouritesList from "./Modules/Favourites/components/FavouritesList/FavouritesList";
import Notfound from "./Modules/Shared/Components/Notfound/Notfound";
import Dashboard from "./Modules/Dashboard/Components/Dashboard/Dashboard";

import ProtectedRoute from "./Modules/Shared/Components/ProtectedRoute/ProtectedRoute";
import RecipesList from "./Modules/Recipes/components/RecipesList/RecipesList";
import UserList from "./Modules/Shared/Components/UserList/UserList";
import RecipesData from "./Modules/Recipes/components/RecipesData/RecipesData";
import ViewCategory from "./Modules/Categories/CategoryView/viewCategory";
import RecipesView from "./Modules/Recipes/components/RecipesView/RecipesView";
 import ViewUser from "./Modules/Authentication/components/viewUser/viewUser";

function App() {
  // User login data decoded from token or null
  const [loginData, setLoginData] = useState(() => {
    const token = localStorage.getItem("userToken");
    return token ? jwtDecode(token) : null;
  });

  // Flag to trigger redirect to login on logout
  const [redirectToLogin, setRedirectToLogin] = useState(false);

  // Used to refresh login data after login
  const getLoginData = () => {
    const token = localStorage.getItem("userToken");
    if (token) {
      const decodedToken = jwtDecode(token);
      setLoginData(decodedToken);
    }
  };

  useEffect(() => {
    if (localStorage.getItem("token")) getLoginData();
  }, []);

  // Define routes
  const router = createBrowserRouter([
    {
      path: "/",
      element: <AuthLayout />,
      children: [
        { index: true, element: <Login getLoginData={getLoginData} /> },
        { path: "login", element: <Login getLoginData={getLoginData} /> },
        { path: "register", element: <Register /> },
        { path: "forget-password", element: <ForgetPassword /> },
        { path: "reset-password", element: <ResetPassword /> },
        { path: "change-password", element: <ChangePassword /> },
        { path: "verify-account", element: <VerifyAccount /> },
      ],
    },
    {
      path: "/dashboard",
      element: (
        <ProtectedRoute loginData={loginData}>
          <MasterLayout loginData={loginData} />
        </ProtectedRoute>
      ),
      children: [
        { index: true, element: <Dashboard loginData={loginData} /> },
        { path: "dashboard", element: <Dashboard /> },
        { path: "categories-data", element: <CategoriesData /> },
        { path: "categories-list", element: <CategoriesList /> },
        { path: "fav-list", element: <FavouritesList /> },
        { path: "recipes-list", element: <RecipesList /> },
        { path: "recipes-data/:id", element: <RecipesData /> },
        { path: "recipes-data", element: <RecipesData /> },
        { path: "user-list", element: <UserList /> },
        { path: "view-itemcategory/:id", element: <ViewCategory /> },
        { path: "view-recipes/:id", element: <RecipesView /> },
           { path: "view-user/:id", element: <ViewUser /> },
      ],
    },
    {
      path: "*",
      element: <Notfound />,
    },
  ]);

  return (
    <>
      <RouterProvider router={router} />
      <ToastContainer position="top-right" autoClose={3000} />
    </>
  );
}

export default App;
