import React from "react";
import { useNavigate } from "react-router-dom";

const NotFound = () => {
  const navigate = useNavigate();

  React.useEffect(() => {
    // Check if there's a previous page in the history
    if (window.history.state && window.history.state.idx > 0) {
      navigate(-1); // Go back to the previous page
    } else {
      navigate("/home", { replace: true }); // Go to the home page
    }
  }, [navigate]);

  return null;
};

export default NotFound;
