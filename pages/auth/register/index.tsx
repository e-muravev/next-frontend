import React from "react";
import { useRouter } from "next/router";
import Head from "next/head";
import { useFormik } from "formik";
import useSWRMutation from "swr/mutation";
import { toast } from "react-toastify";
import { TextField, Box, Button } from "@mui/material";
import CenteredWrapper from "../../../components/CenteredWrapper";
import { formStyle } from "./styles";
import { RegisterProps } from "./interfaces";
import { registerValidateScheme } from "./validationScheme";

async function sendRequest(url: string, { arg }: any) {
  return fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(arg),
  });
}

const Register: React.FC<RegisterProps> = () => {
  const router = useRouter();
  const { trigger, isMutating } = useSWRMutation(
    "http://localhost:8080/user/create/",
    sendRequest
  );
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      password: "",
      password_repeated: "",
    },
    validationSchema: registerValidateScheme,
    onSubmit: async (values) => {
      try {
        const response = await trigger({ ...values });

        if (response) {
          const json = await response.json();

          switch (response.status) {
            case 201:
              toast.warn("User successfully created");
              router.push(`/user/verification/${json.id}`);
            case 400:
              if (json.error === "email_exists") {
                toast.warn("Such email already exists");
              }
              if (json.error === "name_exists") {
                toast.warn("Such name already exists");
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
          <Button
            disabled={isMutating}
            size="large"
            type="submit"
            variant="contained"
          >
            Register
          </Button>
        </Box>
      </CenteredWrapper>
    </>
  );
};

export default Register;
