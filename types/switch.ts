export type SwitchType = "linear" | "tactile" | "clicky";

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
  forceCurveUrl?: string;
}

export interface GetSwitchesParams {
  maxActivationPoint?: number;
  maxTravelDistance?: number;
  maxOperatingForce?: number;
  searchParams?: string[];
  switchType?: SwitchType[];
}
