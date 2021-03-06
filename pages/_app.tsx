import React from "react";
import "../styles/globals.css";
import type { AppProps } from "next/app";
import Head from "next/head";
import { ThemeProvider } from "@mui/material/styles";
import CssBaseline from "@mui/material/CssBaseline";
import { CacheProvider } from "@emotion/react";
import createCache from "@emotion/cache";
import useMediaQuery from "@mui/material/useMediaQuery";
import { makeTheme } from "../lib/theme";
import { ThemeContext } from "../context/ThemeContext";

const cache = createCache({ key: "css", prepend: true });
cache.compat = true;

export default function MyApp({ Component, pageProps }: AppProps) {
  const prefersDarkMode = useMediaQuery("(prefers-color-scheme: dark)");
  const [theme, themeSet] = React.useState(makeTheme(prefersDarkMode));
  React.useEffect(() => {
    themeSet(makeTheme(localStorage.getItem("theme-mode") === "dark"));
  }, []);

  return (
    <CacheProvider value={cache}>
      <Head>
        <title>Mech KB DB</title>
        <meta
          name="viewport"
          content="minimum-scale=1, initial-scale=1, width=device-width"
        />
        <meta
          name="description"
          content="Mechanical keyboard switch database"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <ThemeContext.Provider
          value={{
            setThemeMode: (mode) => {
              localStorage.setItem("theme-mode", mode);
              themeSet(makeTheme(mode === "dark"));
            },
          }}
        >
          <Component {...pageProps} />
        </ThemeContext.Provider>
      </ThemeProvider>
    </CacheProvider>
  );
}
