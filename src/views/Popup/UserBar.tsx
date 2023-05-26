import React from "react";
import {
  Menu,
  MenuItem,
  styled,
  Typography,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import LogoutIcon from "@mui/icons-material/Logout";
import AccountCircle from "@mui/icons-material/AccountCircle";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import ExitToAppIcon from "@mui/icons-material/ExitToApp";
import { AccessTokenResponse } from "models/api/response.types";
import { portUrl } from "utils/baseUrl";

const Wrapper = styled("div")(
  ({ theme }) => `
    width: 100%;
    display: flex;
    padding: 0.5rem 0;
    flex-direction: row;
    margin-left: 0.25rem;
    .user-icon-button {
      margin-left: auto;
      margin-right: 1.25rem;
    }
  `
);
const UserBar = ({
  user,
  logout,
}: {
  user: AccessTokenResponse | undefined;
  logout: () => void;
}) => {
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const handleMenu = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleLogout = () => {
    setAnchorEl(null);
    logout();
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleGoToSynapse = () => {
    setAnchorEl(null);
    window.open(portUrl, "_blank");
  };

  const handleSignIn = () => {
    window.open("https://accounts.petal.org/login?service=cite", "_blank");
  };

  if (!user) {
    return (
      <Wrapper>
        <Button
          size="medium"
          aria-label="Account of current user"
          aria-controls="menu-appbar"
          aria-haspopup="true"
          onClick={handleSignIn}
          variant="text"
          color="primary"
          className="user-icon-button"
          startIcon={
            <AccountCircle fontSize="small" />
          }
        >
          Sign in
        </Button>
      </Wrapper>
    );
  }

  return (
    <Wrapper>
      <Button
        size="medium"
        aria-label="Account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        variant="text"
        color="primary"
        className="user-icon-button"
        startIcon={
          <AccountCircle fontSize="small" />
        }
        endIcon={
          <KeyboardArrowDownIcon fontSize="small" />
        }
      >
        Hello, {user.name}
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "bottom",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={Boolean(anchorEl)}
        onClose={handleClose}
      >
        <MenuItem onClick={handleLogout} dense>
          <ListItemIcon>
            <LogoutIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Logout</Typography>
          </ListItemText>
        </MenuItem>
        <MenuItem
          onClick={handleGoToSynapse}
          dense
        >
          <ListItemIcon>
            <ExitToAppIcon fontSize="small" />
          </ListItemIcon>
          <ListItemText>
            <Typography variant="body2">Go to Workspaces</Typography>
          </ListItemText>
        </MenuItem>
      </Menu>
    </Wrapper>
  );
};

export default UserBar;
