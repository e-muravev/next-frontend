import * as Yup from "yup";

export const registerValidateScheme = Yup.object({
  name: Yup.string().required(),
  email: Yup.string()
    .email("Invalid email address")
    .max(15, "Must be 15 characters or less")
    .required("Required"),
  password: Yup.string()
    .min(8, "Password too short")
    .max(20, "Must be 20 characters or less")
    .required("Required"),
  password_repeated: Yup.string()
    .min(8, "Password too short")
    .max(20, "Must be 20 characters or less")
    .oneOf([Yup.ref("password"), null], "password must match")
    .required("Required"),
});
