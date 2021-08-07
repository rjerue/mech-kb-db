import React from "react";
import Grid, { GridSize } from "@material-ui/core/Grid";
import Typography from "@material-ui/core/Typography";
import Slider from "@material-ui/core/Slider";
import type { Mark, SliderProps } from "@material-ui/core";

interface FilterSliderProps extends SliderProps {
  marks: Mark[];
  label: string;
  id: string;
  sm: GridSize;
}

export const FilterSlider: React.FC<FilterSliderProps> = ({
  label,
  marks,
  id,
  sm,
  ...props
}) => {
  const max = Math.max(...marks.map(({ value }) => value));
  return (
    <Grid item sm={sm} xs={12}>
      <Typography id={id} gutterBottom>
        {label}
      </Typography>
      <Slider
        aria-labelledby={id}
        marks={marks}
        defaultValue={max}
        min={Math.min(...marks.map(({ value }) => value))}
        max={max}
        valueLabelDisplay="auto"
        {...props}
      />
    </Grid>
  );
};

export function makeMarks(numbers: number[], label: string): Mark[] {
  const asSet = new Set(numbers);
  const asSortedArray = Array.from(asSet).sort();
  return asSortedArray.map((value, i, a) => {
    return {
      value,
      label:
        value % 5 === 0 ? (
          <span className={i === 0 || i === a.length - 1 ? "" : "mark-middle"}>
            {value}
            {label}
          </span>
        ) : null,
    };
  });
}
