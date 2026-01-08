// Exercise database
const exerciseDatabase = {
  fat_loss: {
    push_pull_legs: {
      push: [
        { name: 'Push-ups', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Dumbbell Bench Press', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Overhead Press', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Tricep Dips', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Lateral Raises', sets: 3, reps: '12-15', rest: 45 },
      ],
      pull: [
        { name: 'Pull-ups/Assisted Pull-ups', sets: 3, reps: '8-12', rest: 60 },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Lat Pulldowns', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Face Pulls', sets: 3, reps: '12-15', rest: 45 },
      ],
      legs: [
        { name: 'Squats', sets: 4, reps: '12-15', rest: 60 },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: 45 },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Calf Raises', sets: 3, reps: '15-20', rest: 30 },
      ],
    },
    upper_lower: {
      upper: [
        { name: 'Bench Press', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Barbell Rows', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Overhead Press', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Pull-ups', sets: 3, reps: '8-12', rest: 60 },
        { name: 'Tricep Dips', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Bicep Curls', sets: 3, reps: '12-15', rest: 45 },
      ],
      lower: [
        { name: 'Squats', sets: 4, reps: '12-15', rest: 60 },
        { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Leg Press', sets: 3, reps: '12-15', rest: 60 },
        { name: 'Walking Lunges', sets: 3, reps: '12 each leg', rest: 45 },
        { name: 'Leg Curls', sets: 3, reps: '12-15', rest: 45 },
        { name: 'Calf Raises', sets: 3, reps: '15-20', rest: 30 },
      ],
    },
    full_body: [
      { name: 'Squats', sets: 3, reps: '12-15', rest: 60 },
      { name: 'Bench Press', sets: 3, reps: '10-12', rest: 60 },
      { name: 'Barbell Rows', sets: 3, reps: '10-12', rest: 60 },
      { name: 'Overhead Press', sets: 3, reps: '10-12', rest: 60 },
      { name: 'Romanian Deadlifts', sets: 3, reps: '10-12', rest: 60 },
      { name: 'Pull-ups', sets: 3, reps: '8-12', rest: 60 },
    ],
  },
  muscle_gain: {
    push_pull_legs: {
      push: [
        { name: 'Barbell Bench Press', sets: 4, reps: '6-8', rest: 90 },
        { name: 'Incline Dumbbell Press', sets: 3, reps: '8-10', rest: 90 },
        { name: 'Overhead Press', sets: 3, reps: '6-8', rest: 90 },
        { name: 'Tricep Dips', sets: 3, reps: '8-10', rest: 60 },
        { name: 'Lateral Raises', sets: 3, reps: '10-12', rest: 60 },
      ],
      pull: [
        { name: 'Deadlifts', sets: 4, reps: '5-6', rest: 120 },
        { name: 'Barbell Rows', sets: 4, reps: '6-8', rest: 90 },
        { name: 'Pull-ups', sets: 4, reps: '8-10', rest: 90 },
        { name: 'Bicep Curls', sets: 3, reps: '8-10', rest: 60 },
        { name: 'Hammer Curls', sets: 3, reps: '10-12', rest: 60 },
      ],
      legs: [
        { name: 'Barbell Squats', sets: 4, reps: '6-8', rest: 120 },
        { name: 'Romanian Deadlifts', sets: 3, reps: '6-8', rest: 90 },
        { name: 'Leg Press', sets: 4, reps: '10-12', rest: 90 },
        { name: 'Walking Lunges', sets: 3, reps: '10 each leg', rest: 60 },
        { name: 'Leg Curls', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Calf Raises', sets: 4, reps: '12-15', rest: 45 },
      ],
    },
    upper_lower: {
      upper: [
        { name: 'Bench Press', sets: 4, reps: '6-8', rest: 90 },
        { name: 'Barbell Rows', sets: 4, reps: '6-8', rest: 90 },
        { name: 'Overhead Press', sets: 3, reps: '6-8', rest: 90 },
        { name: 'Pull-ups', sets: 4, reps: '8-10', rest: 90 },
        { name: 'Tricep Dips', sets: 3, reps: '8-10', rest: 60 },
        { name: 'Bicep Curls', sets: 3, reps: '8-10', rest: 60 },
      ],
      lower: [
        { name: 'Barbell Squats', sets: 4, reps: '6-8', rest: 120 },
        { name: 'Romanian Deadlifts', sets: 3, reps: '6-8', rest: 90 },
        { name: 'Leg Press', sets: 4, reps: '10-12', rest: 90 },
        { name: 'Walking Lunges', sets: 3, reps: '10 each leg', rest: 60 },
        { name: 'Leg Curls', sets: 3, reps: '10-12', rest: 60 },
        { name: 'Calf Raises', sets: 4, reps: '12-15', rest: 45 },
      ],
    },
    full_body: [
      { name: 'Barbell Squats', sets: 4, reps: '6-8', rest: 120 },
      { name: 'Bench Press', sets: 4, reps: '6-8', rest: 90 },
      { name: 'Barbell Rows', sets: 4, reps: '6-8', rest: 90 },
      { name: 'Overhead Press', sets: 3, reps: '6-8', rest: 90 },
      { name: 'Deadlifts', sets: 3, reps: '5-6', rest: 120 },
      { name: 'Pull-ups', sets: 3, reps: '8-10', rest: 90 },
    ],
  },
  strength: {
    push_pull_legs: {
      push: [
        { name: 'Barbell Bench Press', sets: 5, reps: '3-5', rest: 180 },
        { name: 'Overhead Press', sets: 5, reps: '3-5', rest: 180 },
        { name: 'Close Grip Bench Press', sets: 3, reps: '5-6', rest: 120 },
        { name: 'Tricep Dips', sets: 3, reps: '6-8', rest: 90 },
      ],
      pull: [
        { name: 'Deadlifts', sets: 5, reps: '3-5', rest: 240 },
        { name: 'Barbell Rows', sets: 5, reps: '5-6', rest: 120 },
        { name: 'Weighted Pull-ups', sets: 4, reps: '5-6', rest: 120 },
        { name: 'Bicep Curls', sets: 3, reps: '6-8', rest: 90 },
      ],
      legs: [
        { name: 'Barbell Squats', sets: 5, reps: '3-5', rest: 240 },
        { name: 'Romanian Deadlifts', sets: 4, reps: '5-6', rest: 120 },
        { name: 'Leg Press', sets: 3, reps: '8-10', rest: 90 },
        { name: 'Calf Raises', sets: 4, reps: '10-12', rest: 60 },
      ],
    },
    upper_lower: {
      upper: [
        { name: 'Bench Press', sets: 5, reps: '3-5', rest: 180 },
        { name: 'Barbell Rows', sets: 5, reps: '5-6', rest: 120 },
        { name: 'Overhead Press', sets: 5, reps: '3-5', rest: 180 },
        { name: 'Weighted Pull-ups', sets: 4, reps: '5-6', rest: 120 },
      ],
      lower: [
        { name: 'Barbell Squats', sets: 5, reps: '3-5', rest: 240 },
        { name: 'Deadlifts', sets: 5, reps: '3-5', rest: 240 },
        { name: 'Romanian Deadlifts', sets: 3, reps: '5-6', rest: 120 },
        { name: 'Leg Press', sets: 3, reps: '8-10', rest: 90 },
      ],
    },
    full_body: [
      { name: 'Barbell Squats', sets: 5, reps: '3-5', rest: 240 },
      { name: 'Bench Press', sets: 5, reps: '3-5', rest: 180 },
      { name: 'Deadlifts', sets: 5, reps: '3-5', rest: 240 },
      { name: 'Overhead Press', sets: 5, reps: '3-5', rest: 180 },
      { name: 'Barbell Rows', sets: 4, reps: '5-6', rest: 120 },
    ],
  },
};

export const generateWorkoutPlan = (goal, daysPerWeek, height, weight, age) => {
  // Determine weekly split based on days per week
  let weeklySplit;
  if (daysPerWeek >= 6) {
    weeklySplit = 'push_pull_legs';
  } else if (daysPerWeek >= 4) {
    weeklySplit = 'upper_lower';
  } else {
    weeklySplit = 'full_body';
  }

  const exercises = exerciseDatabase[goal]?.[weeklySplit];
  if (!exercises) {
    throw new Error('Invalid goal or split combination');
  }

  const workoutDays = [];
  const days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];

  if (weeklySplit === 'push_pull_legs') {
    const cycle = ['push', 'pull', 'legs'];
    for (let i = 0; i < daysPerWeek; i++) {
      const focus = cycle[i % 3];
      workoutDays.push({
        day: days[i],
        exercises: exercises[focus] || [],
        focus: focus.charAt(0).toUpperCase() + focus.slice(1),
      });
    }
  } else if (weeklySplit === 'upper_lower') {
    const cycle = ['upper', 'lower'];
    for (let i = 0; i < daysPerWeek; i++) {
      const focus = cycle[i % 2];
      workoutDays.push({
        day: days[i],
        exercises: exercises[focus] || [],
        focus: focus.charAt(0).toUpperCase() + focus.slice(1),
      });
    }
  } else {
    // Full body
    for (let i = 0; i < daysPerWeek; i++) {
      workoutDays.push({
        day: days[i],
        exercises: exercises || [],
        focus: 'Full Body',
      });
    }
  }

  return {
    goal,
    weeklySplit,
    daysPerWeek,
    workoutDays,
  };
};






