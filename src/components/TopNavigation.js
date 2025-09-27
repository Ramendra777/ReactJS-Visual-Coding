import React from "react";

export default function TopNavigation() {
  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-white text-gray-800 px-6 py-3 flex items-center justify-between border-b border-gray-200">
      {/* Left side - Professional Logo and menu */}
      <div className="flex items-center space-x-8">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-orange-500 rounded-lg flex items-center justify-center">
            <span className="text-white text-xl font-bold">S</span>
          </div>
          <span className="font-bold text-xl text-gray-800">Scratch</span>
        </div>
        <div className="flex space-x-6 text-sm">
          <button className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200">
            File
          </button>
          <button className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200">
            Edit
          </button>
          <button className="text-gray-600 hover:text-gray-800 hover:bg-gray-100 px-3 py-2 rounded-lg transition-all duration-200">
            Tutorials
          </button>
        </div>
      </div>
      
      {/* Center - Project Title */}
      <div className="text-center">
        <div className="font-semibold text-lg text-gray-800">Visual Code Blocks</div>
        <div className="text-sm text-orange-600 font-medium">🎯 Hero Feature: Collision-Based Animation Swap</div>
      </div>
      
      {/* Right side - User Actions */}
      <div className="flex items-center space-x-4">
        <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200">
          Share
        </button>
        <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center">
          <span className="text-gray-600 text-sm">👤</span>
        </div>
      </div>
    </div>
  );
}
