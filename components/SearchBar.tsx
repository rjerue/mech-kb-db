import Autocomplete from "@mui/material/Autocomplete";
import Chip from "@mui/material/Chip";
import TextField from "@mui/material/TextField";
import React from "react";
import { MechSwitch } from "../types/switch";

interface SearchBarProps {
  switches: MechSwitch[];
  setNamesSet: (param: string[]) => void;
  value?: string[];
}

export const SearchBar: React.FC<SearchBarProps> = ({
  switches,
  setNamesSet,
  value,
}) => {
  return (
    <Autocomplete
      onChange={(_, newValue: string[] | null) => {
        setNamesSet(newValue || []);
      }}
      value={value}
      multiple
      id="tags-filled"
      options={[...Object.values(switches).map((e) => e.displayName)]}
      freeSolo
      renderTags={(value: string[], getTagProps) =>
        value.map((option: string, index: number) => (
          <Chip
            {...getTagProps({ index })}
            key={option}
            variant="outlined"
            label={option}
          />
        ))
      }
      renderInput={(params) => (
        <TextField {...params} variant="filled" label="Find switches!" />
      )}
    />
  );
};
