import { useEffect, useRef } from 'react';
import { useMap } from '@vis.gl/react-google-maps';
import {
    closeGlobalInfoWindow,
    setGlobalInfoWindow
} from '../../Utils/InfoWindow';

const ConnectionLine = ({ origin, destination }) => {
    const map = useMap();
    const directionsRendererRef = useRef(null);

    useEffect(() => {
        if (!map || !origin || !destination || !window.google) return;

        // Cleanup previous DirectionsRenderer
        if (directionsRendererRef.current) {
            directionsRendererRef.current.setMap(null);
        }

        // Close any existing popup
        closeGlobalInfoWindow();

        const directionsService = new window.google.maps.DirectionsService();
        const newRenderer = new window.google.maps.DirectionsRenderer({
            map,
            suppressMarkers: true,
            preserveViewport: true,
            polylineOptions: {
                strokeColor: '#0000FF',
                strokeOpacity: 1,
                strokeWeight: 5
            }
        });

        directionsRendererRef.current = newRenderer;

        directionsService.route(
            {
                origin,
                destination,
                travelMode: window.google.maps.TravelMode.DRIVING
            },
            (result, status) => {
                if (status === window.google.maps.DirectionsStatus.OK) {
                    newRenderer.setDirections(result);

                    const route = result.routes[0];
                    const leg = route.legs[0];
                    const distance = leg.distance.text;
                    const path = route.overview_path;

                    const totalLength =
                        window.google.maps.geometry.spherical.computeLength(
                            path
                        );
                    let distanceSoFar = 0;
                    let midpoint = null;

                    for (let i = 0; i < path.length - 1; i++) {
                        const start = path[i];
                        const end = path[i + 1];
                        const segmentLength =
                            window.google.maps.geometry.spherical.computeDistanceBetween(
                                start,
                                end
                            );

                        if (distanceSoFar + segmentLength >= totalLength / 2) {
                            const remaining = totalLength / 2 - distanceSoFar;
                            const fraction = remaining / segmentLength;
                            midpoint =
                                window.google.maps.geometry.spherical.interpolate(
                                    start,
                                    end,
                                    fraction
                                );
                            break;
                        }

                        distanceSoFar += segmentLength;
                    }

                    const infoWindow = new window.google.maps.InfoWindow({
                        content: `
                            <div class="p-2 bg-black bg-opacity-75 text-white rounded-lg shadow-lg text-sm font-medium flex items-center justify-center">
                                <span class="mr-2">📏</span><span>Distance: ${distance}</span>
                            </div>
                        `,
                        position: midpoint
                    });

                    infoWindow.open(map);
                    setGlobalInfoWindow(infoWindow); // track globally
                } else {
                    console.error('Directions request failed due to', status);
                }
            }
        );

        return () => {
            if (directionsRendererRef.current) {
                directionsRendererRef.current.setMap(null);
                directionsRendererRef.current = null;
            }

            closeGlobalInfoWindow();
        };
    }, [map, origin, destination]);

    return null;
};

export default ConnectionLine;
