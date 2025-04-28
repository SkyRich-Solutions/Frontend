import { useEffect } from 'react';
import { useMap } from '@vis.gl/react-google-maps';

const ConnectionLine = ({ path }) => {
    const map = useMap();

    useEffect(() => {
        if (!map || path.length < 2 || !window.google) return;

        const line = new window.google.maps.Polyline({
            path,
            geodesic: true,
            strokeOpacity: 0,
            strokeWeight: 2,
            icons: [
                {
                    icon: {
                        path: 'M 0,-1 0,1',
                        strokeOpacity: 1,
                        scale: 4
                    },
                    offset: '0',
                    repeat: '10px'
                }
            ],
            map
        });

        return () => {
            line.setMap(null); // Clean up on unmount
        };
    }, [map, path]);

    return null;
};

export default ConnectionLine;
