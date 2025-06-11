import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Login.css";

const Login = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    username: "",
    password: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const login = async (formData) => {
    if (!validateInput(formData)) return;
    setLoading(true);
    try {
      const response = await axios.post(`${config.endpoint}/auth/login`, {
        username: form.username,
        password: form.password,
      });
      persistLogin(response.data.token, response.data.username, response.data.balance);
      enqueueSnackbar("Logged in successfully", { variant: "success" });
      navigate("/");
    } catch (error) {
      if (error.response) {
        enqueueSnackbar(error.response.data.message || "Login Failed", {
          variant: "error",
        });
      } else if (error.request) {
        enqueueSnackbar("No response from server, Please try again later", {
          variant: "error",
        });
      } else {
        enqueueSnackbar(error.message, { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (data) => {
    if (!data.username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }
    if (!data.password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }
    return true;
  };

  const persistLogin = (token, username, balance) => {
    localStorage.setItem("token", token);
    localStorage.setItem("username", username);
    localStorage.setItem("balance", balance);
  };

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="space-between"
      minHeight="100vh"
    >
      <Header hasHiddenAuthButtons />
      <Box className="content">
        <Stack spacing={2} className="form">
          <h2 className="title">Login</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            value={form.username}
            placeholder="Enter Username"
            fullWidth
            onChange={handleInputChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            value={form.password}
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            onChange={handleInputChange}
          />
          {loading ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              width="100%"
              height="100%"
            >
              <CircularProgress size={24} />
            </Box>
          ) : (
            <Button
              className="button"
              variant="contained"
              onClick={() => login(form)}
            >
              Login to QKart
            </Button>
          )}
          <p className="secondary-action">
            Don't have an account{" "}
            <Link to="/register" className="link">
              Register Now
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Login;
