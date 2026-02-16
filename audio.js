class AudioBuffer {
    /* 
        Created by Arrow
        Docs: https://www.khanacademy.org/computer-programming/ka-music-player/5424847674523648
    */
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.source = null;
        this.buffer = null;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
    }
    
    async setBase64String(audioBufferString) {
        this.audioBufferString = audioBufferString;
        await this._initializeBuffer();
    }
    
    async _initializeBuffer() {
        const binaryString = atob(this.audioBufferString.split(',')[1]);
        const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        this.buffer = await this.audioContext.decodeAudioData(bytes.buffer);
    }

    _createSource() {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.gainNode);
        //loop!
        this.source.loop = true;
    }
    
    play() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (!this.source) {
            this._createSource();
            this.source.start(0);
        }
    }
    
    pause() {
        if (this.source) {
            this.source.stop();
            this.source = null;
        }
    }
    
    setVolume(volume) {
        this.gainNode.gain.value = volume;
    }
}

//initialize audio
let gameAudio = null;
let isMuted = false;

async function initAudio() {
    gameAudio = new AudioBuffer();
    try {
        await gameAudio.setBase64String("data:audio/mpeg;base64," + dungeonMusic);
        gameAudio.setVolume(1);
        gameAudio.play();
    } catch (e) {
        console.error("failed to load audio:", e);
    }
}

//audio button handler
const audioButton = document.getElementById("audio");
if (audioButton) {
    audioButton.addEventListener("click", () => {
        if (!gameAudio) {
            initAudio();
            return;
        }
        
        isMuted = !isMuted;
        if (isMuted) {
            gameAudio.setVolume(0);
            audioButton.textContent = "volume_off";
        } 
        else {
            gameAudio.setVolume(1);
            audioButton.textContent = "volume_up";
        }
    });
}

//start
document.addEventListener("click", () => {
    if (!gameAudio) {
        initAudio();
    }
}, { once: true });
