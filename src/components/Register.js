import { Button, CircularProgress, Stack, TextField } from "@mui/material";
import { Link, useNavigate } from "react-router-dom";
import { Box } from "@mui/system";
import axios from "axios";
import { useSnackbar } from "notistack";
import React, { useState } from "react";
import { config } from "../App";
import Footer from "./Footer";
import Header from "./Header";
import "./Register.css";

const Register = () => {
  const { enqueueSnackbar } = useSnackbar();
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate(); // ✅ replaced useHistory with useNavigate
  const [form, setForm] = useState({
    username: "",
    password: "",
    confirmPassword: "",
  });

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setForm((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const register = async () => {
    if (!validateInput(form)) return;

    setLoading(true);

    try {
      const url = config.endpoint + "/auth/register";
      const response = await axios.post(url, {
        username: form.username,
        password: form.password,
      });

      enqueueSnackbar("Registration successful", { variant: "success" });

      navigate("/login"); // ✅ replaced history.push
    } catch (error) {
      if (error.response) {
        console.error("Server Error:", error.response.data);
        enqueueSnackbar(
          error.response.data.message || "Registration failed",
          { variant: "error" }
        );
      } else if (error.request) {
        console.error("Network Error: No response from server");
        enqueueSnackbar("No response from server. Please try again later.", {
          variant: "error",
        });
      } else {
        console.error("Error:", error.message);
        enqueueSnackbar(error.message, { variant: "error" });
      }
    } finally {
      setLoading(false);
    }
  };

  const validateInput = (data) => {
    const { username, password, confirmPassword } = data;

    if (!username) {
      enqueueSnackbar("Username is a required field", { variant: "warning" });
      return false;
    }

    if (username.length < 6) {
      enqueueSnackbar("Username must be at least 6 characters long", {
        variant: "warning",
      });
      return false;
    }

    if (!password) {
      enqueueSnackbar("Password is a required field", { variant: "warning" });
      return false;
    }

    if (password.length < 6) {
      enqueueSnackbar("Password must be at least 6 characters long", {
        variant: "warning",
      });
      return false;
    }

    if (password !== confirmPassword) {
      enqueueSnackbar("Passwords do not match", { variant: "warning" });
      return false;
    }

    return true;
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
          <h2 className="title">Register</h2>
          <TextField
            id="username"
            label="Username"
            variant="outlined"
            title="Username"
            name="username"
            placeholder="Enter Username"
            fullWidth
            value={form.username}
            onChange={handleInputChange}
          />
          <TextField
            id="password"
            variant="outlined"
            label="Password"
            name="password"
            type="password"
            helperText="Password must be at least 6 characters long"
            fullWidth
            placeholder="Enter a password with minimum 6 characters"
            value={form.password}
            onChange={handleInputChange}
          />
          <TextField
            id="confirmPassword"
            variant="outlined"
            label="Confirm Password"
            name="confirmPassword"
            type="password"
            fullWidth
            value={form.confirmPassword}
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
            <Button className="button" variant="contained" onClick={register}>
              Register Now
            </Button>
          )}

          <p className="secondary-action">
            Already have an account?{" "}
            <Link to="/login" className="link">
              Login here
            </Link>
          </p>
        </Stack>
      </Box>
      <Footer />
    </Box>
  );
};

export default Register;
