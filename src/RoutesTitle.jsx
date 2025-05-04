// components/RouteTitleManager.jsx
import { useEffect } from 'react';
import { useLocation } from 'react-router';

const routeTitles = {
    '/uploadedDataOverview': 'Overview of Compliance',
    '/upload': 'Upload Page',
    '/materialDashboard': 'Dashboard',
    '/turbineDashboard': 'Turbine Dashboard',
    '/materialPredictionsDashboard': 'Material Predictions Dashboard',
    '/materialPredictionsDashboard2': 'Material Predictions Dashboard 2',
    '/turbinePredictionsDashboard': 'Turbine Predictions Dashboard',
    '/categoryClassificationDashboard': 'Category Classification Dashboard',
    '/map': 'Map Overview',
    '/fault-report': 'Fault Report',
    '/': 'Start Page',
};

export default function RouteTitleManager() {
    const location = useLocation();

    useEffect(() => {
        const title = routeTitles[location.pathname] || 'My App';
        document.title = title;
    }, [location.pathname]);

    return null; // This component doesn't render anything
}