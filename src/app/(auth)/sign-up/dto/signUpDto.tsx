import * as Yup from "yup";

export const signUpDto = Yup.object({
  username: Yup.string()
    .required("Username is required")
    .min(4, "Username must be at least 4 characters")
    .max(20, "Username must not exceed 20 characters"),

  password: Yup.string()
          .min(6, 'Password must be at least 6 characters')
          .matches(/[A-Z]/, 'Password must contain at least one uppercase letter')
          .matches(/[0-9]/, 'Password must contain at least one number')
          .matches(/[!@#$%^&*(),.?":{}|<>]/, 'Password must contain at least one special character')
          .required('Required'),

  confirmPassword: Yup.string()
    .required("Confirm password is required")
    .oneOf([Yup.ref("password")], "Passwords must match"),

  designation: Yup.string()
    .required("Designation is required")
    .min(2, "Designation must be at least 2 characters")
    .max(50, "Designation must not exceed 50 characters"),

  firstName: Yup.string()
    .required("First name is required")
    .min(2, "First name must be at least 2 characters")
    .max(30, "First name must not exceed 30 characters"),

  lastName: Yup.string()
    .required("Last name is required")
    .min(2, "Last name must be at least 2 characters")
    .max(30, "Last name must not exceed 30 characters"),

  mobile: Yup.string()
    .required("Mobile number is required")
    .matches(/^[0-9]{10}$/, "Mobile number must be exactly 10 digits"),

  email: Yup.string()
    .required("Email is required")
    .email("Invalid email format")
    .min(6, "Email must be at least 6 characters")
    .max(50, "Email must not exceed 50 characters"),
});
