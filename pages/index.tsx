import React from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import FormGroup from "@mui/material/FormGroup";
import { GetSwitchesParams, MechSwitch, SwitchType } from "../types/switch";
import { makeMarks, FilterSlider } from "../components/FilterSlider";
import { SwitchCard } from "../components/SwitchCard";
import { getSwitches } from "../lib/switch";
import { DrawerComplete } from "../components/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { SearchBar } from "../components/SearchBar";
import { SwitchTypeCheckbox } from "../components/SwitchTypeCheckbox";
import { Layout } from "../components/Layout";
import { switchReducer, switchReducerInitialState } from "../lib/switchReducer";

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
  const activationPointTicks = makeMarks(
    switches.map(({ activationPoint }) => activationPoint),
    "mm"
  );
  const travelDistanceTicks = makeMarks(
    switches.map(({ travelDistance }) => travelDistance),
    "mm"
  );

  const [state, dispatch] = React.useReducer(
    switchReducer,
    switchReducerInitialState
  );
  const {
    names,
    forceFilter,
    activationPointFilter,
    travelDistanceFilter,
    switchTypeFilter,
  } = state;
  const [displayedSwitches, displayedSwitchesSet] = React.useState(switches);
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
        450
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
              <SearchBar
                value={names}
                switches={switches}
                setNamesSet={(value) =>
                  dispatch({ type: "setValue", key: "names", value })
                }
              />
            </Box>
          </Grid>
          <Grid item xs={12}>
            <Grid spacing={4} container>
              {displayedSwitches.length === 0 ? (
                <Grid item xs={12}>
                  <Typography component="p" variant="h6" textAlign="center">
                    No results found
                  </Typography>
                </Grid>
              ) : (
                displayedSwitches.map((e) => {
                  return (
                    <Grid key={e.uuid} item xs={12} sm={6} md={4}>
                      <SwitchCard {...e} />
                    </Grid>
                  );
                })
              )}
            </Grid>
          </Grid>
        </Grid>
      </Container>
      <DrawerComplete reset={() => dispatch({ type: "reset" })}>
        <FormGroup>
          <Grid container gap={matches ? 1 : 2}>
            <Grid item xs={12}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Search by name:</FormLabel>
                <SearchBar
                  value={names}
                  switches={switches}
                  setNamesSet={(value) =>
                    dispatch({ type: "setValue", key: "names", value })
                  }
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FormControl fullWidth component="fieldset">
                <FormLabel component="legend">Switch type:</FormLabel>
                <SwitchTypeCheckbox
                  switchType="clicky"
                  handleChange={(value) =>
                    dispatch({
                      type: "setValue",
                      key: "switchTypeFilter",
                      value: { ...switchTypeFilter, ["clicky"]: value },
                    })
                  }
                  checked={switchTypeFilter["clicky"]}
                />
                <SwitchTypeCheckbox
                  switchType="linear"
                  handleChange={(value) =>
                    dispatch({
                      type: "setValue",
                      key: "switchTypeFilter",
                      value: { ...switchTypeFilter, ["linear"]: value },
                    })
                  }
                  checked={switchTypeFilter["linear"]}
                />
                <SwitchTypeCheckbox
                  switchType="tactile"
                  handleChange={(value) =>
                    dispatch({
                      type: "setValue",
                      key: "switchTypeFilter",
                      value: { ...switchTypeFilter, ["tactile"]: value },
                    })
                  }
                  checked={switchTypeFilter["tactile"]}
                />
              </FormControl>
            </Grid>
            <Grid item xs={12}>
              <FilterSlider
                value={forceFilter}
                className={"operating-force-slider"}
                id={"max-operating-force"}
                label="Max operating force"
                marks={operatingForceTicks}
                onChangeCommitted={(_, value) =>
                  dispatch({
                    type: "setValue",
                    key: "forceFilter",
                    value: value as number,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FilterSlider
                value={activationPointFilter}
                className={"activation-point-slider"}
                id={"max-activation-point"}
                step={0.1}
                label="Max Activation Point"
                marks={activationPointTicks}
                onChangeCommitted={(_, value) =>
                  dispatch({
                    type: "setValue",
                    key: "activationPointFilter",
                    value: value as number,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
              <FilterSlider
                className={"travel-distance-slider"}
                step={0.1}
                value={travelDistanceFilter}
                id={"max-travel-distance"}
                label="Max travel-distance"
                marks={travelDistanceTicks}
                onChangeCommitted={(_, value) =>
                  dispatch({
                    type: "setValue",
                    key: "travelDistanceFilter",
                    value: value as number,
                  })
                }
              />
            </Grid>
            <Grid item xs={12}>
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
