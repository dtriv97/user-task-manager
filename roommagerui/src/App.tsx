import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import Home from "./pages/Home";
import { Container, Card, Typography } from "@mui/material";
import { Provider } from "jotai";
import Navigation from "./components/Navigation";
import AddRoom from "./pages/AddRoom";
import Room from "./pages/Room";

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

function App() {
  return (
    <Provider>
      <ThemeProvider theme={theme}>
        <CssBaseline />
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
            </Routes>
          </Router>
        </Container>
      </ThemeProvider>
    </Provider>
  );
}

export default App;
