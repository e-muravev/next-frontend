import React, { useState } from "react";
import { useFormik } from "formik";
import useSWRMutation from "swr/mutation";
import { toast } from "react-toastify";
import { useRouter } from "next/router";
import * as Yup from "yup";
import { TextField, Box, Button } from "@mui/material";
import CenteredWrapper from "../../../components/CenteredWrapper";

interface VerificationProps {
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

const Verification: React.FC<VerificationProps> = () => {
  const router = useRouter();
  const { id } = router.query;

  const { trigger, isMutating } = useSWRMutation(
    "http://localhost:8080/user/verify/",
    sendRequest
  );
  const formik = useFormik({
    initialValues: {
      verification_code: "",
    },
    validationSchema: Yup.object({
      verification_code: Yup.string().required("Required"),
    }),
    onSubmit: async (values) => {
      try {
        const response = await trigger({ ...values, user_id: Number(id) });
        if (response) {
          switch (response.status) {
            case 200:
              toast.success("Successfully verified");
              router.push("/auth/login/");
              break;
            case 400:
              toast.warn("Such code is not valid");
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
            id="verification_code"
            label="Code"
            variant="outlined"
            type="text"
            error={Boolean(
              formik.touched.verification_code &&
                formik.errors.verification_code
            )}
            helperText={
              Boolean(
                formik.touched.verification_code &&
                  formik.errors.verification_code
              )
                ? formik.errors.verification_code
                : null
            }
            {...formik.getFieldProps("verification_code")}
          />
          <Button
            disabled={isMutating}
            size="large"
            type="submit"
            variant="contained"
          >
            Verify
          </Button>
        </Box>
      </CenteredWrapper>
    </>
  );
};

export default Verification;
