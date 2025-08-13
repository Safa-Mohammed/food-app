// Base API URL
export const BASE_URL = "https://upskilling-egypt.com:3006/api/v1";

// =======================
// AUTH APIs
// =======================
export const LOGIN_API = `${BASE_URL}/Users/Login`;
export const RESET_REQUEST_API = `${BASE_URL}/Users/Reset/Request`;
export const CHANGE_PASSWORD_API = `${BASE_URL}/Users/ChangePassword`;

// =======================
// CATEGORY APIs (ONLY DECLARE ONCE)
// =======================
export const CATEGORY_API = `${BASE_URL}/Category`;
export const CATEGORY_BY_ID_API = (id) => `${CATEGORY_API}/${id}`;
export const PAGINATED_CATEGORIES_API = (page, size) => 
  `${CATEGORY_API}/?pageSize=${size}&pageNumber=${page}`;
// =======================
// TAG APIs
// =======================
export const TAG_API = `${BASE_URL}/Tag`;
export const TAG_BY_ID_API = (id) => `${TAG_API}/${id}`;

// =======================
// RECIPE APIs
// =======================
export const RECIPE_API = `${BASE_URL}/Recipe`;
export const RECIPE_BY_ID_API = (id) => `${RECIPE_API}/${id}`;

 