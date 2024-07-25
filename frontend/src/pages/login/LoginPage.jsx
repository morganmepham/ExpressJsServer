import LoginForm from "./components/LoginForm";
import React from "react";
const LoginPage = () => {
  return (
    <div className="h-full w-full bg-white flex justify-around  items-center">
      <div className="w-8/12 flex h-full items-center justify-center bg-teal-600 rounded-br-full">
        <h1 className="text-5xl text-white font-medium">Gym App</h1>
      </div>
      <div className="w-3/5 flex justify-center">
        <LoginForm />
      </div>
    </div>
  );
};

export default LoginPage;
