import LoginForm from "./components/LoginForm";
import React from "react";
import HomeIcon from "@mui/icons-material/Home";
import NoteAddIcon from "@mui/icons-material/NoteAdd";
import FitnessCenterIcon from "@mui/icons-material/FitnessCenter";
import SettingsIcon from "@mui/icons-material/Settings";
import LogoutIcon from "@mui/icons-material/Logout";
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
