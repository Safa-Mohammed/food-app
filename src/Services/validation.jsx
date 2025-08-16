export const EMAIL_VALIDATION ={
                    required: "Email is required",
                    pattern: {
                      value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                      message: "Invalid email address",
                    },
                  }

export const PASSWORD_VALIDATION= {
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
                    }