import React from "react";
import InputAdornment from "@material-ui/core/InputAdornment";
import TextField from "@material-ui/core/TextField";
import type { FilledTextFieldProps } from "@material-ui/core";

export interface PositiveNumberInputProps
  extends Omit<
    FilledTextFieldProps,
    "variant" | "type" | "label" | "onChange"
  > {
  handleChange: (value: React.SetStateAction<number>) => void;
  unit?: string;
  label: string;
}

export const PositiveNumberInput: React.FC<PositiveNumberInputProps> = ({
  handleChange,
  unit = "mm",
  label,
  InputProps = {},
  inputProps = {},
  ...props
}) => {
  return (
    <TextField
      label={label}
      InputProps={{
        endAdornment: <InputAdornment position="end">{unit}</InputAdornment>,
        ...InputProps,
      }}
      type="number"
      variant="filled"
      onChange={(e) => {
        const asNum = parseFloat(e.target.value);
        if (asNum < 0 || isNaN(asNum)) {
          handleChange(Number.MAX_SAFE_INTEGER);
          e.target.value = "";
        } else {
          handleChange(asNum);
        }
      }}
      inputProps={{
        min: 0,
        step: 1,
        ...inputProps,
      }}
      {...props}
    />
  );
};
