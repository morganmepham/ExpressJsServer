import React, { useState } from "react";
import useAxios from "../../../hooks/useAxios";
import { useNavigate } from "react-router-dom";
import { Button, TextField, Typography } from "@mui/material";

import { useTheme } from "@emotion/react";

const LoginForm = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const { post } = useAxios();
  const navigate = useNavigate();
  const theme = useTheme();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const result = await post("/login", { username, password });
      if (result.status === 200) {
        navigate("/home");
      }
    } catch (err) {
      console.error(err);
    }
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
        backgroundColor: theme.palette.background.paper,
        padding: "2rem",
        width: "60%",
        borderRadius: "3%",
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
          className="textField"
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
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          width: "100%",
        }}
      >
        {/* <SecondaryButton label="Create Account" />
        <PrimaryButton label="Log In" onClick={handleSubmit} /> */}
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
