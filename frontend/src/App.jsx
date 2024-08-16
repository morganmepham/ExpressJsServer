import React, { useMemo, useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import ProtectedRoute from './components/ProtectedRoute';
import Home from './pages/home/Home';
import Templates from './pages/templates/Templates';
import Workouts from './pages/workouts/Workouts';
// import Profile from "./pages/Profile";
import LoginPage from './pages/login/LoginPage';
import NotFound from './components/NotFound';

import { createTheme, ThemeProvider } from '@mui/material/styles';
import { CssBaseline } from '@mui/material';
import { ConfigProvider } from 'antd';

function App() {
  const [mode] = useState('dark');

  //   palette: {
  //     mode,
  //     ...(mode === "light"
  //       ? {
  //           primary: {
  //             main: "#2d703f", // Your main green color
  //             light: "#4CAF50", // A lighter shade of green
  //             dark: "#1B5E20", // A darker shade of green
  //             contrastText: "#ffffff", // Text color that contrasts with green
  //           },
  //           secondary: {
  //             main: "#4CAF50", // You can set this to another shade of green or a complementary color
  //           },
  //         }
  //       : {
  //           primary: {
  //             main: "#2d703f", // Your main green color
  //             light: "#4CAF50", // A lighter shade of green
  //             dark: "#1B5E20", // A darker shade of green
  //             contrastText: "#ffffff", // Text color that contrasts with green
  //           },
  //           secondary: {
  //             main: "#4CAF50", // You can set this to another shade of green or a complementary color
  //           },
  //         }),
  //   },
  // });
  const theme = useMemo(
    () =>
      createTheme({
        palette: {
          mode,
          ...(mode === 'light'
            ? {
                primary: {
                  main: '#2d703f',
                  light: '#4CAF50',
                  dark: '#1B5E20',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#4CAF50',
                  background: '#fff',
                },
                background: {
                  backdrop: '#bdc2bc',
                  paper: '#f0f2f0',
                },
              }
            : {
                primary: {
                  main: '#2d703f',
                  light: '#4CAF50',
                  dark: '#1B5E20',
                  contrastText: '#ffffff',
                },
                secondary: {
                  main: '#4CAF50',
                  background: '#1b1c1b',
                },
                background: {
                  backdrop: '#20261f',
                },
              }),
        },
      }),
    [mode]
  );

  const antTheme = useMemo(
    () => ({
      algorithm: mode === 'light' ? theme.defaultAlgorithm : theme.darkAlgorithm,
      token: {
        colorPrimary: '#2d703f',
        colorSuccess: '#4CAF50',
        colorText: mode === 'light' ? '#000000' : '#ffffff',
        colorTextSecondary: mode === 'light' ? '#000000' : '#ffffff',
        colorBgContainer: mode === 'light' ? '#f0f2f0' : '#20261f',
        colorBgElevated: mode === 'light' ? '#bdc2bc' : '#20261f',
        colorBorder: mode === 'light' ? '#d9d9d9' : '#434343',
        colorBgBase: mode === 'light' ? '#ffffff' : '#1b1c1b',
      },
      components: {
        Input: {
          colorTextPlaceholder: mode === 'light' ? 'rgba(0, 0, 0, 0.25)' : 'rgba(255, 255, 255, 0.25)',
        },
      },
    }),
    [mode]
  );
  return (
    <ConfigProvider theme={antTheme}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Router>
          <Routes>
            <Route path="/login" element={<LoginPage />} />
            <Route element={<ProtectedRoute />}>
              <Route element={<Layout />}>
                <Route path="/home" element={<Home />} />
                <Route path="templates" element={<Templates />} />
                <Route path="workouts" element={<Workouts />} />
              </Route>
            </Route>
            {/* Catch-all route */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </Router>
      </ThemeProvider>
    </ConfigProvider>
  );
}

export default App;
