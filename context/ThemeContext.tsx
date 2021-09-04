import React from "react";
import type { PaletteMode } from "@mui/material";

export const ThemeContext = React.createContext({
  setThemeMode: (mode: PaletteMode) => {
    console.error("Theme not set!");
  },
});
