/**
 * Wrapper around the Web Audio API for decoding and playing a base64-encoded audio buffer.
 * Creates its own AudioContext, gain node, and buffer source. The source is created on
 * demand and configured to loop.
 *
 * Created by Arrow
 * Docs: https://www.khanacademy.org/computer-programming/ka-music-player/5424847674523648
 */
class AudioBuffer {
    constructor() {
        this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
        this.source = null;
        this.buffer = null;
        this.gainNode = this.audioContext.createGain();
        this.gainNode.connect(this.audioContext.destination);
    }
    /**
     * Sets the internal base64-encoded audio string and decodes it.
     * @param {string} audioBufferString - A data URL or base64 audio string (e.g. "data:audio/mpeg;base64,...").
     * @returns {Promise<void>} Resolves when the audio buffer has been decoded.
     */
    async setBase64String(audioBufferString) {
        this.audioBufferString = audioBufferString;
        await this._initializeBuffer();
    }
    
    /**
     * Internal: decodes the stored base64 audio string into an AudioBuffer.
     * @private
     * @returns {Promise<void>}
     */
    async _initializeBuffer() {
        const binaryString = atob(this.audioBufferString.split(',')[1]);
        const bytes = Uint8Array.from(binaryString, char => char.charCodeAt(0));
        this.buffer = await this.audioContext.decodeAudioData(bytes.buffer);
    }

    /**
     * Internal: creates and configures a BufferSource node connected to the gain node.
     * The source is configured to loop.
     * @private
     */
    _createSource() {
        this.source = this.audioContext.createBufferSource();
        this.source.buffer = this.buffer;
        this.source.connect(this.gainNode);
        //loop!
        this.source.loop = true;
    }
    
    /**
     * Starts playback. If the AudioContext is suspended it will be resumed first.
     * If a source has not been created yet it will create one and start it.
     */
    play() {
        if (this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
        if (!this.source) {
            this._createSource();
            this.source.start(0);
        }
    }
    
    /**
     * Stops and releases the current source if present.
     */
    pause() {
        if (this.source) {
            this.source.stop();
            this.source = null;
        }
    }
    
    /**
     * Sets the gain (volume) of playback.
     * @param {number} volume - Linear gain value (0.0 = silent, 1.0 = original volume).
     */
    setVolume(volume) {
        this.gainNode.gain.value = volume;
    }
}

//initialize audio
let gameAudio = null;
let isMuted = false;

/**
 * Initializes the global `gameAudio` instance by decoding the embedded base64 music
 * (from `dungeonMusic`) and starts playback. Errors are logged to the console.
 * @returns {Promise<void>}
 */
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
