import React, { useState } from "react";
import useAxiosPost from "../../../hooks/useAxiosPost";
import { useNavigate } from "react-router-dom";

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
        // Successful login
        localStorage.setItem("isAuthenticated", "true");
        navigate("/"); // Navigate to home page
      } else {
        setError("Login failed. Please try again.");
      }
    });
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
      />
      {error && <p>{error}</p>}
      <button type="submit">Login</button>
    </form>
  );
};

export default LoginForm;
