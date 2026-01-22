# Feu Tricolore Step 🚦👟

Application web support pour un cycle de Step (EPS).
Gère automatiquement un chronomètre de 5 minutes avec alternance aléatoire des feux tricolores.

## Installation et Lancement

1. `npm install`
2. `npm run dev`

## 🎵 Fichiers Audio Installés

L'application est configurée pour utiliser les fichiers suivants :

### 📂 `public/assets/audio/music/`
L'application choisira **aléatoirement** une de ces musiques au lancement :
- `Come As You Are (Workout Remix).mp3`
- `Dance Monkey (Workout Remix 128 BPM).mp3`
- `The Rolling Stones - (I Cant Get No) Satisfaction (Official Lyric Video).mp3`

### 📂 `public/assets/audio/colors/`
- `Red.mp3`
- `Green.mp3`
- `Orange.mp3`

### 📂 `public/assets/audio/steps/`
- `Basic Pas 1.mp3`
- `Vstep Pas 2.mp3`
- `Taapup Pas 3.mp3`
- `Astep Pas 4.mp3`
- `Squarre Pas 5.mp3`
- `Kick Pas 6 .mp3`
- `Cheval Pas 7.mp3`

> Pour ajouter/supprimer des musiques, mettez à jour `src/utils/AudioController.js`.
> Le volume de la musique se règle aussi dans ce fichier (`this.music.volume`).
