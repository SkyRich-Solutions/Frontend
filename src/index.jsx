import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';
import JSONTable from './Pages/Test';
import Test2 from './Pages/Test2';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <React.StrictMode>
        {/* <Test2 /> */}

        <JSONTable />
    </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
