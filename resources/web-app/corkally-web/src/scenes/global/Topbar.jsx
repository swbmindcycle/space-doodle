import { Box, IconButton, useTheme } from "@mui/material";
import { useContext } from "react";
import { ColorModeContext, tokens } from "../../theme";
import InputBase from "@mui/material/InputBase";
import LightModeOutlinedIcon from "@mui/icons-material/LightModeOutlined";
import DarkModeOutlinedIcon from "@mui/icons-material/DarkModeOutlined";
import NotificationsOutlinedIcon from "@mui/icons-material/NotificationsOutlined";
import SettingsOutlinedIcon from "@mui/icons-material/SettingsOutlined";
import PersonOutlinedIcon from "@mui/icons-material/PersonOutlined";
import SearchIcon from "@mui/icons-material/Search";
import LogoutOutlinedIcon from "@mui/icons-material/Logout";

import { Auth } from "aws-amplify";

const Topbar = () => {
  const theme = useTheme();
  const colors = tokens(theme.palette.mode);
  const colorMode = useContext(ColorModeContext);

  async function signOut() {
    try {
      console.log("Attempting signout");
      await Auth.signOut();
    } catch (error) {
      console.log("error signing out: ", error);
    }
  }

  return (
    <Box display="flex" justifyContent="space-between" p={2}>
      {/* LOGO */}
      <Box display="flex" justifyContent="center" alignItems="center">
        <img
          alt="corkally-logo"
          height="40px"
          src={`../../assets/logo.png`}
          style={{ cursor: "pointer" }}
        />
      </Box>
      <Box display="flex">
        {/* SEARCH BAR */}
        <Box
          display="flex"
          backgroundColor={colors.primary[400]}
          borderRadius="3px"
        >
          <InputBase sx={{ ml: 2, flex: 1 }} placeholder="Search" />
          <IconButton type="button" sx={{ p: 1 }}>
            <SearchIcon />
          </IconButton>
        </Box>

        {/* ICONS */}
        <Box display="flex">
          <IconButton onClick={colorMode.toggleColorMode}>
            {theme.palette.mode === "dark" ? (
              <DarkModeOutlinedIcon />
            ) : (
              <LightModeOutlinedIcon />
            )}
          </IconButton>
          <IconButton>
            <NotificationsOutlinedIcon />
          </IconButton>
          <IconButton>
            <SettingsOutlinedIcon />
          </IconButton>
          <IconButton>
            <PersonOutlinedIcon />
          </IconButton>
          <IconButton onClick={signOut}>
            <LogoutOutlinedIcon />
          </IconButton>
        </Box>
      </Box>
    </Box>
  );
};

export default Topbar;
