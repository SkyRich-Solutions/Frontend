import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { RouterProvider, createHashRouter } from 'react-router';
import App from './App';
import UploadPage from './Pages/Upload';
import Dashboard from './Pages/Dashboard';
import Map from './Pages/Map';

const router = createHashRouter([
    {
        path: '/',
        element: <App />,
        children: [
            {
                path: '/upload',
                element: <UploadPage />
            },
            {
                path: '/dashboard',
                element: <Dashboard />
            },
            {
                path: '/map',
                element: <Map />
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
