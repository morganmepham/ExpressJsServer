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
        height: "20%",
      }}
    >
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
        required
        style={{
          width: "90%",
          border: "1px solid black",
          borderRadius: "0.5rem",
          height: "2rem",
        }}
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
        required
        style={{
          width: "90%",
          border: "1px solid black",
          borderRadius: "0.5rem",
          height: "2rem",
        }}
      />
      {error && <p>{error}</p>}
      <button
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
      </button>
    </form>
  );
};

export default LoginForm;
