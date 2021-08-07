// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from "next";
import Fuse from "fuse.js";
import { getSwitches } from "../../lib/switch";
import { MechSwitch, GetSwitchesParams } from "../../types/switch";

const switches = getSwitches();

const fuse = new Fuse(switches, { keys: ["displayName", "type"] });

function fuseSearch(searchParams: Required<GetSwitchesParams>["searchParams"]) {
  if (searchParams && searchParams.length > 0) {
    const expression = searchParams.flatMap(
      (e) => [{ displayName: e }, { type: e }] as Fuse.Expression[]
    );
    const searchResult = fuse
      ?.search({
        $or: expression,
      })
      ?.map((e) => e.item);
    return searchResult;
  }
  return switches;
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<MechSwitch[]>
) {
  const { filters } = req.query;
  const {
    maxActivationPoint = Number.MAX_SAFE_INTEGER,
    maxOperatingForce = Number.MAX_SAFE_INTEGER,
    maxTravelDistance = Number.MAX_SAFE_INTEGER,
    searchParams = [],
  } = JSON.parse(filters as string) as GetSwitchesParams;
  const fuseFiltered = fuseSearch(searchParams);
  const filteredSwitches = fuseFiltered.filter(
    ({ activationPoint, travelDistance, operatingForce }) => {
      return (
        activationPoint <= maxActivationPoint &&
        travelDistance <= maxTravelDistance &&
        operatingForce <= maxOperatingForce
      );
    }
  );
  res.status(200).json(filteredSwitches);
}
