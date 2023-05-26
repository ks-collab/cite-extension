import React from "react";
import { Box, styled } from "@mui/material";

const LoaderContainer = styled(Box)(() => ({
  width: "100%",
  height: "326px",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  "& .logo": {
    animationName: "rotation",
    animationDuration: "3s",
    animationTimingFunction: "linear",
    animationIterationCount: "infinite",
  },
  "@keyframes rotation": {
    from: {
      transform: "rotate(0deg)",
    },
    to: {
      transform: "rotate(359deg)",
    },
  },
}));

const MainLoader: React.FC = () => {
  return (
    <LoaderContainer>
      <img
        className="logo"
        width="110"
        alt="Petal"
        src="/petal-logo-small.png"
      />
    </LoaderContainer>
  );
};

export default MainLoader;