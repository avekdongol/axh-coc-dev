/* 
    @Judges - localStorage allows the browser to store keys and values and permits me to save the current state of the game to the browser so that the user doesn't have to start over after exiting the tab. Using a custom storage module allows me to more easily manipulate clearing storage (no weird interference) and ensure that the storage is split between the window opened and the KA window when in fullscreen
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