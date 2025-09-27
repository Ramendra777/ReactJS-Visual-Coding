import React from "react";

export default function TopNavigation() {
  return (
    <div className="bg-purple-600 text-white px-4 py-2 flex items-center justify-between shadow-lg">
      {/* Left side - Logo and menu */}
      <div className="flex items-center space-x-6">
        <div className="font-bold text-xl">SCRATCH</div>
        <div className="flex space-x-4 text-sm">
          <button className="hover:bg-purple-700 px-2 py-1 rounded">Settings</button>
          <button className="hover:bg-purple-700 px-2 py-1 rounded">File</button>
          <button className="hover:bg-purple-700 px-2 py-1 rounded">Edit</button>
          <button className="hover:bg-purple-700 px-2 py-1 rounded">Tutorials</button>
          <button className="hover:bg-purple-700 px-2 py-1 rounded">Debug</button>
        </div>
      </div>
      
      {/* Right side - Auth buttons */}
      <div className="flex space-x-2">
        <button className="bg-white text-purple-600 px-3 py-1 rounded text-sm font-medium hover:bg-gray-100">
          Join Scratch
        </button>
        <button className="bg-purple-500 text-white px-3 py-1 rounded text-sm font-medium hover:bg-purple-400">
          Sign in
        </button>
      </div>
    </div>
  );
}
