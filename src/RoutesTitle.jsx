import { useEffect } from 'react';
import { useLocation } from 'react-router';

const routeTitles = {
    '/DataOverviewOfComplianceDashboard': 'Overview of Compliance Dashboard',
    '/upload': 'Upload Page',
    '/MaterialComponentOverviewDashboard': 'Material Component Overview Dashboard',
    '/turbineDashboard': 'Turbine Dashboard',
    '/MaterialComponentPredictionsDashboard': 'Material Component Predictions Dashboard',
    '/MaterialComponentHealthScoreDashboard': 'Material Component Health Score Dashboard',
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