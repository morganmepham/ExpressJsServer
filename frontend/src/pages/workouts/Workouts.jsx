import React, { useEffect, useState } from 'react';
import useAxios from '../../hooks/useAxios';
import WorkoutCard from './components/WorkoutCard';
import './css/templates.css';
import AddIcon from '@mui/icons-material/Add';
import { useTheme } from '@emotion/react';
import WorkoutModal from './components/WorkoutModal';
import { format, isThisWeek, isToday, isWithinInterval, isYesterday, subDays } from 'date-fns';
const Workouts = () => {
  const { get, post, put } = useAxios();
  const theme = useTheme();

  const [workouts, setWorkouts] = useState([]);
  const [workoutModalOpen, setWorkoutModalOpen] = useState(false);
  const [workoutId, setWorkoutId] = useState(undefined);

  const getAllWorkouts = async () => {
    try {
      const result = await get('/workouts');
      setWorkouts(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const createWorkout = async (body) => {
    try {
      const result = await post('/workouts', body);
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getAllWorkouts();
  }, [workoutModalOpen]);

  const updateWorkout = async (body) => {
    try {
      const result = await put('/workout', body);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        height: '94%',
        width: '100%',
        justifyContent: 'center',
        backgroundColor: theme.palette.background.paper,
      }}
    >
      <h1 style={{ fontSize: '3rem' }}>Workouts Page</h1>
      <div
        style={{
          display: 'flex',
          flexWrap: 'wrap',
          height: '100%',
          width: '100%',
          padding: '2rem',
          paddingRight: '5rem',
          paddingLeft: '5rem',
        }}
      >
        <div className="card" onClick={() => setWorkoutModalOpen(true)}>
          <AddIcon fontSize="large" />
          <p style={{ width: '100%', textAlign: 'center' }}>Create Workout</p>
        </div>
        {workouts?.map((workout) => {
          const formatDate = (dateString) => {
            const date = new Date(dateString);

            if (isToday(date)) {
              return 'Today';
            }

            if (isYesterday(date)) {
              return 'Yesterday';
            }

            if (isThisWeek(date)) {
              return format(date, 'EEEE'); // e.g., "Monday"
            }

            // Format as "Tue Jul 23 2024" for dates not within this week
            return format(date, 'EEE MMM dd yyyy');
          };
          const formattedDate = formatDate(workout.date);
          return (
            <WorkoutCard
              key={Math.floor(Math.random())}
              workoutName={workout?.name}
              workoutId={workout?.id}
              onClick={(workoutId) => {
                setWorkoutId(workoutId);
                setWorkoutModalOpen(true);
              }}
              workoutDate={formattedDate}
            />
          );
        })}
      </div>

      {workoutModalOpen && workoutId === undefined && (
        <WorkoutModal handleSave={(body) => createWorkout(body)} handleClose={() => setWorkoutModalOpen(false)} />
      )}
      {workoutModalOpen && workoutId !== undefined && (
        <WorkoutModal
          handleUpdate={(body) => {
            updateWorkout(body);
          }}
          handleClose={() => {
            setWorkoutModalOpen(false);
            setWorkoutId(undefined);
          }}
          workoutId={workoutId}
        />
      )}
    </div>
  );
};

export default Workouts;
