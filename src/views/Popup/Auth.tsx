import React from "react";
import { portUrl } from "utils/baseUrl";
import styled from "@emotion/styled";
import Button from "@mui/material/Button";

const PREFIX = "Auth";
const classes = {
  root: `${PREFIX}-root`,
  submit: `${PREFIX}-submit`,
  form: `${PREFIX}-form`,
};
const Root = styled("div")(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
  },
  [`& .${classes.form}`]: {
    width: "100%",
    "& input": {
      background: "#fff",
    },
  },
  [`& .${classes.submit}`]: {
    margin: "0.5rem 0",
  },
}));

const Auth = () => {
  const handleSynapseSignIn = () => {
    window.open(portUrl, "_blank");
  };
  return (
    <Root className={classes.root}>
      <Button
        type="button"
        fullWidth
        variant="contained"
        size="medium"
        color="primary"
        className={classes.submit}
        onClick={handleSynapseSignIn}
      >
        Sign in
      </Button>
    </Root>
  );
};

export default Auth;
