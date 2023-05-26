import React, { useEffect, useState } from "react";
import axios from "axios";
import { AccessTokenResponse } from "models/api/response.types";
import Home from "./Home";
import { portUrl } from "utils/baseUrl";
import UserBar from "./UserBar";
import { Box, Typography, useTheme } from "@mui/material";
import MainLoader from "./MainLoader";

const Popup = () => {
  const theme = useTheme();
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<AccessTokenResponse | undefined>(undefined);


  useEffect(() => {
    console.log("Popup rendered");
    chrome.storage?.local.get(["user"], ({ user }) => {
      if (user) {
        axios.defaults.headers.common.Authorization = `Bearer ${user?.access_token}`;
        setUser(user);
      }
      setLoading(false);
    });
  }, []);

  //set user undefined and remove token from local storage
  const cleanup = () => {
    setUser(undefined);
    chrome.storage?.local.remove(["user"]);
  }

  const logout = () => {
    cleanup();
    window.open(`${portUrl}/logout`, "_blank");
  };

  return (
    <>
      {loading ? (
        <MainLoader />
      ) : (
        <>
          <Box
            sx={{
              lineHeight: "36px",
              textAlign: "start",
              display: "flex",
              flexDirection: "row",
              borderBottom: `1px solid ${theme.grey.light}`,
            }}
          >
            <img
              src="/icon-banner.webp"
              height="28"
              alt="Petal"
              style={{ verticalAlign: "middle", padding: "8px 12px" }}
            />
            <UserBar user={user} logout={logout} />
          </Box>
          {user === undefined ? (
              <Box style={{ height: "300px", display: "flex" }}>
                <Typography color="textSecondary" sx={{ margin: "auto" }}>
                  To use the Petal Web Importer, please sign in.
                </Typography>
              </Box>
            ) : (
              <Home cleanup={cleanup}/>
          )}
        </>
      )}
    </>
  );
};

export default Popup;
