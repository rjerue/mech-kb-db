import Container from "@material-ui/core/Container";
import Link from "@material-ui/core/Link";
import NextLink from "next/link";
import Typography from "@material-ui/core/Typography";
import Box from "@material-ui/system/Box";
import React from "react";

export const Layout: React.FC = ({ children }) => {
  return (
    <Box position="relative" minHeight="100vh">
      <Container>
        <Box textAlign="center">
          <Typography variant="h1">Mech KB DB</Typography>
        </Box>
      </Container>
      <Box paddingBottom="36px">{children}</Box>
      <Box
        position="absolute"
        bottom="0"
        width="100%"
        component="footer"
        display="flex"
        justifyContent="space-evenly"
        alignItems="center"
        height="36px"
      >
        <NextLink href="/">
          <Link>Home</Link>
        </NextLink>
        <NextLink href="/about">
          <Link>About</Link>
        </NextLink>
        <Link target="_blank" href="https://github.com/rjerue/mech-kb-db">
          Source
        </Link>
      </Box>
    </Box>
  );
};
