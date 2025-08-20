export const EMAIL_VALIDATION = {
  required: "Email is required",
  pattern: {
    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
    message: "Invalid email address",
  },
};

export const PASSWORD_VALIDATION = {
  required: "Current password is required",
  minLength: {
    value: 6,
    message: "Password must be at least 6 characters",
  },
  // pattern: {
  //   value: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[\W_]).{6,}$/,
  //   message:
  //     "Password must include uppercase, lowercase, number, and special character",
  // },
};
//RECIPE VALIDATION
export const PRICE_VALIDATION = {
  required: "Price is required",
  min: { value: 0, message: "Price cannot be negative" },
};

export const CATEGORY_VALIDATION =  {
                    required: "Category name is required",
                    minLength: { 
                      value: 3, 
                      message: "Minimum 3 characters required" 
                    },
                    maxLength: { 
                      value: 50, 
                      message: "Maximum 50 characters allowed" 
                    },
                    pattern: {
                      value: /^[a-zA-Z0-9\s\-_]+$/,
                      message: "Only letters, numbers, spaces, hyphens and underscores are allowed"
                    }
                  }

export const TAG_VALIDATION = {
  required: "Tag is required",
};
export const RECIPE_NAME_VALIDATION = {
  required: "name is required",
};

export const DESCRIBTION_VALIDATION = {
  required: "Description is required",
};