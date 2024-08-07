import React, { useEffect, useState } from "react";
import useAxios from "../../hooks/useAxios";
import TemplateCard from "./components/TemplateCard";
import "./css/templates.css";
import AddIcon from "@mui/icons-material/Add";
import { useTheme } from "@emotion/react";
import TemplateModal from "./components/TemplateModal";
const Templates = () => {
  const { get } = useAxios();
  const theme = useTheme();

  const [templates, setTemplates] = useState([]);
  const getAllTemplates = async () => {
    try {
      const result = await get("/templates");
      setTemplates(result.data);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    getAllTemplates();
  }, []);
  return (
    <div
      style={{
        display: "flex",
        flexWrap: "wrap",
        height: "94%",
        width: "100%",
        justifyContent: "center",
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <h1 style={{ fontSize: "3rem" }}>Templates Page</h1>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
          height: "100%",
          width: "100%",
          padding: "2rem",
          paddingRight: "5rem",
          paddingLeft: "5rem",
        }}
      >
        <div className="card">
          <AddIcon fontSize="large" />
          <p style={{ width: "100%", textAlign: "center" }}>Create Template</p>
        </div>
        {templates?.map((template) => {
          return (
            <TemplateCard
              key={Math.floor(Math.random())}
              templateName={template?.name}
            />
          );
        })}
      </div>

      <TemplateModal />
    </div>
  );
};

export default Templates;
