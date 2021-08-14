import React from "react";
import Box from "@material-ui/core/Box";
import Slider from "@material-ui/core/Slider";
import type { Mark, SliderProps } from "@material-ui/core";
import FormControl from "@material-ui/core/FormControl";
import FormLabel from "@material-ui/core/FormLabel";

interface FilterSliderProps extends SliderProps {
  marks: Mark[];
  label: string;
  id: string;
}

export const FilterSlider: React.FC<FilterSliderProps> = ({
  label,
  marks,
  id,
  value,
  ...props
}) => {
  const max = Math.max(...marks.map(({ value }) => value));
  const [controlValue, controlValueSet] = React.useState(value);
  React.useEffect(() => {
    controlValueSet(value);
  }, [value]);
  return (
    <FormControl fullWidth component="fieldset">
      <FormLabel component="legend">{label}</FormLabel>
      <Box padding="0 12px">
        <Slider
          value={controlValue}
          onChange={(_, value) => controlValueSet(value)}
          aria-labelledby={id}
          marks={marks}
          defaultValue={max}
          min={Math.min(...marks.map(({ value }) => value))}
          max={max}
          valueLabelDisplay="auto"
          {...props}
        />
      </Box>
    </FormControl>
  );
};

export function makeMarks(numbers: number[], label: string): Mark[] {
  const asSet = new Set(numbers);
  const asSortedArray = Array.from(asSet).sort();
  return asSortedArray.map((value, i, a) => {
    return {
      value,
      label: i === 0 || i === a.length - 1 ? `${value} ${label}` : null,
    };
  });
}
