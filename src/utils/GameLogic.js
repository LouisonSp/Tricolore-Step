export const COLORS = {
  RED: 'red',
  ORANGE: 'orange',
  GREEN: 'green'
};

export const STEPS = [
  'BASIC',
  'V-STEP',
  'TAP UP',
  'A-STEP',
  'SQUARE',
  'KICK',
  'CHEVAL'
];

export const DURATIONS = {
  [COLORS.RED]: { min: 5, max: 15 },
  [COLORS.GREEN]: { min: 5, max: 35 },
  [COLORS.ORANGE]: { min: 5, max: 17 }
};

export function getRandomDuration(color) {
  const { min, max } = DURATIONS[color];
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

export function getRandomStep() {
  const index = Math.floor(Math.random() * STEPS.length);
  return STEPS[index];
}

export function getNextState(currentColor) {
  const colors = Object.values(COLORS).filter(c => c !== currentColor);
  const nextColor = colors[Math.floor(Math.random() * colors.length)];

  const duration = getRandomDuration(nextColor);
  let step = null;

  if (nextColor === COLORS.ORANGE) {
    step = getRandomStep();
  }

  return {
    color: nextColor,
    duration: duration,
    step: step
  };
}
