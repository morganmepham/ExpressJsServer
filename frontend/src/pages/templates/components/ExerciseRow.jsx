import { FormControl, InputLabel, MenuItem, Select } from "@mui/material";

const ExerciseRow = ({ handleChange, value, options }) => {
  return (
    <div style={{ display: "flex", width: "100%", marginTop: "1rem" }}>
      <FormControl fullWidth>
        <Select
          value={value}
          onChange={handleChange}
          renderValue={(selected) => {
            return <em>Excerise</em>;
          }}
        >
          {options?.map((option) => {
            return <MenuItem value={option}>{option}</MenuItem>;
          })}
        </Select>
      </FormControl>
    </div>
  );
};

export default ExerciseRow;
