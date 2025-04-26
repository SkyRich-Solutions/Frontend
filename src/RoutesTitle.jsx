// components/RouteTitleManager.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const routeTitles = {
    '/': 'Main Page',
    '/upload': 'Upload Page',
    '/dashboard': 'Dashboard',
    '/turbineDashboard': 'Turbine Dashboard',
    '/materialPredictionsDashboard': 'Material Predictions Dashboard',
    '/materialPredictionsDashboard2': 'Material Predictions Dashboard 2',
    '/turbinePredictionsDashboard': 'Turbine Predictions Dashboard',
    '/map': 'Map Page',
    '/fault-report': 'Fault Report'
};

export default function RouteTitleManager() {
    const location = useLocation();

    useEffect(() => {
        const title = routeTitles[location.pathname] || 'My App';
        document.title = title;
    }, [location.pathname]);

    return null; // This component doesn't render anything
}