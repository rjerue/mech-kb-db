import React from "react";
import Drawer from "@mui/material/Drawer";
import Grid from "@mui/material/Grid";
import Fab from "@mui/material/Fab";
import SearchIcon from "@mui/icons-material/Search";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import useMediaQuery from "@mui/material/useMediaQuery";
import Button from "@mui/material/Button";

export const DrawerComplete: React.FC<{ reset: () => void }> = ({
  children,
  reset,
}) => {
  const [isOpen, isOpenSet] = React.useState(false);
  const CloseButton = React.useCallback(
    () => <Button onClick={() => isOpenSet(false)}>Close</Button>,
    []
  );
  const matches = useMediaQuery("(min-width:769px)");
  return (
    <>
      {isOpen ? null : (
        <Box position="fixed" bottom="24px" right="24px">
          <Fab color="primary" aria-label="add" onClick={() => isOpenSet(true)}>
            <SearchIcon />
          </Fab>
        </Box>
      )}
      <Drawer
        anchor={matches ? "right" : "bottom"}
        open={isOpen}
        onClose={() => isOpenSet(false)}
      >
        <Box
          display="flex"
          width={matches ? "300px" : "unset"}
          height="100%"
          padding="8px 16px"
        >
          <Grid justifyContent="space-between" container>
            <Grid item xs={12}>
              <Grid container gap={1}>
                <Grid item xs={12}>
                  <Grid
                    container
                    justifyContent="space-between"
                    alignItems="center"
                  >
                    <Grid item>
                      <Typography color="primary" variant="h3" component="h2">
                        Filters
                      </Typography>
                    </Grid>
                    {
                      <Grid item>
                        <Grid justifyContent="space-between" container>
                          <Grid item>
                            <Button onClick={() => reset()}>Reset</Button>{" "}
                          </Grid>
                          {matches ? null : (
                            <Grid item>
                              <CloseButton />
                            </Grid>
                          )}
                        </Grid>
                      </Grid>
                    }
                  </Grid>
                </Grid>
                <Grid item xs={12}>
                  {children}
                </Grid>
              </Grid>
            </Grid>
            {matches ? (
              <Grid item xs={12} alignSelf="flex-end">
                <CloseButton />
              </Grid>
            ) : null}
          </Grid>
        </Box>
      </Drawer>
    </>
  );
};
