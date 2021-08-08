import React from "react";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Container from "@material-ui/core/Container";
import Typography from "@material-ui/core/Typography";
import FormLabel from "@material-ui/core/FormLabel";
import FormControl from "@material-ui/core/FormControl";
import FormGroup from "@material-ui/core/FormGroup";
import { GetSwitchesParams, MechSwitch, SwitchType } from "../types/switch";
import { makeMarks, FilterSlider } from "../components/FilterSlider";
import { SwitchCard } from "../components/SwitchCard";
import { getSwitches } from "../lib/switch";
import { DrawerComplete } from "../components/Drawer";
import { PositiveNumberInput } from "../components/PositiveNumberInput";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import { SearchBar } from "../components/SearchBar";
import { SwitchTypeCheckbox } from "../components/SwitchTypeCheckbox";
import { Layout } from "../components/Layout";

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

async function getSwitchesAPI(
  params: GetSwitchesParams
): Promise<MechSwitch[]> {
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

  const [names, setNamesSet] = React.useState<string[]>([]);
  const [switchTypeFilter, switchTypeFilterSet] = React.useState({
    clicky: true,
    linear: true,
    tactile: true,
  });
  const [displayedSwitches, displayedSwitchesSet] = React.useState(switches);
  const [forceFilter, forceFilterSet] = React.useState<number>(
    Number.MAX_SAFE_INTEGER
  );
  const [activationPointFilter, activationPointFilterSet] =
    React.useState<number>(Number.MAX_SAFE_INTEGER);
  const [travelDistanceFilter, travelDistanceFilterSet] =
    React.useState<number>(Number.MAX_SAFE_INTEGER);
  const isInitialMountDone = React.useRef(false);
  const matches = useMediaQuery("(min-width:769px)");
  React.useEffect(() => {
    if (isInitialMountDone.current) {
      // This does a debounce
      const timeout = setTimeout(
        () =>
          getSwitchesAPI({
            maxActivationPoint: activationPointFilter,
            maxTravelDistance: travelDistanceFilter,
            maxOperatingForce: forceFilter,
            searchParams: names,
            switchType: Object.entries(switchTypeFilter).reduce<SwitchType[]>(
              (list, [key, value]) =>
                value ? [...list, key as SwitchType] : list,
              []
            ),
          }).then((data) => {
            displayedSwitchesSet(data);
          }),
        200
      );
      return () => {
        clearTimeout(timeout);
      };
    } else {
      isInitialMountDone.current = true;
    }
  }, [
    activationPointFilter,
    travelDistanceFilter,
    forceFilter,
    names,
    switchTypeFilter,
  ]);
  return (
    <Layout>
      <Container>
        <Grid spacing={3} container>
          <Grid item xs={12}>
            <Box>
              <SearchBar switches={switches} setNamesSet={setNamesSet} />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid spacing={4} container>
              {displayedSwitches.map((e) => {
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
      <DrawerComplete>
        <FormGroup>
          <Grid container gap={matches ? 1 : 2}>
            <Grid item xs={12}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Search by name:</FormLabel>
                <SearchBar switches={switches} setNamesSet={setNamesSet} />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Switch type:</FormLabel>
                <SwitchTypeCheckbox
                  switchType="clicky"
                  handleChange={switchTypeFilterSet}
                />
                <SwitchTypeCheckbox
                  switchType="linear"
                  handleChange={switchTypeFilterSet}
                />
                <SwitchTypeCheckbox
                  switchType="tactile"
                  handleChange={switchTypeFilterSet}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FilterSlider
                className={"operating-force-slider"}
                id={"max-operating-force"}
                label="Max operating force"
                marks={operatingForceTicks}
                onChangeCommitted={(_, value) =>
                  forceFilterSet(value as number)
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Other characteristics:</FormLabel>
                <Grid container gap={1}>
                  <Grid item xs={12}>
                    <PositiveNumberInput
                      fullWidth
                      handleChange={activationPointFilterSet}
                      label="Max activation point"
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <PositiveNumberInput
                      fullWidth
                      handleChange={travelDistanceFilterSet}
                      label="Max travel distance"
                    />
                  </Grid>
                </Grid>
              </FormControl>
              <Typography variant="caption">
                {displayedSwitches.length} results found
              </Typography>
            </Grid>
          </Grid>
        </FormGroup>
      </DrawerComplete>
    </Layout>
  );
}
