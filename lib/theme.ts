import { createTheme } from "@mui/material/styles";

// Create a theme instance.
export const makeTheme = (isDark = false) =>
  createTheme({
    palette: {
      mode: isDark ? "dark" : "light",
    },
  });
