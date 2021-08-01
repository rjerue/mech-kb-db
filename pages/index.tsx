import React, { useEffect } from "react";
import grouped from "../data/grouped.json";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/core/Autocomplete";
import Typography from "@material-ui/core/Typography";
import { MechSwitch } from "../types/switch";
import Fuse from "fuse.js";
import { makeMarks, FilterSlider } from "../components/FilterSlider";
import { SwitchCard } from "../components/SwitchCard";

export const getStaticProps = () => {
  const switches = Object.entries(grouped).map(([key, value]) => {
    return { ...value, displayName: key.replace(/\-|_/g, " ") } as MechSwitch;
  });
  return {
    props: {
      switches,
    },
  };
};

type GetStaticPropsReturn = ReturnType<typeof getStaticProps>;
type HomeProps = GetStaticPropsReturn["props"];

function makeFuse(switches: MechSwitch[]) {
  return new Fuse(switches, { keys: ["displayName", "type"] });
}

export default function Home({ switches }: HomeProps) {
  const operatingForceSlider = makeMarks(
    switches.map(({ operatingForce }) => operatingForce),
    "cN"
  );
  const activationPoint = makeMarks(
    switches.map(({ activationPoint }) => activationPoint),
    "mm"
  );
  const travelDistance = makeMarks(
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
  const fuseRef = React.useRef<ReturnType<typeof makeFuse>>();
  useEffect(() => {
    fuseRef.current = makeFuse(switches);
  }, [switches]);

  const filterDisplayedSwitches = displayedSwitches.filter(
    ({ activationPoint, travelDistance, operatingForce }) => {
      return (
        activationPoint <= activationPointFilter &&
        travelDistance <= travelDistanceFilter &&
        operatingForce <= forceFilter
      );
    }
  );
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
                if (newValue && newValue.length > 0) {
                  const expression = newValue.flatMap(
                    (e) =>
                      [{ displayName: e }, { type: e }] as Fuse.Expression[]
                  );
                  const searchResult = fuseRef.current
                    ?.search({
                      $or: expression,
                    })
                    ?.map((e) => e.item);
                  if (searchResult) {
                    displayedSwitchesSet(searchResult);
                  }
                } else {
                  displayedSwitchesSet(switches);
                }
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
                marks={operatingForceSlider}
                onChangeCommitted={(_, value) =>
                  forceFilterSet(value as number)
                }
              />
              <FilterSlider
                sm={5}
                id={"max-activation"}
                label="Max activation point"
                marks={activationPoint}
                onChangeCommitted={(_, value) =>
                  activationPointFilterSet(value as number)
                }
              />
              <FilterSlider
                sm={5}
                id={"max-travel"}
                label="Max travel distance"
                marks={travelDistance}
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
