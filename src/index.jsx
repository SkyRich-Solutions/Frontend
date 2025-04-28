import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router';
import App from './App';
import UploadPage from './Pages/Upload';
import Dashboard from './Pages/Dashboard';
import TurbineDashboard from './Pages/TurbineDashboard';
import MaterialPredictionsDashboard from './Pages/MaterialPredictionsDashboard';
import MaterialPredictionsDashboard2 from './Pages/MaterialPredictionsDashboard2';
import TurbinePredictionsDashboard from './Pages/TurbinePredictionsDashboard';
import Map from './Pages/Map';
import FaultReport from './Pages/FaultReport';
import MainPage from './Pages/MainPage';

const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/uploadedDataOverview',
                element: <MainPage />
            },

            {
                path: '/upload',
                element: <UploadPage />
            },
            {
                path: '/materialDashboard',
                element: <Dashboard />
            },
            {
                path: '/turbineDashboard',
                element: <TurbineDashboard />
            },
            {
                path: '/materialPredictionsDashboard',
                element: <MaterialPredictionsDashboard />
            },
            {
                path: '/materialPredictionsDashboard2',
                element: <MaterialPredictionsDashboard2 />
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
