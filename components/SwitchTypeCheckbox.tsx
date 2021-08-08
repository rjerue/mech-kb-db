import Checkbox from "@material-ui/core/Checkbox";
import FormControlLabel, {
  FormControlLabelProps,
} from "@material-ui/core/FormControlLabel";
import React from "react";
import { capitalizeFirstLetter } from "../lib/string";
import { SwitchType } from "../types/switch";

interface SwitchTypeCheckboxProps
  extends Omit<FormControlLabelProps, "onChange" | "control" | "label"> {
  handleChange: React.Dispatch<
    React.SetStateAction<{
      clicky: boolean;
      linear: boolean;
      tactile: boolean;
    }>
  >;
  switchType: SwitchType;
}

export const SwitchTypeCheckbox: React.FC<SwitchTypeCheckboxProps> = ({
  switchType,
  handleChange,
  defaultChecked,
  ...props
}) => {
  return (
    <FormControlLabel
      onChange={(e: any) => {
        const checked = e.target.checked as boolean;
        handleChange((e) => ({ ...e, [switchType]: checked }));
      }}
      control={<Checkbox defaultChecked={defaultChecked} />}
      label={capitalizeFirstLetter(switchType)}
      {...props}
    />
  );
};
