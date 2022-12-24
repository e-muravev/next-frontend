import React, { useState } from "react";
import { useFormik } from "formik";
import useSWRMutation from "swr/mutation";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { TextField, Box, Button } from "@mui/material";
import CenteredWrapper from "../../../components/CenteredWrapper";

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

async function sendRequest(url: string, { arg }: any) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
}

const Login: React.FC<LoginProps> = () => {
  const router = useRouter();

  const { trigger, isMutating } = useSWRMutation(
    "http://localhost:8080/user/login/",
    sendRequest
  );
  const formik = useFormik({
    initialValues: {
      name: "",
      password: "",
    },
    validationSchema: Yup.object({
      name: Yup.string().required("Required"),
      password: Yup.string()
        .max(20, "Must be 20 characters or less")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await trigger({ ...values });
        if (response) {
          const json = await response.json();
          switch (response.status) {
            case 201:
              //token getting
              localStorage.setItem("token", json.token);
              router.push("/user/profile/");
            case 400:
              if (json.error === "user_login_failed") {
                toast.warn("Such user don't exists");
              }
              if (json.error === "user_is_not_verified") {
                toast.warn("Such user is not verified");
              }
          }
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
          <Button
            disabled={isMutating}
            size="large"
            type="submit"
            variant="contained"
          >
            Login
          </Button>
        </Box>
      </CenteredWrapper>
    </>
  );
};

export default Login;
