import React, { useEffect } from "react";
import Image from "next/image";
import grouped from "../data/grouped.json";
import Box from "@material-ui/core/Box";
import Grid, { GridSize } from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/core/Autocomplete";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { MechSwitch } from "../types/switch";
import Fuse from "fuse.js";
import Slider from "@material-ui/core/Slider";
import { Mark, SliderPrps } from "@material-ui/core";

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
  return new Fuse(switches, { keys: ["displayName"] });
}

interface FilterSliderProps extends SliderPrps {
  marks: Mark[];
  label: string;
  id: string;
  sm: GridSize;
}

const FilterSlider: React.FC<FilterSliderProps> = ({
  label,
  marks,
  id,
  sm,
  ...props
}) => {
  const max = Math.max(...marks.map(({ value }) => value));
  return (
    <Grid item sm={sm} xs={12}>
      <Typography id={id} gutterBottom>
        {label}
      </Typography>
      <Slider
        aria-labelledby={id}
        marks={marks}
        defaultValue={max}
        min={Math.min(...marks.map(({ value }) => value))}
        max={max}
        valueLabelDisplay="auto"
        {...props}
      />
    </Grid>
  );
};

function makeMarks(numbers: number[], label: string): Mark[] {
  const asSet = new Set(numbers);
  const asSortedArray = Array.from(asSet).sort();
  return asSortedArray.map((value, i, a) => {
    return {
      value,
      label:
        value % 5 === 0 ? (
          <span className={i === 0 || i === a.length - 1 ? "" : "mark-middle"}>
            {value}
            {label}
          </span>
        ) : null,
    };
  });
}

export default function Home({ switches }: HomeProps) {
  const operatingForceSlider = makeMarks(
    switches.map(({ operatingForce }) => operatingForce),
    "cN"
  );

  Array.from(new Set(switches.map(({ operatingForce }) => operatingForce)))
    .sort()
    .map((e) => ({ value: e, label: `${e}cN` }));
  const activationPoint = Array.from(
    new Set(switches.map(({ activationPoint }) => activationPoint))
  )
    .sort()
    .map((e) => ({ value: e, label: `${e}mm` }));
  const travelDistance = Array.from(
    new Set(switches.map(({ travelDistance }) => travelDistance))
  )
    .sort()
    .map((e) => ({ value: e, label: `${e}mm` }));

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
                  const searchResult = fuseRef.current
                    ?.search({
                      $or: newValue.map((e) => ({ displayName: e })),
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
              options={Object.values(switches).map((e) => e.displayName)}
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
                  <Card>
                    <CardContent>
                      <Typography gutterBottom variant="h5" component="h2">
                        {e.displayName}
                      </Typography>
                      <Grid container justifyContent="space-between">
                        <Grid xs={9} item>
                          <Grid container direction="row">
                            <Grid xs={12} item>
                              <Typography>Type: {e.type}</Typography>
                            </Grid>
                            <Grid xs={12} item>
                              <Typography>
                                Operating force: {e.operatingForce}cN
                              </Typography>
                            </Grid>
                            <Grid xs={12} item>
                              <Typography>
                                Activation point: {e.activationPoint}mm
                              </Typography>
                            </Grid>
                            <Grid xs={12} item>
                              <Typography>
                                Travel distance: {e.travelDistance}mm
                              </Typography>
                            </Grid>
                          </Grid>
                        </Grid>
                        <Grid xs={3} item>
                          <Image
                            src={`/resources/${e.uuid}-0.jpg`}
                            width="120"
                            height="120"
                            alt={e.displayName}
                          />
                        </Grid>
                      </Grid>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>
        </Grid>
      </Grid>
    </Container>
  );
}
