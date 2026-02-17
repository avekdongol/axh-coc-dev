/* 
    User input, Image loading, Graphics
*/
/**
 * Initialize user input helpers and an image cache used by the renderer
 * Exposes `keys`, `mouse`, `cache`, and `img` for global use.
 * @returns {{keys:Object, mouse:Object, cache:Cache, img:Function}}
 */
const { keys, mouse, cache, img } = (function gameSetup() {
    //user input methods
    let k = {};
    let m = {
        x: 0,
        y: 0,
        clicked: false,
        rightClicked: false,
        rightReleased: false,
        released: false,
        down: false,
        up: false,
    };
    //the image cache. Loads images into the canvas
    const imagesToLoad = [
        {
            display: function () {
                try {
                    if(window.opener){
                        
                    }
                    
                    /* 
                        @Judges - A overlay to create a texture that covers the screen. I was unsure whether or not I liked it, so fullscreen doesn't have one and the KA Iframe does. Pick your poison.
                        As a side note: Using a Uint32Array and a SEPERATE, OFF-SCREEN, canvas makes this blazing fast
                    
                    */
                    const overlay = new ImageData(width, height);
                    const buf = new Uint32Array(overlay.data.buffer);
                    
                    for (let i = 0; i < buf.length; i++) {
                        const seq = Math.random();
                        const r = (seq * 60 + 25) | 0;
                        const g = (seq * 40 + Math.random() * 50) | 0;
                        const b = (seq * 60 + Math.random() * 100 - 50) | 0;
                    
                        //ABGR
                        buf[i] = (255 << 24) | (b << 16) | (g << 8) | r;
                    }
                    octx.putImageData(overlay, 0, 0);

                } catch (e) {
                    console.error("Image Cache error" + JSON.stringify(e));
                }
            },
            w: width,
            h: height,
        },
        {
            display: function () {},
            w: 600,
            h: 600,
        },
    ];
    Cache = (function () {
        /**
         * Simple image cache that pre-renders small bitmaps using OffscreenCanvas
         * and stores ImageBitmap objects for fast drawing.
         * @constructor
         */
        Cache = function (that) {
            this.loaded = false;
            this.imgIndex = 0;
            this.curImg = {};
            this.img = [];
        };
        Cache.prototype = {
            /**
             * Kick off loading/processing of images defined in `imagesToLoad`.
             * Uses OffscreenCanvas.transferToImageBitmap for performance.
             * @returns {boolean|undefined} Returns true when fully loaded.
             */
            load: function () { 
                /* 
                    @Judges - This thing is blazing fast because it is running with transferToImageBitmap() and another offscreen canvas
                */
                if (this.imgIndex < imagesToLoad.length) {
                    (async () => {
                        this.curImg = imagesToLoad[this.imgIndex];
                        this.curImg.display();
        
                        //use OffscreenCanvas for background processing (Faster than DOM Canvas)
                        const offscreen = new OffscreenCanvas(this.curImg.w, this.curImg.h);
                        const osCtx = offscreen.getContext('2d');
        
                        //GPU-accelerated alpha
                        osCtx.globalAlpha = 0.2;
                        osCtx.drawImage(ctx.canvas, 0, 0, this.curImg.w, this.curImg.h, 0, 0, this.curImg.w, this.curImg.h);
        
                        //transferToImageBitmap
                        const bmp = offscreen.transferToImageBitmap();
                        
                        this.img.push(bmp);
                        this.imgIndex++;
                        
                        // this.load(); 
                    })();
                } else {
                    return (this.loaded = true);
                }
            },
        };

        return Cache;
    })();
    let _cache = new Cache();

    /**
     * Convenience wrapper around `ctx.drawImage` that only draws when the cache is ready.
     * @param {CanvasImageSource|ImageBitmap} that - Image or bitmap to draw.
     * @param {number} x - Destination X coordinate.
     * @param {number} y - Destination Y coordinate.
     * @returns {void}
     */
    function img(that, x, y) {
        if (_cache.loaded) {
            return ctx.drawImage(that, x, y);
        }
    }
    
    return {
        keys: k,
        mouse: m,
        cache: _cache,
        img: img,
    };
})();
