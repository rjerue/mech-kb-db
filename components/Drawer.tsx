import React from "react";
import Drawer from "@material-ui/core/Drawer";
import Grid from "@material-ui/core/Grid";
import Fab from "@material-ui/core/Fab";
import SearchIcon from "@material-ui/icons/Search";
import Box from "@material-ui/core/Box";
import Typography from "@material-ui/core/Typography";
import useMediaQuery from "@material-ui/core/useMediaQuery";
import Button from "@material-ui/core/Button";

export const DrawerComplete: React.FC = ({ children }) => {
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
                    {matches ? null : (
                      <Grid item>
                        <CloseButton />
                      </Grid>
                    )}
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
