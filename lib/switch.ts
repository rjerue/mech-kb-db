import { MechSwitch } from "../types/switch";
import grouped from "../data/switches/grouped.json";

export function getSwitches() {
  const switches = Object.entries(grouped).map(([key, value]) => {
    return { ...value, displayName: key.replace(/\-|_/g, " ") } as MechSwitch;
  });
  return switches;
}
