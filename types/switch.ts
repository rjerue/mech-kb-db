export type SwitchType = "Linear" | "Tactile" | "Clicky";

export interface MechSwitch {
  displayName: string;
  uuid: string;
  brand: string;
  switchName: string;
  img: string;
  type: SwitchType;
  operatingForce: number; // cN
  activationPoint: number; // mm
  travelDistance: number; // mm
  lifespan: number; // Million
}
