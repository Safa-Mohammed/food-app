// import axios from "axios";

// // Base API URL
// export const BASE_URL = "https://upskilling-egypt.com:3006/api/v1";

//  export const axiosInstance= axios.create({BASE_URL:BASE_URL})
// // =======================
// // AUTH APIs
// // =======================
// export const LOGIN_API = `${BASE_URL}/Users/Login`;
// export const RESET_REQUEST_API = `${BASE_URL}/Users/Reset/Request`;
// export const CHANGE_PASSWORD_API = `${BASE_URL}/Users/ChangePassword`;

// // =======================
// // CATEGORY APIs (ONLY DECLARE ONCE)
// // =======================
// export const CATEGORY_API = `${BASE_URL}/Category`;
// export const CATEGORY_BY_ID_API = (id) => `${CATEGORY_API}/${id}`;
// export const PAGINATED_CATEGORIES_API = (page, size) => 
//   `${CATEGORY_API}/?pageSize=${size}&pageNumber=${page}`;
// // =======================
// // TAG APIs
// // =======================
// export const TAG_API = `${BASE_URL}/Tag`;
// export const TAG_BY_ID_API = (id) => `${TAG_API}/${id}`;

// // =======================
// // RECIPE APIs
// // =======================
// export const RECIPE_API = `${BASE_URL}/Recipe`;
// export const RECIPE_BY_ID_API = (id) => `${RECIPE_API}/${id}`;

import axios from "axios";

// Base API URL
export const BASE_URL = "https://upskilling-egypt.com:3006/api/v1";
export const BASE_URL_IMG = "https://upskilling-egypt.com:3006/";

 

 
export const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

// Interceptor to set Authorization header dynamically
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("userToken");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export const axiosInstanceAuth = axios.create({
  baseURL: BASE_URL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});


// Public Axios instance (for login/register requests)
export const publicAxios = axios.create({
  baseURL: BASE_URL,
});

// =======================
// AUTH APIs
// =======================
export const LOGIN_API = "/Users/Login";
export const REGISTER_API = "/Users/Register";
export const RESET_REQUEST_API = "/Users/Reset/Request";
export const CHANGE_PASSWORD_API = "/Users/ChangePassword";
// API endpoint for verification
export const VERIFY_REGISTER_API = "/Users/verify";

// =======================
// CATEGORY APIs
// =======================
export const CATEGORY_API = "/Category";
export const CATEGORY_BY_ID_API = (id) => `${CATEGORY_API}/${id}`;
export const PAGINATED_CATEGORIES_API = CATEGORY_API;

// =======================
// TAG APIs
// =======================
export const TAG_API = "/Tag";
export const TAG_BY_ID_API = (id) => `${TAG_API}/${id}`;

// =======================
// RECIPE APIs
// =======================
export const RECIPE_API = "/Recipe";
export const RECIPE_BY_ID_API = (id) => `${RECIPE_API}/${id}`;

// =======================
// USERS APIs
// =======================
export const USER_URLS = {
  GET_ALL_USERS: "/Users",
  USER_BY_ID: (id) => `/Users/${id}`,
  DELETE_USER: (id) => `/Users/${id}`,
};

// =======================
// FAV APIs
// =======================
export const FAV_URLS = {
  GET_ALL: "/userRecipe",          // Get my favorite recipes
  ADD_FAVORITE: "/userRecipe",     // Add to favorites
  DELETE_FAVORITE: (id) => `/userRecipe/${id}`, // Remove from favorites
};
