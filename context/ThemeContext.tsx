import React from "react";
import type { PaletteMode } from "@material-ui/core";

export const ThemeContext = React.createContext({
  setThemeMode: (mode: PaletteMode) => {
    console.error("Theme not set!");
  },
});
