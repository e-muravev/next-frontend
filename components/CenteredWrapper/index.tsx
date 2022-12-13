import React from "react";
import { Box } from "@mui/material";

const CenterWrapper: React.FC<any> = ({ children }) => {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignContent: "center",
        minHeight: "100vh",
      }}
    >
      {children}
    </Box>
  );
};

export default CenterWrapper;
