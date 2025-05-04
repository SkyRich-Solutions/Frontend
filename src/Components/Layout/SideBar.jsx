import React from 'react';
import {
    BarChart2,
    Menu,
    TrendingUp,
    MapPinIcon,
    CloudUploadIcon,
    NotepadTextIcon,
    PackageIcon,
    PackageCheckIcon,
    WindIcon,
    ChartNoAxesCombined
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router';

const SIDEBAR_ITEMS = [
    {
        name: 'Overview of Compliance',
        icon: BarChart2, // Represents analytics overview
        color: '#9966FF',
        href: '/uploadedDataOverview'
    },
    {
        name: 'Map Overview',
        icon: MapPinIcon,
        color: '#36A2EB',
        href: '/map'
    },
    {
        name: 'Material Component Overview',
        icon: PackageIcon, // Suits materials/components
        color: '#FFCE56',
        href: '/materialDashboard'
    },
    {
        name: 'Turbine Design Overview',
        icon: WindIcon, // Matches turbines
        color: '#FF6384',
        href: '/turbineDashboard'
    },
    {
        name: 'Material Component Predictions',
        icon: TrendingUp, // For predictions/trends
        color: '#4BC04B',
        href: '/materialPredictionsDashboard'
    },
    {
        name: 'Material Component Health Scores',
        icon: PackageCheckIcon, // Checked package for health
        color: '#008080',
        href: '/materialPredictionsDashboard2'
    },
    {
        name: 'Turbine Model Health Scores',
        icon: BarChart2, // Same analytical symbol as above
        color: '#FF8C00',
        href: '/turbinePredictionsDashboard'
    }, 
    {
        name: 'Category Classification Dashboard',
        icon: ChartNoAxesCombined, // Implies grouped data or classification
        color: '#FF4500',
        href: '/categoryClassificationDashboard'
    },
    {
        name: 'CSV Upload Dashboard',
        icon: CloudUploadIcon,
        color: '#FF9F40',
        href: '/upload'
    },
    {
        name: 'Fault Report Upload',
        icon: NotepadTextIcon,
        color: '#6A5ACD',
        href: '/fault-report'
    },
];


const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <motion.div
            className={`relative z-20 transition-all duration-300 ease-in-out flex-shrink-0 ${
                isSidebarOpen ? 'w-64' : 'w-20'
            }`}
            animate={{ width: isSidebarOpen ? 160 : 80 }}
        >
            <div className='h-full fixed bg-gray-800 bg-opacity-50 backdrop-blur-md p-4 flex flex-col border-r border-gray-700'>
                <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className='p-2 rounded-full hover:bg-gray-700 transition-colors max-w-fit'
                >
                    <Menu size={24} />
                </motion.button>

                <nav className='mt-8 flex-grow'>
                    {SIDEBAR_ITEMS.map((item) => (
                        <Link key={item.href} to={item.href}>
                            <motion.div className='flex items-center p-4 text-sm font-medium rounded-lg hover:bg-gray-700 transition-colors mb-2'>
                                <item.icon
                                    data-testid="sidebar-icon"
                                    size={20}
                                    style={{
                                        color: item.color,
                                        minWidth: '20px'
                                    }}
                                />
                                <AnimatePresence>
                                    {isSidebarOpen && (
                                        <motion.span
                                            className='ml-4 whitespace-nowrap'
                                            initial={{ opacity: 0, width: 0 }}
                                            animate={{
                                                opacity: 1,
                                                width: 'auto'
                                            }}
                                            exit={{ opacity: 0, width: 0 }}
                                            transition={{
                                                duration: 0.2,
                                                delay: 0.3
                                            }}
                                        >
                                            {item.name}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.div>
                        </Link>
                    ))}
                </nav>
            </div>
        </motion.div>
    );
};

export default Sidebar;