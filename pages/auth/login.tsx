import React, { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Snackbar, Alert, TextField, Box, Button } from "@mui/material";
import CenteredWrapper from "../../components/CenteredWrapper";

interface LoginProps {
  login: string;
  password: string;
}

const formStyle = {
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignContent: "center",
  width: "500px",
  gap: 3,
};

const Login: React.FC<LoginProps> = () => {
  const [unauthtorizeError, setUnauthtorizeError] = useState(false);
  const formik = useFormik({
    initialValues: {
      login: "",
      password: "",
    },
    validationSchema: Yup.object({
      login: Yup.string()
        .email("Invalid email address")
        .max(15, "Must be 15 characters or less")
        .required("Required"),
      password: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    }),
    onSubmit: async ({ login, password }) => {
      setUnauthtorizeError(false);
      try {
        const response = await fetch("http://localhost:8080/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            login,
            password,
          }),
        });

        if (response.status === 401) {
          setUnauthtorizeError(true);
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <>
      <CenteredWrapper>
        <Box
          sx={formStyle}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            id="login"
            label="Login"
            variant="outlined"
            type="text"
            error={Boolean(formik.touched.login && formik.errors.login)}
            helperText={
              Boolean(formik.touched.login && formik.errors.login)
                ? formik.errors.login
                : null
            }
            {...formik.getFieldProps("login")}
          />
          <TextField
            id="password"
            label="Password"
            variant="outlined"
            type="password"
            error={Boolean(formik.touched.password && formik.errors.password)}
            helperText={
              Boolean(formik.touched.password && formik.errors.password)
                ? formik.errors.password
                : null
            }
            {...formik.getFieldProps("password")}
          />
          <Button size="large" type="submit" variant="contained">
            Login
          </Button>
        </Box>
      </CenteredWrapper>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={unauthtorizeError}
        onClose={() => setUnauthtorizeError(false)}
        autoHideDuration={6000}
      >
        <Alert
          severity="warning"
          sx={{ width: "100%" }}
          onClose={() => setUnauthtorizeError(false)}
        >
          User is not exist!
        </Alert>
      </Snackbar>
    </>
  );
};

export default Login;
