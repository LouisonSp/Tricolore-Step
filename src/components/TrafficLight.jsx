import React from 'react';
import { COLORS } from '../utils/GameLogic';

const TrafficLight = ({ color, instruction, stepName }) => {
    const getBackgroundColor = () => {
        switch (color) {
            case COLORS.RED: return '#ef4444'; // Red-500
            case COLORS.ORANGE: return '#f97316'; // Orange-500
            case COLORS.GREEN: return '#22c55e'; // Green-500
            default: return '#1f2937'; // Gray-800
        }
    };

    const getLabel = () => {
        switch (color) {
            case COLORS.RED: return 'MARCHER';
            case COLORS.ORANGE: return 'PAS SPÉCIFIQUE';
            case COLORS.GREEN: return 'BLOC CLASSE';
            default: return 'PRÊT ?';
        }
    };

    return (
        <div
            style={{
                backgroundColor: getBackgroundColor(),
                height: '100vh',
                width: '100vw',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'center',
                alignItems: 'center',
                color: 'white',
                transition: 'background-color 0.5s ease'
            }}
        >
            <h1 style={{ fontSize: '3rem', fontWeight: 'bold', textAlign: 'center', marginBottom: '1rem' }}>
                {getLabel()}
            </h1>

            {color === COLORS.ORANGE && stepName && (
                <h2 style={{ fontSize: '2rem', textAlign: 'center' }}>
                    {stepName.toUpperCase()}
                </h2>
            )}

            {instruction && (
                <p style={{ marginTop: '2rem', fontSize: '1.2rem', opacity: 0.8 }}>
                    {instruction}
                </p>
            )}
        </div>
    );
};

export default TrafficLight;
