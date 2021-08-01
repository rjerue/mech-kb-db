import Image from "next/image";
import Grid from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import CardContent from "@material-ui/core/CardContent";
import { MechSwitch } from "../types/switch";

export const SwitchCard: React.FC<MechSwitch> = ({
  displayName,
  type,
  operatingForce,
  activationPoint,
  travelDistance,
  uuid,
}) => {
  return (
    <Card>
      <CardContent>
        <Typography gutterBottom variant="h5" component="h2">
          {displayName}
        </Typography>
        <Grid container justifyContent="space-between">
          <Grid xs={9} item>
            <Grid container direction="row">
              <Grid xs={12} item>
                <Typography>Type: {type}</Typography>
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
    </Card>
  );
};
