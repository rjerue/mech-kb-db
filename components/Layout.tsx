import Container from "@mui/material/Container";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import NextLink from "next/link";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
import Brightness4Icon from "@mui/icons-material/Brightness4";
import Brightness7Icon from "@mui/icons-material/Brightness7";
import { useTheme } from "@mui/material/styles";
import React from "react";
import { ThemeContext } from "../context/ThemeContext";

export const Layout: React.FC = ({ children }) => {
  const theme = useTheme();
  const { setThemeMode } = React.useContext(ThemeContext);
  return (
    <Box position="relative" minHeight="100vh">
      <Box
        position="absolute"
        sx={{
          top: {
            xs: "10px",
            sm: "16px",
            md: "24px",
          },
          right: {
            xs: "8px",
            sm: "28px",
            md: "36px",
          },
        }}
      >
        <IconButton
          size="small"
          onClick={() =>
            setThemeMode(theme.palette.mode === "dark" ? "light" : "dark")
          }
          color="inherit"
        >
          {theme.palette.mode === "dark" ? (
            <Brightness7Icon />
          ) : (
            <Brightness4Icon />
          )}
        </IconButton>
      </Box>
      <Container>
        <Box
          sx={{
            textAlign: {
              xs: "left",
              sm: "center",
            },
          }}
        >
          <Typography
            sx={{
              fontSize: {
                xs: "3rem",
                sm: "5rem",
                md: "6rem",
              },
            }}
            color="primary"
            variant="h1"
          >
            Mech KB DB
          </Typography>
        </Box>
      </Container>
      <Box paddingBottom="36px">{children}</Box>
      <Box
        position="absolute"
        bottom="0"
        width="100%"
        display="flex"
        component="footer"
        height="36px"
      >
        <Grid
          direction="row"
          container
          justifyContent="center"
          alignItems="center"
          gap={5}
        >
          <Grid item>
            <NextLink href="/">
              <Link href="/">Home</Link>
            </NextLink>
          </Grid>
          <Grid item>
            <NextLink href="/about">
              <Link href="/about">About</Link>
            </NextLink>
          </Grid>
          <Grid item>
            <Link
              target="_blank"
              rel="noopener"
              href="https://github.com/rjerue/mech-kb-db"
            >
              Source
            </Link>
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
