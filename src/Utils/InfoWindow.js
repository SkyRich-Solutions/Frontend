// src/Utils/InfoWindow.js
let globalInfoWindow = null;

export const closeGlobalInfoWindow = () => {
    if (globalInfoWindow) {
        globalInfoWindow.close();
        globalInfoWindow = null;
    }
};

export const setGlobalInfoWindow = (infoWindow) => {
    closeGlobalInfoWindow(); // close previous one
    globalInfoWindow = infoWindow;
};
