import Checkbox from "@mui/material/Checkbox";
import FormControlLabel, {
  FormControlLabelProps,
} from "@mui/material/FormControlLabel";
import React from "react";
import { capitalizeFirstLetter } from "../lib/string";
import { SwitchType } from "../types/switch";

interface SwitchTypeCheckboxProps
  extends Omit<FormControlLabelProps, "onChange" | "control" | "label"> {
  handleChange: (value: boolean) => void;
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
        handleChange(checked);
      }}
      control={<Checkbox defaultChecked={defaultChecked} />}
      label={capitalizeFirstLetter(switchType)}
      {...props}
    />
  );
};
