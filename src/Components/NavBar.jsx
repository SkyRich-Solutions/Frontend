import React from 'react';
import { Link } from 'react-router';


const NavBar = () => {
  return (
    <nav className="bg-slate-700 p-4">
      <div className="flex items-center">
        <span className="text-white text-2xl font-bold ml-2 font-aladin">SkyRich</span>
        <div className="ml-auto space-x-4">
          <Link
            to="/"
            className="text-white px-3 py-2 border border-gray-500 rounded transition duration-500 ease-in-out hover:bg-gray-100 hover:rounded-full hover:text-black"
          >
            Home
          </Link>
          <Link
            to="/about"
            className="text-white px-3 py-2 border border-gray-500 rounded transition duration-500 ease-in-out hover:bg-gray-100 hover:rounded-full hover:text-black"
          >
            About
          </Link>
          <Link
            to="/data"
            className="text-white px-3 py-2 border border-gray-500 rounded transition duration-500 ease-in-out hover:bg-gray-100 hover:rounded-full hover:text-black"
          >
            Info
          </Link>
          <Link
            to="/manage"
            className="text-white px-3 py-2 border border-gray-500 rounded transition duration-500 ease-in-out hover:bg-gray-100 hover:rounded-full hover:text-black"
          >
            DashBoard
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default NavBar;