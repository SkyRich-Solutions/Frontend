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
                    const duration = leg.duration.text; // Get the driving time
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
                            <div class="flex flex-col p-3 bg-white rounded-lg shadow-xl border border-gray-200 min-w-[160px]">
                            <div class="flex items-center justify-between mb-2">
                                <div class="text-sm font-semibold text-gray-700">Route Details</div>
                                <div class="w-2 h-2 rounded-full bg-blue-500 animate-pulse"></div>
                            </div>
                            <div class="flex items-center space-x-2 text-gray-800">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-blue-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span class="font-medium">${distance}</span>
                            </div>
                            <div class="flex items-center space-x-2 text-gray-800 mt-2">
                                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-green-500" viewBox="0 0 20 20" fill="currentColor">
                                    <path fillRule="evenodd" d="M5.05 4.05a7 7 0 119.9 9.9L10 18.9l-4.95-4.95a7 7 0 010-9.9zM10 11a2 2 0 100-4 2 2 0 000 4z" clipRule="evenodd" />
                                </svg>
                                <span class="font-medium">${duration}</span>
                            </div>
                            <div class="mt-2 pt-2 border-t border-gray-100 text-xs text-gray-500">
                                Estimated driving distance and time
                            </div>
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
