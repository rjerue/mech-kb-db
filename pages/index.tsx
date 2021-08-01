import React, { useEffect } from "react";
import Image from "next/image";
import grouped from "../data/grouped.json";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/core/Autocomplete";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import { MechSwitch } from "../types/switch";
import Fuse from "fuse.js";

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

export default function Home({ switches }: HomeProps) {
  const [names, setNamesSet] = React.useState<string[]>([]);
  const [displayedSwitches, displayedSwitchesSet] = React.useState(switches);
  const [input, inputValueSet] = React.useState("");
  const fuseRef = React.useRef<ReturnType<typeof makeFuse>>();
  useEffect(() => {
    fuseRef.current = makeFuse(switches);
  }, [switches]);
  return (
    <Grid spacing={3} container>
      <Grid item xs={12}>
        <Container>
          <Box textAlign="center">
            <Typography variant="h1">Mech KB DB</Typography>
          </Box>
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Container>
          <Box>
            <Autocomplete
              value={names}
              inputValue={input}
              onChange={(_, newValue: string[] | null) => {
                setNamesSet(newValue || []);
                if (newValue && newValue?.length > 0) {
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
        </Container>
      </Grid>
      <Grid item xs={12}>
        <Container>
          <Grid spacing={4} container>
            {displayedSwitches.map((e) => {
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
        </Container>
      </Grid>
    </Grid>
  );
}
