import React from "react";
import Image from "next/image";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { MechSwitch } from "../types/switch";
import { capitalizeFirstLetter } from "../lib/string";
import CardActions from "@mui/material/CardActions";
import Button from "@mui/material/Button";
import Box from "@mui/system/Box";
import Modal from "@mui/material/Modal";
import { ForceCurveCard } from "./ForceCurve";

const modalStyle = {
  position: "absolute" as "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
};

export const SwitchCard: React.FC<MechSwitch> = (props) => {
  const {
    displayName,
    type,
    operatingForce,
    activationPoint,
    travelDistance,
    uuid,
    forceCurveUrl,
  } = props;
  const [isModalOpen, isModalOpenSet] = React.useState(false);
  return (
    <>
      <Modal open={isModalOpen} onClose={() => isModalOpenSet(false)}>
        <Box sx={modalStyle}>
          <ForceCurveCard {...props} />
        </Box>
      </Modal>
      <Card>
        <CardContent>
          <Typography gutterBottom variant="h5" component="h2">
            {displayName}
          </Typography>
          <Grid container justifyContent="space-between">
            <Grid xs={9} item>
              <Grid container direction="row">
                <Grid xs={12} item>
                  <Typography>Type: {capitalizeFirstLetter(type)}</Typography>
                </Grid>
                <Grid xs={12} item>
                  <Typography>Operating force: {operatingForce}cN</Typography>
                </Grid>
                <Grid xs={12} item>
                  <Typography>Activation point: {activationPoint}mm</Typography>
                </Grid>
                <Grid xs={12} item>
                  <Typography>Travel distance: {travelDistance}mm</Typography>
                </Grid>
              </Grid>
            </Grid>
            <Grid xs={3} item>
              <Image
                src={`/resources/${uuid}-0.jpg`}
                width="120"
                height="120"
                alt={displayName}
              />
            </Grid>
          </Grid>
        </CardContent>
        <CardActions>
          <Box
            visibility={forceCurveUrl ? "visible" : "hidden"}
            marginTop={"-10px"}
          >
            <Button
              size="small"
              color="primary"
              onClick={async () => {
                isModalOpenSet(true);
                const result = await fetch(`/api/force-curve/${uuid}`);
                if (!result.ok) {
                  console.error("Uh oh", result);
                }
                const json = await result.json();
                console.log(uuid, json);
              }}
            >
              Force Curve
            </Button>
          </Box>
        </CardActions>
      </Card>
    </>
  );
};
