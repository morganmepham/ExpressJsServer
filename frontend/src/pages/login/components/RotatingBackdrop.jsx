// ScrollingIconsBackdrop.js
import React from "react";
import Backdrop from "@mui/material/Backdrop";
import { styled } from "@mui/material/styles";
import {
  AccessAlarm,
  ThreeDRotation,
  Home,
  Settings,
  Favorite,
  Star,
  Cloud,
  Phone,
  Email,
  Person,
} from "@mui/icons-material";
import { useTheme } from "@emotion/react";

const IconContainer = styled("div")(() => ({
  position: "absolute",
  display: "flex",
  height: "100%",
  width: "150%", // Make the container wide enough for seamless scrolling
  animation: "scroll 15s linear infinite",
  "@keyframes scroll": {
    "0%": { transform: "translateX(80%)" },
    "100%": { transform: "translateX(-80%)" }, // Move the container by its full width
  },
}));

const IconWrapper = styled("div")(({ theme }) => ({
  margin: theme.spacing(0, 2),
  opacity: 0.7,
  transition: "opacity 0.3s",
  "&:hover": {
    opacity: 1,
  },
}));

const RotatingIconsBackdrop = (open) => {
  const icons = [
    AccessAlarm,
    ThreeDRotation,
    Home,
    Settings,
    Favorite,
    Star,
    Cloud,
    Phone,
    Email,
    Person,
  ];
  const theme = useTheme();

  return (
    <Backdrop
      sx={{
        color: "#fff",
        zIndex: 1,
        backgroundColor: theme.palette.background.backdrop,
        height: "100%",
      }}
      open={open}
    >
      <div
        style={{
          display: "flex",
          height: "100%",
          alignContent: "space-between",
          alignItems: "stretch",
          width: "100%",
          overflow: "hidden", // Ensure icons don't overflow the container
        }}
      >
        {[1, 2].map((rowIndex) => (
          <IconContainer
            key={rowIndex}
            sx={{
              top: `${rowIndex * 25 + 5}%`,
              animationDuration: `${21 * 5}s`,
              animationDirection: rowIndex % 2 === 0 ? "normal" : "reverse",
            }}
          >
            {icons.concat(icons).map((Icon, iconIndex) => (
              <IconWrapper key={iconIndex}>
                <Icon sx={{ fontSize: 100, color: "#2d703f" }} />
              </IconWrapper>
            ))}
          </IconContainer>
        ))}
      </div>
    </Backdrop>
  );
};

export default RotatingIconsBackdrop;
