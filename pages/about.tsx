import React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import { Layout } from "../components/Layout";
import Box from "@mui/material/Box";

export default function About() {
  return (
    <Layout>
      <Container>
        <Box padding="8px 0px">
          <Typography variant="h6" component="h2">
            About:
          </Typography>
          <Typography gutterBottom>
            Developed with ❤️ by{" "}
            <Link target="_blank" rel="noopener" href="https://jerue.org/">
              Ryan Jerue
            </Link>
            .
          </Typography>
          <Typography variant="h6" component="h2">
            Credits:
          </Typography>
          <Typography>
            Some data from Reddit user /u/nerdponx data shared on{" "}
            <Link
              target="_blank"
              rel="noopener"
              href="https://docs.google.com/spreadsheets/d/161QQynxAtsbUrHK81T7RnCztNaHFYbJXSrnz8kuApJo/edit?usp=sharing"
            >
              google sheets
            </Link>
            . Originally licensed{" "}
            <Link
              target="_blank"
              rel="noopener"
              href="https://creativecommons.org/licenses/by/4.0/"
            >
              CC BY 4.0.
            </Link>
          </Typography>
        </Box>
      </Container>
    </Layout>
  );
}
