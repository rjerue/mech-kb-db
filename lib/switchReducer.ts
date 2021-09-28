export const switchReducerInitialState = {
  names: [] as string[],
  switchTypeFilter: {
    clicky: true,
    linear: true,
    tactile: true,
  },
  forceFilter: Number.MAX_SAFE_INTEGER,
  activationPointFilter: Number.MAX_SAFE_INTEGER,
  travelDistanceFilter: Number.MAX_SAFE_INTEGER,
};

export type ReducerState = typeof switchReducerInitialState;
export type SwitchReducerAction =
  | {
      type: "setValue";
      key: keyof ReducerState;
      value: ReducerState[keyof ReducerState];
    }
  | { type: "reset" };

export const switchReducer = (
  state: ReducerState,
  action: SwitchReducerAction
) => {
  switch (action.type) {
    case "setValue": {
      const { key, value } = action
      return { ...state, [key]: value };
    }
    case "reset":
      return switchReducerInitialState;
    default:
      return state;
  }
};
