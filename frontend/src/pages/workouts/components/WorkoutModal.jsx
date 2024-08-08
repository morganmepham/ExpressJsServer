import React, { useEffect, useState } from 'react';
import { Button, CssBaseline, DialogActions, Modal, TextField } from '@mui/material';
import { useTheme } from '@emotion/react';
import ExerciseRow from './ExerciseRow';
import useAxios from '../../../hooks/useAxios';

const WorkoutModal = ({ handleClose, handleSave, workoutId, handleUpdate }) => {
  const theme = useTheme();
  const { get, post } = useAxios();

  const [exercisesFromServer, setExercisesFromServer] = useState([]);

  const [workoutName, setWorkoutName] = useState('');
  const [exercises, setExercises] = useState([{ exercise_id: 0, sets: 1, reps: 1 }]);

  const handleExerciseChange = (index, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], exercise_id: value };
    setExercises(updatedExercises);
  };

  const handleSetsChange = (index, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], sets: value };
    setExercises(updatedExercises);
  };

  const handleRepsChange = (index, value) => {
    const updatedExercises = [...exercises];
    updatedExercises[index] = { ...updatedExercises[index], reps: value };
    setExercises(updatedExercises);
  };

  const handleWeightChange = (index, value) => {
    if (/^\d*\.?\d*$/.test(value)) {
      const updatedExercises = [...exercises];
      updatedExercises[index] = { ...updatedExercises[index], weight: value };
      setExercises(updatedExercises);
    }
  };

  const handleAddExercise = () => {
    setExercises([...exercises, { exercise_id: 0, sets: 1, reps: 1 }]);
  };

  const handleSaveWorkout = () => {
    // Here you can implement the logic to save the template
    console.log('Saving workout:', { name: workoutName, exercises });
    const template = {
      name: workoutName,
      description: ' ',
      exercises,
    };
    handleSave(template);
    handleClose();
  };

  const handleUpdateWorkout = () => {
    console.log('Upda template:', { name: workoutName, exercises });
    const template = {
      workoutId,
      name: workoutName,
      description: ' ',
      exercises,
    };
    handleUpdate(template);
    handleClose();
  };

  const getExercises = async () => {
    try {
      const result = await get('/exercises');
      setExercisesFromServer(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getWorkout = async (workoutId) => {
    try {
      const result = await post('/workout', { workoutId });
      console.log(result);

      setWorkoutName(result.data.name);
      setExercises(result.data.exercises);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getExercises();
    if (workoutId) {
      getWorkout(workoutId);
    }
  }, []);

  const exerciseData = exercisesFromServer?.map((exercise) => {
    return { exercise_id: exercise?.id, exerciseName: exercise?.name };
  });
  return (
    <Modal
      open={true}
      onClose={() => {
        handleClose();
      }}
      aria-labelledby="create-template-modal"
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100%',
        }}
      >
        <CssBaseline />
        <div
          style={{
            width: '50%',
            height: '90%',
            margin: '1rem',
            borderRadius: '0.8rem',
            boxShadow: 'rgba(0, 0, 0, 0.16) 0px 3px 6px, rgba(0, 0, 0, 0.23) 0px 3px 6px',
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            alignItems: 'start',
            alignContent: 'start',
            backgroundColor: theme.palette.secondary.background,
            overflowY: 'scroll',
          }}
          className="custom-scrollbar"
        >
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              height: '4rem',
              backgroundColor: theme.palette.primary.main,
              color: theme.palette.primary.contrastText,
              width: '100%',
              borderTopLeftRadius: '0.8rem',
              borderTopRightRadius: '0.8rem',
            }}
          ></div>
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'space-between',
              height: '100%',
              width: '100%',
              padding: '2rem',
              marginTop: '1rem',
              flexWrap: 'wrap',
              paddingBottom: '0',
            }}
          >
            <div style={{ width: '100%' }}>
              <TextField
                required
                id="outlined-required"
                label="Workout Name"
                fullWidth
                onChange={(e) => setWorkoutName(e.target.value)}
                value={workoutName}
                className="textField"
              />
              {/* Exercises */}
              <div style={{ width: '100%' }}>
                {exercises.map((exercise, index) => (
                  <ExerciseRow
                    key={index}
                    handleExerciseChange={(e) => handleExerciseChange(index, e.target.value)}
                    handleSetsChange={(e) => handleSetsChange(index, e.target.value)}
                    handleRepsChange={(e) => handleRepsChange(index, e.target.value)}
                    handleWeightChange={(e) => handleWeightChange(index, e.target.value)}
                    value={exercise}
                    options={exerciseData}
                  />
                ))}
                <Button onClick={handleAddExercise} style={{ marginTop: '1rem' }}>
                  + Add Exercise
                </Button>
              </div>
            </div>
            <DialogActions sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
              <Button onClick={handleClose}>Cancel</Button>
              <Button onClick={workoutId ? handleUpdateWorkout : handleSaveWorkout} variant="contained">
                Save Template
              </Button>
            </DialogActions>
          </div>
        </div>
      </div>
    </Modal>
  );
};

export default WorkoutModal;
