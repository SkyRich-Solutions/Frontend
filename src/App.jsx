import { Outlet } from 'react-router';
import NavBar from './Components/NavBar';
import Sidebar from './Components/SideBar';
import Test2 from './Pages/Test2';
function App() {

    return (
        <div className="flex flex-col">
            <Sidebar/>
            <Test2/>
        
        </div>
    );
}

export default App;
