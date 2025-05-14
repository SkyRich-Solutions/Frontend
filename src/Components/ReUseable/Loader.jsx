import React from 'react';

const Loader = ({ upload = false }) => {
    if (upload) {
        // Compact loader for upload buttons
        return (
            <div className='flex justify-center items-center h-5'>
                <div className='loader'>
                    <div className='jimu-primary-loading'></div>
                </div>

                <style>{`
                    .jimu-primary-loading:before,
                    .jimu-primary-loading:after {
                        position: absolute;
                        top: 0;
                        content: '';
                    }

                    .jimu-primary-loading:before {
                        left: -14px;
                    }

                    .jimu-primary-loading:after {
                        left: 14px;
                        -webkit-animation-delay: 0.32s !important;
                        animation-delay: 0.32s !important;
                    }

                    .jimu-primary-loading:before,
                    .jimu-primary-loading:after,
                    .jimu-primary-loading {
                        background: #FFFFFF;
                        -webkit-animation: loading-keys-app-loading 0.8s infinite ease-in-out;
                        animation: loading-keys-app-loading 0.8s infinite ease-in-out;
                        width: 6px;
                        height: 14px;
                    }

                    .jimu-primary-loading {
                        text-indent: -9999em;
                        margin: auto;
                        position: relative;
                        width: 6px;
                        height: 14px;
                        -webkit-animation-delay: 0.16s !important;
                        animation-delay: 0.16s !important;
                    }

                    @-webkit-keyframes loading-keys-app-loading {
                        0%, 80%, 100% {
                            opacity: 0.75;
                            box-shadow: 0 0 #FFFFFF;
                            height: 14px;
                        }

                        40% {
                            opacity: 1;
                            box-shadow: 0 -4px #FFFFFF;
                            height: 18px;
                        }
                    }

                    @keyframes loading-keys-app-loading {
                        0%, 80%, 100% {
                            opacity: 0.75;
                            box-shadow: 0 0 #FFFFFF;
                            height: 14px;
                        }

                        40% {
                            opacity: 1;
                            box-shadow: 0 -4px #FFFFFF;
                            height: 18px;
                        }
                    }
                `}</style>
            </div>
        );
    }

    // Larger or different loader for full-screen or generic use
    return (
        <>
            <div class='loader'>
                <div class='box box-1'>
                    <div class='side-left'></div>
                    <div class='side-right'></div>
                    <div class='side-top'></div>
                </div>
                <div class='box box-2'>
                    <div class='side-left'></div>
                    <div class='side-right'></div>
                    <div class='side-top'></div>
                </div>
                <div class='box box-3'>
                    <div class='side-left'></div>
                    <div class='side-right'></div>
                    <div class='side-top'></div>
                </div>
                <div class='box box-4'>
                    <div class='side-left'></div>
                    <div class='side-right'></div>
                    <div class='side-top'></div>
                </div>
            </div>
            <style>
                {`
                    /* From Uiverse.io by csozidev */ 
                    /* 3D tower loader made by: csozi | Website: www.csozi.hu*/

                    .loader {
                    scale: 3;
                    height: 50px;
                    width: 40px;
                    }

                    .box {
                    position: relative;
                    opacity: 0;
                    left: 10px;
                    }

                    .side-left {
                    position: absolute;
                    background-color: #286cb5;
                    width: 19px;
                    height: 5px;
                    transform: skew(0deg, -25deg);
                    top: 14px;
                    left: 10px;
                    }

                    .side-right {
                    position: absolute;
                    background-color: #2f85e0;
                    width: 19px;
                    height: 5px;
                    transform: skew(0deg, 25deg);
                    top: 14px;
                    left: -9px;
                    }

                    .side-top {
                    position: absolute;
                    background-color: #5fa8f5;
                    width: 20px;
                    height: 20px;
                    rotate: 45deg;
                    transform: skew(-20deg, -20deg);
                    }

                    .box-1 {
                    animation: from-left 4s infinite;
                    }

                    .box-2 {
                    animation: from-right 4s infinite;
                    animation-delay: 1s;
                    }

                    .box-3 {
                    animation: from-left 4s infinite;
                    animation-delay: 2s;
                    }

                    .box-4 {
                    animation: from-right 4s infinite;
                    animation-delay: 3s;
                    }

                    @keyframes from-left {
                    0% {
                        z-index: 20;
                        opacity: 0;
                        translate: -20px -6px;
                    }

                    20% {
                        z-index: 10;
                        opacity: 1;
                        translate: 0px 0px;
                    }

                    40% {
                        z-index: 9;
                        translate: 0px 4px;
                    }

                    60% {
                        z-index: 8;
                        translate: 0px 8px;
                    }

                    80% {
                        z-index: 7;
                        opacity: 1;
                        translate: 0px 12px;
                    }

                    100% {
                        z-index: 5;
                        translate: 0px 30px;
                        opacity: 0;
                    }
                    }

                    @keyframes from-right {
                    0% {
                        z-index: 20;
                        opacity: 0;
                        translate: 20px -6px;
                    }

                    20% {
                        z-index: 10;
                        opacity: 1;
                        translate: 0px 0px;
                    }

                    40% {
                        z-index: 9;
                        translate: 0px 4px;
                    }

                    60% {
                        z-index: 8;
                        translate: 0px 8px;
                    }

                    80% {
                        z-index: 7;
                        opacity: 1;
                        translate: 0px 12px;
                    }

                    100% {
                        z-index: 5;
                        translate: 0px 30px;
                        opacity: 0;
                    }
                    }
                `}
            </style>
        </>
    );
};

export default Loader;
