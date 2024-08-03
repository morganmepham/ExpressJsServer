import LoginForm from "./components/LoginForm";
import React from "react";
import RotatingIconsBackdrop from "./components/RotatingBackdrop";

const LoginPage = () => {
  return (
    <div className="h-full w-full bg-white flex justify-around  items-center">
      <div
        style={{
          width: "50%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <LoginForm />
        <RotatingIconsBackdrop open={true} />
      </div>
    </div>
    // <div>
    //   <div
    //     style={{
    //       width: "50%",
    //       height: "100%",
    //       display: "flex",
    //       alignItems: "center",
    //       justifyContent: "center",
    //     }}
    //   >
    //     <LoginForm />
    //   </div>
    //   <RotatingIconsBackdrop open={true} />
    // </div>
  );
};

export default LoginPage;
