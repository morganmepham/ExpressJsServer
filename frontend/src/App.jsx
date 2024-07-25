import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home/Home";
// import Templates from "./pages/Templates";
// import Workouts from "./pages/Workouts";
// import Profile from "./pages/Profile";
import LoginPage from "./pages/login/LoginPage";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            {/* <Route path="templates" element={<Templates />} />*/}
          </Route>
        </Route>
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
