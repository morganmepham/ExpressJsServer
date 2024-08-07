import React from "react";
import { useTheme } from "@emotion/react";

const TemplateCard = ({ templateName }) => {
  const theme = useTheme();

  return (
    <div
      style={{
        width: "15rem",
        height: "16rem",
        margin: "1rem",
        borderRadius: "0.8rem",
        boxShadow:
          "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
        display: "flex",
        justifyContent: "center",
        alignItems: "end",
        backgroundColor: theme.palette.secondary.background,
      }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "4rem",
          backgroundColor: theme.palette.primary.main,
          color: theme.palette.primary.contrastText,
          width: "100%",
          borderBottomLeftRadius: "0.8rem",
          borderBottomRightRadius: "0.8rem",
        }}
      >
        <p>{templateName}</p>
      </div>
    </div>
  );
};

export default TemplateCard;
