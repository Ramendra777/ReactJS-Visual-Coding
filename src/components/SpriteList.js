import React from "react";
import { useApp } from "../context/AppContext";

export default function SpriteList() {
  const { state, dispatch } = useApp();

  const addSprite = () => {
    dispatch({ type: 'ADD_SPRITE' });
  };

  const removeSprite = (spriteId) => {
    if (state.sprites.length > 1) {
      dispatch({ type: 'REMOVE_SPRITE', payload: spriteId });
    }
  };

  const selectSprite = (spriteId) => {
    dispatch({ type: 'SET_ACTIVE_SPRITE', payload: spriteId });
  };

  return (
    <div className="bg-white/60 backdrop-blur-md rounded-xl p-4 shadow-lg border border-white/20">
      <div className="flex justify-between items-center mb-4">
        <h3 className="font-bold text-gray-800 flex items-center">
          🎭 <span className="ml-2">Sprites</span>
        </h3>
        <button
          onClick={addSprite}
          className="bg-gradient-to-r from-purple-500 to-purple-600 text-white px-3 py-1 rounded-lg text-sm font-medium hover:from-purple-600 hover:to-purple-700 shadow-lg hover:shadow-xl transform hover:scale-105 transition-all duration-200"
        >
          + Add Sprite
        </button>
      </div>
      
      <div className="space-y-3">
        {state.sprites.map(sprite => (
          <div
            key={sprite.id}
            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 transform hover:scale-102 ${
              sprite.id === state.activeSprite 
                ? 'bg-gradient-to-r from-blue-100 to-purple-100 border-2 border-blue-400 shadow-lg' 
                : 'bg-white/40 border border-gray-200 hover:bg-white/60 hover:shadow-md'
            }`}
            onClick={() => selectSprite(sprite.id)}
          >
            <div className="flex justify-between items-center">
              <div className="flex items-center space-x-3">
                <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-2xl shadow-md ${
                  sprite.type === 'cat' 
                    ? 'bg-gradient-to-br from-orange-400 to-orange-500' 
                    : 'bg-gradient-to-br from-yellow-500 to-yellow-600'
                }`}>
                  {sprite.type === 'cat' ? '🐱' : '🐶'}
                </div>
                <div>
                  <div className="font-semibold text-gray-800">{sprite.name}</div>
                  <div className="text-xs text-gray-600">
                    x: {Math.round(sprite.x)}, y: {Math.round(sprite.y)}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {sprite.isAnimating && (
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                    <span className="text-xs text-green-600 font-medium">Active</span>
                  </div>
                )}
                {state.sprites.length > 1 && (
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeSprite(sprite.id);
                    }}
                    className="text-red-500 hover:text-red-700 hover:bg-red-100 p-1 rounded-lg transition-all duration-200"
                  >
                    🗑️
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
