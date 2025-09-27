import React from "react";
import { useApp } from "../context/AppContext";

export default function Controls({ onPlay, onStop, onReset }) {
  const { state } = useApp();

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20 mb-4">
      <h3 className="font-bold text-gray-800 mb-3 flex items-center">
        🎮 <span className="ml-2">Controls</span>
      </h3>
      
      <div className="flex space-x-3">
        {/* Play Button */}
        <button
          onClick={onPlay}
          disabled={state.isPlaying}
          className={`flex items-center space-x-2 px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            state.isPlaying
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-gradient-to-r from-green-500 to-green-600 text-white hover:from-green-600 hover:to-green-700 shadow-lg hover:shadow-xl transform hover:scale-105'
          }`}
        >
          <span className="text-lg">▶️</span>
          <span className="text-sm">Play All</span>
        </button>

        {/* Stop Button */}
        <button
          onClick={onStop}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-red-500 to-red-600 text-white hover:from-red-600 hover:to-red-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span className="text-lg">⏹️</span>
          <span className="text-sm">Stop</span>
        </button>

        {/* Reset Button */}
        <button
          onClick={onReset}
          className="flex items-center space-x-2 px-4 py-2 rounded-lg font-medium bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:from-blue-600 hover:to-blue-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          <span className="text-lg">🔄</span>
          <span className="text-sm">Reset</span>
        </button>
      </div>

      {/* Status Indicator */}
      <div className="mt-3 flex items-center space-x-2">
        <div className={`w-3 h-3 rounded-full ${state.isPlaying ? 'bg-green-500 animate-pulse' : 'bg-gray-400'}`}></div>
        <span className="text-sm text-gray-600">
          {state.isPlaying ? 'Animation Running...' : 'Ready to Play'}
        </span>
      </div>
    </div>
  );
}
