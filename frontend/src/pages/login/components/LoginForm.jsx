import React, { useState } from "react";
import useAxiosPost from "../../../hooks/useAxiosPost";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const post = useAxiosPost();
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");

    post("http://localhost:3000/login", { username, password }, (response) => {
      if (response.status === 200) {
        navigate("/", { replace: true }); // Navigate to home page
      } else {
        setError("Login failed. Please try again.");
      }
    });
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        display: "flex",
        flexWrap: "wrap",
        justifyContent: "center",
        alignItems: "space-around",
        height: "50%",
        position: "relative",
        zIndex: 2,
        backgroundColor: "white",
        padding: "2rem",
        width: "60%",
      }}
    >
      <Typography variant="h2" sx={{ fontWeight: 450, color: "#2d703f" }}>
        Gym App
      </Typography>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          justifyContent: "center",
          alignItems: "space-around",
          width: "100%",
        }}
      >
        <TextField
          id="outlined-required"
          label="Username"
          fullWidth
          onChange={(e) => setUsername(e.target.value)}
          value={username}
        />
        <TextField
          id="outlined-required"
          label="Password"
          type="password"
          fullWidth
          onChange={(e) => setPassword(e.target.value)}
          value={password}
        />
      </div>
      {error && <p>{error}</p>}
      {/* <button
        type="submit"
        className="bg-teal-600"
        style={{
          width: "20%",
          color: "white",
          borderRadius: "3rem",
          textAlign: "center",
          display: "flex",
          alignContent: "center",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        Login
      </button> */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        <Button variant="text" type="submit">
          Create Account
        </Button>
        <Button variant="contained" type="submit">
          Log in
        </Button>
      </div>
    </form>
  );
};

export default LoginForm;
