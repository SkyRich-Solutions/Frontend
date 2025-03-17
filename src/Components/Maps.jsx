import React, { useRef } from 'react';
import { MapContainer, TileLayer, useMapEvent, useMap } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';

function SetViewOnClick({ animateRef }) {
    const map = useMapEvent('click', (e) => {
        map.setView(e.latlng, map.getZoom(), {
            animate: animateRef.current || false
        });
    });

    return null;
}

function SetMinZoom() {
    const map = useMap();

    // Set minZoom based on the map's bounds
    map.setMinZoom(
        map.getBoundsZoom(
            [
                [-90, -180],
                [90, 180]
            ],
            true
        )
    );

    return null;
}

const Maps = ({ animate = false }) => {
    const animateRef = useRef(animate);

    return (
        <div className='h-screen w-screen max-w-full max-h-full p-4'>
            <MapContainer
                center={[0, 0]}
                zoom={10}
                minZoom={2}
                maxZoom={18}
                maxBounds={[
                    [-90, -180],
                    [90, 180]
                ]}
                scrollWheelZoom={false}
                className='h-full w-full'
            >
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                />
                <SetMinZoom />
                <SetViewOnClick animateRef={animateRef} />
            </MapContainer>
        </div>
    );
};

export default Maps;
