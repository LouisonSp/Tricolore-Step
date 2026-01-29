import React, { useState, useEffect, useRef } from 'react';
import TrafficLight from './components/TrafficLight';
import { audioController } from './utils/AudioController';
import { getNextState, COLORS, STEPS, getRandomDuration } from './utils/GameLogic';
import './App.css';

const GAME_DURATION = 5 * 60; // 5 minutes in seconds

function App() {
  const [gameState, setGameState] = useState('idle'); // idle, playing, paused, finished
  const [timeLeft, setTimeLeft] = useState(GAME_DURATION);

  const [currentPhase, setCurrentPhase] = useState(null);
  const [phaseTimeLeft, setPhaseTimeLeft] = useState(0);
  const [selectedColors, setSelectedColors] = useState(Object.values(COLORS));
  const [selectedSteps, setSelectedSteps] = useState([...STEPS]);

  const timerRef = useRef(null);
  const stepCueTimeoutRef = useRef(null);

  // Initialize Audio
  useEffect(() => {
    audioController.loadAssets();
  }, []);

  const startGame = () => {
    setGameState('playing');
    setTimeLeft(GAME_DURATION);

    // Initial state: Random start or fixed? User didn't specify. 
    // Let's start with Green (Bloc Classe) as a warmup or just random.
    // Random seems best based on "alterner... aléatoire".
    transitionToNextPhase(null);
    audioController.playMusic();
  };

  const toggleSelection = (value, setFn) => {
    setFn(prev => (
      prev.includes(value) ? prev.filter(item => item !== value) : [...prev, value]
    ));
  };

  const transitionToNextPhase = (current) => {
    const next = getNextState(current ? current.color : null, selectedColors, selectedSteps);
    setCurrentPhase(next);
    setPhaseTimeLeft(next.duration);

    // Play audio cues
    if (audioController.hasCue(next.color)) {
      audioController.playCue(next.color);
    }
    if ((next.color === COLORS.ORANGE || next.color === COLORS.WHITE) && next.step) {
      // Play step cue after a short delay or mix? 
      // We'll play step cue immediately after color cue or with slight delay.
      if (stepCueTimeoutRef.current) {
        clearTimeout(stepCueTimeoutRef.current);
      }
      stepCueTimeoutRef.current = setTimeout(() => audioController.playCue(next.step), 1000);
    }
  };

  const stopGame = () => {
    setGameState('idle');
    audioController.stopMusic();
    if (timerRef.current) clearInterval(timerRef.current);
    if (stepCueTimeoutRef.current) clearTimeout(stepCueTimeoutRef.current);
  };

  const togglePause = () => {
    if (gameState === 'playing') {
      setGameState('paused');
      audioController.pauseMusic();
    } else if (gameState === 'paused') {
      setGameState('playing');
      audioController.playMusic();
    }
  };

  useEffect(() => {
    if (gameState === 'playing') {
      if (timerRef.current) clearInterval(timerRef.current);
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            stopGame();
            return 0;
          }
          return prev - 1;
        });

        setPhaseTimeLeft(prev => {
          if (prev <= 1) {
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }

    return () => {
      clearInterval(timerRef.current);
      // audioController.stopAll(); // Optional: stop everything if component unmounts
    };
  }, [gameState]);

  // Effect to handle phase transition based on timer
  useEffect(() => {
    if (gameState === 'playing' && phaseTimeLeft === 0 && timeLeft > 0) {
      transitionToNextPhase(currentPhase);
    }
  }, [phaseTimeLeft, gameState, timeLeft, currentPhase]);
  // Warning: Dependencies might cause loop if transition sets phaseTimeLeft > 0 immediately.
  // transition sets duration > 0. So phaseTimeLeft becomes > 0. Effect stops. Correct.
  // One edge case: startGame sets duration. phaseTimeLeft > 0.
  // Timer reduces it. 
  // Eventuall hits 0. Effect fires. Sets > 0.
  // This seems correct.

  return (
    <div className="app-container">
      {gameState === 'idle' && (
        <div className="start-screen">
          <h1>Feu Tricolore Step</h1>
          <button
            onClick={startGame}
            className="btn-start"
            disabled={selectedColors.length === 0}
            style={selectedColors.length === 0 ? { opacity: 0.6, cursor: 'not-allowed' } : undefined}
          >
            COMMENCER (5 MIN)
          </button>

          <div style={{ marginTop: '2rem', width: 'min(800px, 90%)', display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <div style={{ minWidth: '220px' }}>
              <p style={{ marginBottom: '0.5rem', opacity: 0.8 }}>Couleurs actives</p>
              {[
                { value: COLORS.RED, label: 'Rouge' },
                { value: COLORS.ORANGE, label: 'Orange' },
                { value: COLORS.GREEN, label: 'Vert' },
                { value: COLORS.WHITE, label: 'Blanc' }
              ].map(option => (
                <label key={option.value} style={{ display: 'block', marginBottom: '0.4rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedColors.includes(option.value)}
                    onChange={() => toggleSelection(option.value, setSelectedColors)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {option.label}
                </label>
              ))}
              {selectedColors.length === 0 && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                  Choisis au moins une couleur pour lancer.
                </p>
              )}
            </div>

            <div style={{ minWidth: '220px' }}>
              <p style={{ marginBottom: '0.5rem', opacity: 0.8 }}>Pas (orange)</p>
              {STEPS.map(step => (
                <label key={step} style={{ display: 'block', marginBottom: '0.4rem' }}>
                  <input
                    type="checkbox"
                    checked={selectedSteps.includes(step)}
                    onChange={() => toggleSelection(step, setSelectedSteps)}
                    style={{ marginRight: '0.5rem' }}
                  />
                  {step}
                </label>
              ))}
              {selectedSteps.length === 0 && (
                <p style={{ marginTop: '0.5rem', fontSize: '0.85rem', opacity: 0.7 }}>
                  Aucun pas sélectionné, l'orange restera sans pas.
                </p>
              )}
            </div>
          </div>

          <div style={{ marginTop: '2rem', display: 'flex', gap: '10px', flexWrap: 'wrap', justifyContent: 'center' }}>
            <p style={{ width: '100%', textAlign: 'center', opacity: 0.7 }}>Test Audio :</p>
            <button onClick={() => audioController.testSound('red')} className="btn-control" style={{ fontSize: '0.8rem' }}>Rouge</button>
            <button onClick={() => audioController.testSound('green')} className="btn-control" style={{ fontSize: '0.8rem' }}>Vert</button>
            <button onClick={() => audioController.testSound('orange')} className="btn-control" style={{ fontSize: '0.8rem' }}>Orange</button>
            <button onClick={() => audioController.testSound('white')} className="btn-control" style={{ fontSize: '0.8rem' }}>Blanc</button>
            <button onClick={() => audioController.testSound('BASIC')} className="btn-control" style={{ fontSize: '0.8rem' }}>Pas 1</button>
          </div>
        </div>
      )}

      {(gameState === 'playing' || gameState === 'paused') && (
        <>
          <TrafficLight
            color={currentPhase?.color}
            stepName={currentPhase?.step}
            instruction={gameState === 'paused' ? "PAUSE" : `${Math.floor(timeLeft / 60)}:${(timeLeft % 60).toString().padStart(2, '0')}`}
          />
          <div className="controls">
            <button onClick={togglePause} className="btn-control">
              {gameState === 'playing' ? 'PAUSE' : 'REPRENDRE'}
            </button>
            <button onClick={stopGame} className="btn-control">ARRÊTER</button>
          </div>
        </>
      )}
    </div>
  );
}

export default App;
