import React from "react";
import grouped from "../data/grouped.json";
import Box from "@material-ui/core/Box";
import Grid from "@material-ui/core/Grid";
import Chip from "@material-ui/core/Chip";
import Container from "@material-ui/core/Container";
import TextField from "@material-ui/core/TextField";
import Autocomplete from "@material-ui/core/Autocomplete";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import CardActionArea from "@material-ui/core/CardActionArea";
import Typography from "@material-ui/core/Typography";
import CardMedia from "@material-ui/core/CardMedia";

export const getStaticProps = () => {
  const switches = Object.entries(grouped)
    .map(([key, value]) => {
      return { ...value[0], displayName: key };
    })
    .slice(0, 6);
  return {
    props: {
      switchNames: Object.keys(grouped),
      defaultSwitches: switches,
    },
  };
};

type GetStaticPropsReturn = ReturnType<typeof getStaticProps>;
type HomeProps = GetStaticPropsReturn["props"];

export default function Home({ switchNames, defaultSwitches }: HomeProps) {
  const [names, setNamesSet] = React.useState<string[]>([]);
  const [input, inputValueSet] = React.useState("");
  React.useEffect(() => {
    console.log(defaultSwitches);
  }, [defaultSwitches]);
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
              }}
              onInputChange={(_, newInputValue) => {
                inputValueSet(newInputValue);
              }}
              multiple
              id="tags-filled"
              options={switchNames}
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
            {defaultSwitches.map((e) => {
              return (
                <Grid key={e.UUID} item xs={12} sm={6} md={4}>
                  <Card>
                    <CardActionArea>
                      <CardMedia
                        style={{ height: "140px" }}
                        image={`/resources/${e.UUID}-0.jpg`}
                      />
                      <CardContent>
                        <Typography gutterBottom variant="h5" component="h2">
                          {e.displayName}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="textSecondary"
                          component="p"
                        >
                          Switchy Switchy
                        </Typography>
                      </CardContent>
                    </CardActionArea>
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
