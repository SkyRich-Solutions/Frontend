import {
    BarChart2,
    Menu,
    TrendingUp,
    MapPinIcon,
    CloudUploadIcon,
    ChartNoAxesCombined,
    NotepadTextIcon
} from 'lucide-react';
import { useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link } from 'react-router';

const SIDEBAR_ITEMS = [
    {
        name: 'Overview',
        icon: ChartNoAxesCombined,
        color: '#6366f1',
        href: '/'
    },
   
    {
        name: 'Upload',
        icon: CloudUploadIcon,
        color: '#8B5CF6',
        href: '/upload'
    },
    {
        name: 'Maps',
        icon: MapPinIcon,
        color: '#6EE7B7',
        href: '/map'
    },
    {
        name: 'Analytics',
        icon: TrendingUp,
        color: '#3B82F6',
        href: '/dashboard'
    },
    {
        name: 'Fault Report',
        icon: NotepadTextIcon,
        color: '#6366f1',
        href: '/fault-report'
    },
];

const Sidebar = () => {
    const [isSidebarOpen, setIsSidebarOpen] = useState(false);

    return (
        <motion.div
            className={`relative z-10 transition-all duration-300 ease-in-out flex-shrink-0 ${
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
