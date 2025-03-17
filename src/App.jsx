import { Outlet } from 'react-router';
import { SocketProvider } from './Socket/SocketContext';
import Sidebar from './Components/SideBar';

function App() {
    return (
        <SocketProvider>
        <div className="flex h-dvh w-full bg-gray-900 text-gray-100 overflow-hidden">
            <div className='fixed inset-0 z-0'>
                <div className='absolute inset-0 bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900 opacity-80'/>
                <div className=' absolute inset-0 backdrop-blur-sm'/>
            </div>
            <Sidebar/>
           
                <Outlet/>
            
        </div>
        </SocketProvider>
    );
}

export default App;
