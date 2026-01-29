class AudioController {
    constructor() {
        this.music = null;
        this.cues = {};
        this.isMusicPlaying = false;
        // Explicit list of music files found in the directory
        this.playlist = [
            'Come As You Are (Workout Remix).mp3',
            'Dance Monkey (Workout Remix 128 BPM).mp3',
            'The Rolling Stones - (I Cant Get No) Satisfaction (Official Lyric Video).mp3'
        ];
    }

    loadAssets() {
        if (this.initialized) return; // Prevent double loading
        this.initialized = true;

        // Music (Random Selection)
        const randomTrack = this.playlist[Math.floor(Math.random() * this.playlist.length)];
        this.music = new Audio(`/assets/audio/music/${randomTrack}`);
        this.music.loop = true;
        this.music.volume = 0.08; // Lower music for clearer cues
        console.log(`Loaded music: ${randomTrack}`);

        // Color Cues (Capitalized as found in directory)
        this.cues['red'] = new Audio('/assets/audio/colors/Red.mp3');
        this.cues['green'] = new Audio('/assets/audio/colors/Green.mp3');
        this.cues['orange'] = new Audio('/assets/audio/colors/Orange.mp3');
        this.cues['white'] = new Audio('/assets/audio/colors/Blanc.mp3');

        // Step Cues
        // Mapping keys (from GameLogic STEPS) to filenames
        const stepMap = {
            'BASIC': 'Basic Pas 1.mp3',
            'V-STEP': 'Vstep Pas 2.mp3',
            'TAP UP': 'Taapup Pas 3.mp3',
            'A-STEP': 'Astep Pas 4.mp3',
            'SQUARE': 'Squarre Pas 5.mp3',
            'KICK': 'Kick Pas 6 .mp3', // Preserved space from filename
            'CHEVAL': 'Cheval Pas 7.mp3'
        };

        for (const [key, filename] of Object.entries(stepMap)) {
            this.cues[key] = new Audio(`/assets/audio/steps/${filename}`);
        }
    }

    playMusic() {
        if (this.music) {
            this.music.play().catch(e => console.log("Audio play failed (user interaction needed?):", e));
            this.isMusicPlaying = true;
        }
    }

    pauseMusic() {
        if (this.music) {
            this.music.pause();
            this.isMusicPlaying = false;
        }
    }

    stopMusic() {
        if (this.music) {
            this.music.pause();
            this.music.currentTime = 0;
            this.isMusicPlaying = false;
        }
    }

    stopAll() {
        this.stopMusic();
        Object.values(this.cues).forEach(audio => {
            if (audio) {
                audio.pause();
                audio.currentTime = 0;
            }
        });
    }

    hasCue(name) {
        return Boolean(this.cues[name]);
    }

    playCue(name) {
        // Safety check
        if (!name) return;

        console.log(`Playing cue: ${name}`);
        const audio = this.cues[name];
        if (audio) {
            audio.currentTime = 0;
            audio.volume = 1.0;
            audio.play().catch(e => console.log("Cue play failed:", e));
        } else {
            console.warn(`Audio cue not found: ${name}`);
        }
    }

    testSound(name) {
        this.playCue(name);
    }
}

export const audioController = new AudioController();
