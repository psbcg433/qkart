import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { Link } from "react-router-dom";
import {
  Avatar,
  Button,
  Stack,
  Typography
} from "@mui/material";
import Box from "@mui/material/Box";
import React, { useEffect, useState } from "react";
import "./Header.css";

const Header = ({ children, searchEvent, hasHiddenAuthButtons }) => {
  const [loggedIn, setLoggedIn] = useState(false);
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const storedUsername = localStorage.getItem("username");
    setLoggedIn(token !== null);
    setUsername(storedUsername || "");
  }, []);

  //logout an user
  const handleLogout = () => {
    localStorage.clear();
    window.location.reload();
  };

  return (
    <Box className="header">
  <Box className="header-title">
    <img src="logo_light.svg" alt="QKart-icon" />
  </Box>

  {children && (
    <Box>
      {children}
    </Box>
  )}

  {hasHiddenAuthButtons ? (
    <Link to="/">
      <Button className="explore-button" startIcon={<ArrowBackIcon />} variant="text">
        Back to explore
      </Button>
    </Link>
  ) : loggedIn ? (
    <Stack direction="row" spacing={2} alignItems="center">
      <Avatar src="avatar.png" alt={username} />
      <Typography variant="body1" style={{ marginLeft: "8px" }}>
        {username}
      </Typography>

      <Button variant="contained" onClick={handleLogout}>
        Logout
      </Button>
    </Stack>
  ) : (
    <Stack direction="row" spacing={2}>
      <Link to="/login">
        <Button variant="outlined">Login</Button>
      </Link>
      <Link to="/register">
        <Button variant="contained">Register</Button>
      </Link>
    </Stack>
  )}
</Box>

  );
};

export default Header;
