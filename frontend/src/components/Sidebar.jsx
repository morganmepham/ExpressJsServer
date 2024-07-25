import React from "react";
import { Link } from "react-router-dom";

const Sidebar = () => {
  return (
    <div className="w-64 h-screen bg-gray-800 text-white">
      <nav className="p-5">
        <ul className="space-y-2">
          <li>
            <Link to="/" className="block py-2 px-4 hover:bg-gray-700 rounded">
              Home
            </Link>
          </li>
          <li>
            <Link
              to="/templates"
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Templates
            </Link>
          </li>
          <li>
            <Link
              to="/workouts"
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Workouts
            </Link>
          </li>
          {/* <li>
            <Link
              to="/profile"
              className="block py-2 px-4 hover:bg-gray-700 rounded"
            >
              Profile
            </Link>
          </li> */}
        </ul>
      </nav>
    </div>
  );
};

export default Sidebar;
