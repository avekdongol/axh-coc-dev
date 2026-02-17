/* 
    @Judges - localStorage allows the browser to store keys and values and permits me to save the current state of the game to the browser so that the user doesn't have to start over after exiting the tab. Using a custom storage module allows me to more easily manipulate clearing storage (no weird interference) and ensure that the storage is split between the window opened and the KA window when in fullscreen
*/
/**
 * Small wrapper around `localStorage` that prefers the opener window's storage when
 * running in a fullscreen/child context. Exposes the same API as `localStorage`.
 * @namespace storage
 * @property {(key:string)=>string|null} getItem
 * @property {(key:string,value:string)=>void} setItem
 * @property {(key:string)=>void} removeItem
 * @property {()=>void} clear
 */
const storage = (() => {
    //use parent window's storage if in fullscreen otherwise use own
    const store = window.opener ? window.opener.localStorage : localStorage;
    return {
        getItem: (key) => store.getItem(key),
        setItem: (key, value) => store.setItem(key, value),
        removeItem: (key) => store.removeItem(key),
        clear: () => store.clear()
    };
})();
//storage.clear();
//alert(JSON.stringify(storage));