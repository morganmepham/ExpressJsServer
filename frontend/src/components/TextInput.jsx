import * as React from "react";
import { styled } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";

const BootstrapInput = styled(InputBase)(() => ({
  "& label.Mui-focused": {
    color: "#2d703f",
  },
  "& .MuiInput-underline:after": {
    borderBottomColor: "#2d703f",
  },
  "& .MuiOutlinedInput-root": {
    "& fieldset": {
      borderColor: "#2d703f",
    },
    "&:hover fieldset": {
      borderColor: "#2d703f",
    },
    "&.Mui-focused fieldset": {
      borderColor: "#2d703f",
    },
  },
}));

export default function TextInput() {
  return <BootstrapInput label="Custom CSS" />;
}
