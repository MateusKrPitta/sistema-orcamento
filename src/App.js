import React from "react";
import { ToastProvider } from "./components/toast";
import { createTheme, ThemeProvider } from "@mui/material";
import "./App.css";
import RoutesApp from "./routes/routes";

function App() {
  const theme = createTheme({
    palette: {
      primary: {
        main: "#a3cb39",
      },
      secondary: {
        main: "#5f7527",
      },
    },
    typography: {
      fontFamily: '"Montserrat", sans-serif',
      fontSize: 12,
    },
    components: {
      MuiTextField: {
        styleOverrides: {
          root: {
            "& .MuiInputBase-input": {
              fontSize: "12px",
            },
          },
        },
      },
    },
  });
  return (
    <>
      <ThemeProvider theme={theme}>
        <RoutesApp />
        <ToastProvider />
      </ThemeProvider>
    </>
  );
}

export default App;
