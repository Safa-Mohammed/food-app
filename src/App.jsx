// App.jsx
import "bootstrap/dist/css/bootstrap.min.css";
import "@fortawesome/fontawesome-free/css/all.min.css";
import "react-toastify/dist/ReactToastify.css";
import "./App.css";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

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
import Notfound from "./Modules/Shared/Components/NotFound/NotFound";
import Dashboard from "./Modules/Dashboard/Components/Dashboard/Dashboard";

import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useState } from "react";
import { jwtDecode } from "jwt-decode";
import ProtectedRoute from "./Modules/Shared/Components/ProtectedRoute/ProtectedRoute";

const router = createBrowserRouter([
  <ToastContainer position="top-right" autoClose={3000} />,
  {
    path: "/",
    element: <AuthLayout />,
      children: [
      { index: true, element: <Login /> }, 
      { path: "login", element: <Login /> },
      { path: "register", element: <Register /> },
      { path: "forget-password", element: <ForgetPassword /> },
      { path: "reset-password", element: <ResetPassword /> },
      { path: "change-password", element: <ChangePassword /> },
      { path: "verify-account", element: <VerifyAccount /> },
    ],
  },
  {
    path: "/dashboard",
    element: <ProtectedRoute><MasterLayout /></ProtectedRoute>,
    children: [
      { index: true, element: <Dashboard /> },
       { path: "dashboard", element: <Dashboard /> },
      { path: "categories-data", element: <CategoriesData /> },
      { path: "categories-list", element: <CategoriesList /> },
      { path: "fav-list", element: <FavouritesList /> },
    ],
  },
  {
    path: "*", 
    element: <Notfound />,
  },
]);

function App() {
  return <RouterProvider router={router} />;
  
}

export default App;
