import React, { useState } from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Snackbar, Alert, TextField, Box, Button } from "@mui/material";
import CenteredWrapper from "../../components/CenteredWrapper";

interface RegisterProps {
  name: string;
  email: string;
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

const Register: React.FC<RegisterProps> = () => {
  const router = useRouter();
  const [alertTetxt, setAlertText] = useState("");
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_repeated: "",
    },
    validationSchema: Yup.object({
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
    }),
    onSubmit: async ({ name, email, password, password_repeated }) => {
      setAlertText("");
      try {
        const response = await fetch("http://localhost:8080/user/create/", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },

          body: JSON.stringify({
            name,
            email,
            password,
            password_repeated,
          }),
        });

        const json = await response.json();

        switch (response.status) {
          case 201:
            setAlertText("User successfully created");
            setTimeout(() => router.push("/auth/login"), 2000);
          case 400:
            if (json.error === "email_exists") {
              setAlertText("Such email already exists");
            }
            if (json.error === "name_exists") {
              setAlertText("Such name already exists");
            }
        }
      } catch (err) {
        console.log(err);
      }
    },
  });

  return (
    <>
      <Head>
        <title>Sign up | xz.com</title>
        <meta name="description" content="Сайт о cайте" />
        <meta name="viewport" content="initial-scale=1.0, width=device-width" />
      </Head>
      <CenteredWrapper>
        <Box
          sx={formStyle}
          component="form"
          noValidate
          autoComplete="off"
          onSubmit={formik.handleSubmit}
        >
          <TextField
            id="name"
            label="Name"
            variant="outlined"
            type="text"
            error={Boolean(formik.touched.name && formik.errors.name)}
            helperText={
              Boolean(formik.touched.name && formik.errors.name)
                ? formik.errors.name
                : null
            }
            {...formik.getFieldProps("name")}
          />
          <TextField
            id="email"
            label="Email"
            variant="outlined"
            type="text"
            error={Boolean(formik.touched.email && formik.errors.email)}
            helperText={
              Boolean(formik.touched.email && formik.errors.email)
                ? formik.errors.email
                : null
            }
            {...formik.getFieldProps("email")}
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
          <TextField
            id="password_repeated"
            label="Password"
            variant="outlined"
            type="password"
            error={Boolean(
              formik.touched.password_repeated &&
                formik.errors.password_repeated
            )}
            helperText={
              Boolean(
                formik.touched.password_repeated &&
                  formik.errors.password_repeated
              )
                ? formik.errors.password_repeated
                : null
            }
            {...formik.getFieldProps("password_repeated")}
          />
          <Button size="large" type="submit" variant="contained">
            Register
          </Button>
        </Box>
      </CenteredWrapper>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
        open={Boolean(alertTetxt)}
        onClose={() => setAlertText("")}
        autoHideDuration={6000}
      >
        <Alert
          severity="warning"
          sx={{ width: "100%" }}
          onClose={() => setAlertText("")}
        >
          {alertTetxt}
        </Alert>
      </Snackbar>
    </>
  );
};

export default Register;
