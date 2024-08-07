import { FormControl, InputLabel, MenuItem, Select } from '@mui/material';
import React from 'react';

const ExerciseRow = ({ handleExerciseChange, handleSetsChange, handleRepsChange, value, options }) => {
  console.log(options);

  const setCount = ['1', '2', '3', '4', '5', '6', '7', 8, 9, 10];
  const repCount = [
    1,
    2,
    3,
    4,
    5,
    6,
    7,
    '8',
    9,
    10,
    11,
    12,
    13,
    14,
    15,
    16,
    17,
    18,
    19,
    20,
    21,
    22,
    23,
    24,
    25,
    26,
    27,
    28,
    29,
    30,
  ];
  return (
    <div
      style={{
        display: 'flex',
        width: '100%',
        marginTop: '1rem',
        justifyContent: 'space-between',
      }}
    >
      <FormControl sx={{ width: '40%' }}>
        <InputLabel>Exercise</InputLabel>
        <Select
          value={value?.exercise_id}
          onChange={handleExerciseChange}
          label="Exercise"
          placeholder="Exercise"
          sx={{ width: '100%' }}
          fullWidth
        >
          {options?.map((option, index) => (
            <MenuItem key={index} value={option?.exercise_id}>
              {option?.exerciseName}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl sx={{ width: '25%' }}>
        <InputLabel>Sets</InputLabel>
        <Select value={value.sets} onChange={handleSetsChange} sx={{ width: '100%' }} label="Sets">
          {setCount?.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      <FormControl sx={{ width: '25%' }}>
        <InputLabel>Reps</InputLabel>
        <Select value={value.reps} onChange={handleRepsChange} sx={{ width: '100%' }} label="Reps">
          {repCount?.map((option, index) => (
            <MenuItem key={index} value={option}>
              {option}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
    </div>
  );
};

export default ExerciseRow;
