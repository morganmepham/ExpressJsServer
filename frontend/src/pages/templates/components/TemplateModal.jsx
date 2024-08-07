import React, { useState } from "react";
import { CssBaseline, Modal, TextField } from "@mui/material";
import { useTheme } from "@emotion/react";
import ExerciseRow from "./ExerciseRow";

const TemplateModal = () => {
  const theme = useTheme();

  const [templateName, setTemplateName] = useState("");
  const [exercises, setExercises] = useState([]);

  const handleChange = (exercise) => {
    setExercises((prev) => {
      [...prev, exercise];
    });
  };

  return (
    <Modal
      open={true}
      onClose={() => {}}
      aria-labelledby="create-template-modal"
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          height: "100%",
        }}
      >
        <CssBaseline />
        <div
          style={{
            width: "50%",
            height: "90%",
            margin: "1rem",
            borderRadius: "0.8rem",
            boxShadow:
              "rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px",
            display: "flex",
            flexWrap: "wrap",
            justifyContent: "center",
            alignItems: "start",
            alignContent: "start",
            backgroundColor: theme.palette.secondary.background,
            overflowY: "scroll",
          }}
          className="custom-scrollbar"
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
              borderTopLeftRadius: "0.8rem",
              borderTopRightRadius: "0.8rem",
            }}
          ></div>
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              height: "4rem",
              width: "100%",
              padding: "2rem",
              marginTop: "1rem",
              flexWrap: "wrap",
            }}
          >
            <TextField
              required
              id="outlined-required"
              label="Template Name"
              fullWidth
              onChange={(e) => setTemplateName(e.target.value)}
              value={templateName}
              className="textField"
            />
            {/* Exercises */}
            <div style={{ width: "100%" }}>
              <ExerciseRow
                handleChange={() => {}}
                value="test"
                options={["test", "test2"]}
              />
            </div>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default TemplateModal;
