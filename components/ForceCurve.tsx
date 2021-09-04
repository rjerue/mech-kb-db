import React from "react";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { MechSwitch } from "../types/switch";
import dynamic from "next/dynamic";
import Grid from "@mui/material/Grid";
import CircularProgress from "@mui/material/CircularProgress";
import Box from "@mui/material/Box";

const Loading = () => (
  <Box padding={"32px"}>
    <CircularProgress />
  </Box>
);

const Plot = dynamic(() => import("react-plotly.js"), {
  loading: Loading,
  ssr: false,
});

export const ForceCurveCard: React.FC<MechSwitch> = ({ uuid }) => {
  const [state, stateSet] = React.useState<any>({});
  const [error, errorSet] = React.useState("");
  React.useEffect(() => {
    const getData = async () => {
      const result = await fetch(`/api/force-curve/${uuid}`);
      if (!result.ok) {
        console.error("Uh oh", result);
        errorSet("Error Creating graph, please try again!");
      }
      const json = await result.json();
      stateSet(json);
    };
    getData();
  }, []);
  return (
    <Grid container justifyContent="center">
      <Grid item>
        {state ? (
          <Plot data={state.data} layout={state.layout} />
        ) : error ? (
          error
        ) : (
          <Loading />
        )}
      </Grid>
    </Grid>
  );
};
