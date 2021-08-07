import React, { useEffect } from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/core/Autocomplete";
import Typography from "@material-ui/core/Typography";
import { GetSwitchesParams } from "../types/switch";
import { makeMarks, FilterSlider } from "../components/FilterSlider";
import { SwitchCard } from "../components/SwitchCard";
import { getSwitches } from "../lib/switch";

export const getStaticProps = () => {
  const switches = getSwitches();
  return {
    props: {
      switches,
    },
  };
};

type GetStaticPropsReturn = ReturnType<typeof getStaticProps>;
type HomeProps = GetStaticPropsReturn["props"];

async function getSwitchesAPI(params: GetSwitchesParams) {
  const result = await fetch(
    "/api/switches?" + new URLSearchParams({ filters: JSON.stringify(params) })
  );
  if (!result.ok) {
    console.error("Uh oh", result);
    return [];
  }
  const data = await result.json();
  return data;
}

export default function Home({ switches }: HomeProps) {
  const operatingForceTicks = makeMarks(
    switches.map(({ operatingForce }) => operatingForce),
    "cN"
  );
  const activationPointTicks = makeMarks(
    switches.map(({ activationPoint }) => activationPoint),
    "mm"
  );
  const travelDistanceTicks = makeMarks(
    switches.map(({ travelDistance }) => travelDistance),
    "mm"
  );
  const switchTypes = Array.from(new Set(switches.map(({ type }) => type)));

  const [names, setNamesSet] = React.useState<string[]>([]);
  const [displayedSwitches, displayedSwitchesSet] = React.useState(switches);
  const [input, inputValueSet] = React.useState("");
  const [forceFilter, forceFilterSet] = React.useState<number>(
    Number.MAX_SAFE_INTEGER
  );
  const [activationPointFilter, activationPointFilterSet] =
    React.useState<number>(Number.MAX_SAFE_INTEGER);
  const [travelDistanceFilter, travelDistanceFilterSet] =
    React.useState<number>(Number.MAX_SAFE_INTEGER);
  const isInitialMountDone = React.useRef(false);
  React.useEffect(() => {
    if (isInitialMountDone.current) {
      getSwitchesAPI({
        maxActivationPoint: activationPointFilter,
        maxTravelDistance: travelDistanceFilter,
        maxOperatingForce: forceFilter,
        searchParams: names,
      }).then((data) => {
        displayedSwitchesSet(data);
      });
    } else {
      isInitialMountDone.current = true;
    }
  }, [activationPointFilter, travelDistanceFilter, forceFilter, names]);
  const filterDisplayedSwitches = displayedSwitches;
  return (
    <Container>
      <Grid spacing={3} container>
        <Grid item xs={12}>
          <Box textAlign="center">
            <Typography variant="h1">Mech KB DB</Typography>
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Box>
            <Autocomplete
              value={names}
              inputValue={input}
              onChange={(_, newValue: string[] | null) => {
                setNamesSet(newValue || []);
              }}
              onInputChange={(_, newInputValue) => {
                inputValueSet(newInputValue);
              }}
              multiple
              id="tags-filled"
              options={[
                ...switchTypes,
                ...Object.values(switches).map((e) => e.displayName),
              ]}
              freeSolo
              renderTags={(value: string[], getTagProps) =>
                value.map((option: string, index: number) => (
                  <Chip
                    {...getTagProps({ index })}
                    key={option}
                    variant="outlined"
                    label={option}
                  />
                ))
              }
              renderInput={(params) => (
                <TextField
                  {...params}
                  variant="filled"
                  label="Find switches!"
                />
              )}
            />
          </Box>
        </Grid>
        <Grid item xs={12}>
          <Container>
            <Grid container justifyContent="space-between">
              <Grid item xs={12}>
                <Typography variant="h6" component="h2" gutterBottom>
                  Filters
                </Typography>
              </Grid>
              <FilterSlider
                className={"operating-force-slider"}
                sm={12}
                id={"max-operating-force"}
                label="Max operating force"
                marks={operatingForceTicks}
                onChangeCommitted={(_, value) =>
                  forceFilterSet(value as number)
                }
              />
              <FilterSlider
                sm={5}
                id={"max-activation"}
                label="Max activation point"
                marks={activationPointTicks}
                onChangeCommitted={(_, value) =>
                  activationPointFilterSet(value as number)
                }
              />
              <FilterSlider
                sm={5}
                id={"max-travel"}
                label="Max travel distance"
                marks={travelDistanceTicks}
                onChangeCommitted={(_, value) =>
                  travelDistanceFilterSet(value as number)
                }
              />
            </Grid>
          </Container>
        </Grid>
        <Grid item xs={12}>
          <Grid spacing={4} container>
            {filterDisplayedSwitches.map((e) => {
              return (
                <Grid key={e.uuid} item xs={12} sm={6} md={4}>
                  <SwitchCard {...e} />
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
