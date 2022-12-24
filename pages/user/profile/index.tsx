import React from "react";
import { Box } from "@mui/system";
import CenterWrapper from "../../../components/CenteredWrapper";

// backend url - user/profile with Bearer

const Profile = () => {
  return (
    <CenterWrapper>
      <Box sx={{ height: 100 }}>
        <span>Profile Page</span>
      </Box>
    </CenterWrapper>
  );
};

export default Profile;
