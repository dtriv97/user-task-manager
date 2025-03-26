import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import { Container } from "@mui/material";
import Navigation from "./components/Navigation/Navigation";
import AddRoom from "./pages/AddRoom";
import Room from "./pages/Room";
import AddUser from "./pages/AddUser";
import User from "./pages/User";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { ToastContainer } from "react-toast";

// Create a client
const queryClient = new QueryClient();

const theme = createTheme({
  typography: {
    fontFamily: "Poppins, sans-serif",
    h1: {
      fontSize: "2.5rem",
      fontWeight: 600,
    },
    h2: {
      fontSize: "2rem",
      fontWeight: 500,
    },
    h3: {
      fontSize: "1.5rem",
      fontWeight: 400,
    },
    h4: {
      fontSize: "1.2rem",
      fontWeight: 400,
    },
    h5: {
      fontSize: "1rem",
      fontWeight: 400,
    },
    h6: {
      fontSize: "0.8rem",
      fontWeight: 400,
    },
  },
  palette: {
    primary: {
      main: "#1976d2",
    },
    secondary: {
      main: "#dc004e",
    },
    background: {
      default: "#f5f5f5",
    },
  },
});

function AppContent() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <ToastContainer
        position="top-center"
        delay={5000}
      />
      <Container>
        <Router>
          <Navigation />
          <Routes>
            <Route
              path="/"
              element={<Home />}
            />
            <Route
              path="/add-new-room"
              element={<AddRoom />}
            />
            <Route
              path="/room/:roomNumber"
              element={<Room />}
            />
            <Route
              path="/add-new-user"
              element={<AddUser />}
            />
            <Route
              path="/user/:userId"
              element={<User />}
            />
          </Routes>
        </Router>
      </Container>
    </ThemeProvider>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

export default App;
