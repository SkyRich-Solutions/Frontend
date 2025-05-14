import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router';
import App from './App';
import UploadPage from './Pages/Upload';
import MaterialComponentOverviewDashboard from './Pages/MaterialComponentOverviewDashboard';
import TurbineDashboard from './Pages/TurbineDashboard';
import MaterialComponentPredictionsDashboard from './Pages/MaterialComponentPredictionsDashboard';
import MaterialComponentHealthScoreDashboard from './Pages/MaterialComponentHealthScoreDashboard';
import TurbinePredictionsDashboard from './Pages/TurbinePredictionsDashboard';
import CategoryClassificationDashboard from './Pages/CategoryClassificationDashboard';
import Map from './Pages/Map';
import FaultReport from './Pages/FaultReport';
import DataOverviewOfComplianceDashboard from './Pages/DataOverviewOfComplianceDashboard';
import StartPage from './Pages/StartPage';


const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/DataOverviewOfComplianceDashboard',
                element: <DataOverviewOfComplianceDashboard />
            },

            {
                path: '/upload',
                element: <UploadPage />
            },
            {
                path: '/MaterialComponentOverviewDashboard',
                element: <MaterialComponentOverviewDashboard />
            },
            {
                path: '/turbineDashboard',
                element: <TurbineDashboard />
            },
            {
                path: '/MaterialComponentPredictionsDashboard',
                element: <MaterialComponentPredictionsDashboard />
            },
            {
                path: '/MaterialComponentHealthScoreDashboard',
                element: <MaterialComponentHealthScoreDashboard />
            },
            {
                path: '/turbinePredictionsDashboard',
                element: <TurbinePredictionsDashboard />
            },
            {
                path: '/map',
                element: <Map />
            },
            {
                path: '/fault-report',
                element: <FaultReport />
            },
            {
                path: '/categoryClassificationDashboard',
                element: <CategoryClassificationDashboard />
            },
            {
                path: '/',
                element: <StartPage />
            }
        ]
    }
]);

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        <RouterProvider router={router} />
    </React.StrictMode>
);
