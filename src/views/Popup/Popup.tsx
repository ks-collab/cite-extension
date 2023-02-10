import React, { useEffect, useState } from "react";
import axios from "axios";
import { AccessTokenResponse } from "models/api/response.types";
import Home from "./Home";
import { portUrl } from "utils/baseUrl";
import UserBar from "./UserBar";
import { Typography } from "@mui/material";
import { grey } from "utils/color";

const Popup = () => {
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

  const logout = () => {
    window.open(`${portUrl}/logout`, "_blank");
  };

  return (
    <>
      <div
        style={{
          lineHeight: "36px",
          textAlign: "start",
          display: "flex",
          flexDirection: "row",
          // borderTop: `1px solid ${grey[300]}`,
          borderBottom: `1px solid ${grey[200]}`,
        }}
      >
        <img
          src="/icon-banner.webp"
          height="28"
          alt="Petal"
          style={{ verticalAlign: "middle", padding: "8px 12px" }}
        />
        {/* <span style={{
          fontSize: "1rem",
          position: "relative",
          top: "0.2rem",
          marginLeft: "1rem"
        }}>Petal</span> */}
        <UserBar user={user} logout={logout} />
      </div>
      {loading ? (
        <div> loading...</div>
      ) : user === undefined ? (
        <div style={{ height: "90px", display: "flex", color: `${grey[600]}` }}>
          <Typography sx={{ margin: "auto" }}>
            To use the Petal Cite Web Importer, please sign in.
          </Typography>
        </div>
      ) : (
        <div>
          <Home />
        </div>
      )}
    </>
  );
};

export default Popup;
