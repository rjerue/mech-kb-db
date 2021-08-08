import React from "react";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import Link from "@material-ui/core/Link";
import { Layout } from "../components/Layout";
import Box from "@material-ui/core/Box";

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
            <Link target="_blank" href="https://jerue.org/">
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
              href="https://docs.google.com/spreadsheets/d/161QQynxAtsbUrHK81T7RnCztNaHFYbJXSrnz8kuApJo/edit?usp=sharing"
            >
              google sheets
            </Link>
            . Originally licensed{" "}
            <Link
              target="_blank"
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
