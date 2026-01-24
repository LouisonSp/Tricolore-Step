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

export function getRandomStep(allowedSteps = STEPS) {
  if (!allowedSteps || allowedSteps.length === 0) return null;
  const index = Math.floor(Math.random() * allowedSteps.length);
  return allowedSteps[index];
}

export function getNextState(currentColor, allowedColors = Object.values(COLORS), allowedSteps = STEPS) {
  const fallbackColors = Object.values(COLORS);
  const safeColors = allowedColors && allowedColors.length > 0 ? allowedColors : fallbackColors;

  const availableColors = safeColors.length === 1
    ? safeColors
    : safeColors.filter(c => c !== currentColor);
  const nextColor = availableColors[Math.floor(Math.random() * availableColors.length)];

  const duration = getRandomDuration(nextColor);
  let step = null;

  if (nextColor === COLORS.ORANGE) {
    step = getRandomStep(allowedSteps);
  }

  return {
    color: nextColor,
    duration: duration,
    step: step
  };
}
