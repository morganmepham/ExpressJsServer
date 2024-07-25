import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/home/Home";
// import Templates from './pages/Templates'
// import Workouts from './pages/Workouts'
// import Profile from './pages/Profile'
import Login from "./pages/login/LoginPage";
// import Register from "./pages/Register";
import NotFound from "./components/NotFound";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        {/* <Route path="/register" element={<Register />} /> */}
        <Route element={<ProtectedRoute />}>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />} />
            {/* <Route path="templates" element={<Templates />} />
            <Route path="workouts" element={<Workouts />} />
            <Route path="profile" element={<Profile />} /> */}
          </Route>
        </Route>
        {/* Catch-all route */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
}

export default App;
