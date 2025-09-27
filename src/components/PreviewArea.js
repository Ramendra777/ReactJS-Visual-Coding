import React, { useRef, useEffect } from "react";
import { useApp } from "../context/AppContext";
import { AnimationEngine } from "../utils/AnimationEngine";
import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";

export default function PreviewArea() {
  const { state, dispatch } = useApp();
  const animationEngineRef = useRef(null);
  const canvasRef = useRef(null);

  const activeSprite = state.sprites.find(sprite => sprite.id === state.activeSprite);

  useEffect(() => {
    animationEngineRef.current = new AnimationEngine(dispatch, state);
  }, [dispatch, state]);

  const handlePlay = async () => {
    if (animationEngineRef.current) {
      dispatch({ type: 'SET_PLAYING', payload: true });
      try {
        await animationEngineRef.current.startAllAnimations();
      } finally {
        dispatch({ type: 'SET_PLAYING', payload: false });
      }
    }
  };

  const handleStop = () => {
    if (animationEngineRef.current) {
      animationEngineRef.current.stopAllAnimations();
      dispatch({ type: 'SET_PLAYING', payload: false });
    }
  };

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

  const renderSprite = (sprite) => {
    const SpriteComponent = sprite.type === 'cat' ? CatSprite : DogSprite;
    return <SpriteComponent />;
  };

  return (
    <div className="flex-none overflow-y-auto bg-gray-100 border-l border-gray-300" style={{ height: '100%' }}>
      {/* Stage Area */}
      <div className="p-3">
        <div className="flex justify-between items-center mb-2">
          <h3 className="font-semibold text-gray-800">Stage</h3>
          <div className="flex space-x-1">
            <button className="text-xs text-gray-600 hover:bg-gray-200 px-2 py-1 rounded">Small stage</button>
            <button className="text-xs text-gray-600 hover:bg-gray-200 px-2 py-1 rounded">Large stage</button>
            <button className="text-xs text-gray-600 hover:bg-gray-200 px-2 py-1 rounded">Full screen</button>
          </div>
        </div>
        
        {/* Stage Canvas */}
        <div className="bg-white border border-gray-300 rounded-lg h-64 relative overflow-hidden mb-4">
          {/* Play/Stop buttons */}
          <div className="absolute top-2 right-2 flex space-x-1">
            <button
              onClick={handlePlay}
              disabled={state.isPlaying}
              className="bg-green-500 hover:bg-green-600 disabled:bg-gray-400 text-white px-2 py-1 rounded text-xs"
            >
              ▶️
            </button>
            <button
              onClick={handleStop}
              className="bg-red-500 hover:bg-red-600 text-white px-2 py-1 rounded text-xs"
            >
              ⏹️
            </button>
          </div>
          
          {state.sprites.map(sprite => (
            <div
              key={sprite.id}
              className={`absolute transition-all duration-200 cursor-pointer ${
                sprite.id === state.activeSprite ? 'ring-2 ring-blue-500' : ''
              } ${sprite.isAnimating ? 'animate-pulse' : ''}`}
              style={{
                left: `${sprite.x + 150}px`,
                top: `${150 - sprite.y}px`,
                transform: `rotate(${sprite.direction}deg)`,
                transformOrigin: 'center'
              }}
              onClick={() => selectSprite(sprite.id)}
            >
              {renderSprite(sprite)}
              
              {/* Speech Bubble */}
              {animationEngineRef.current?.getSpeechBubble(sprite.id)?.visible && (
                <div className="absolute -top-16 left-1/2 transform -translate-x-1/2 bg-white border border-gray-300 rounded px-2 py-1 text-xs max-w-32 shadow-sm">
                  <div className="text-center">
                    {animationEngineRef.current.getSpeechBubble(sprite.id).message}
                  </div>
                  <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
                    <div className="w-0 h-0 border-l-2 border-r-2 border-t-2 border-transparent border-t-gray-300"></div>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* Sprite Information */}
      <div className="px-3 pb-3">
        <div className="bg-white border border-gray-300 rounded-lg p-3 mb-3">
          <h4 className="font-semibold text-gray-800 mb-2">Sprite</h4>
          {activeSprite && (
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Show:</span>
                <span className="text-gray-800">👁️</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Size:</span>
                <span className="text-gray-800">{activeSprite.size}%</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Direction:</span>
                <span className="text-gray-800">{activeSprite.direction}°</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">x:</span>
                <span className="text-gray-800">{Math.round(activeSprite.x)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">y:</span>
                <span className="text-gray-800">{Math.round(activeSprite.y)}</span>
              </div>
            </div>
          )}
        </div>

        {/* Sprites List */}
        <div>
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-800">Sprites</h4>
            <button
              onClick={addSprite}
              className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs"
            >
              + Choose a Sprite
            </button>
          </div>
          
          <div className="space-y-2">
            {state.sprites.map(sprite => (
              <div
                key={sprite.id}
                className={`p-2 border rounded cursor-pointer transition-all ${
                  sprite.id === state.activeSprite ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
                onClick={() => selectSprite(sprite.id)}
              >
                <div className="flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    <div className={`w-8 h-8 rounded flex items-center justify-center text-white text-sm ${
                      sprite.type === 'cat' ? 'bg-orange-400' : 'bg-yellow-600'
                    }`}>
                      {sprite.type === 'cat' ? '🐱' : '🐶'}
                    </div>
                    <span className="text-sm font-medium">{sprite.name}</span>
                    {sprite.isAnimating && <span className="text-green-500 text-sm">●</span>}
                  </div>
                  {state.sprites.length > 1 && (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        removeSprite(sprite.id);
                      }}
                      className="text-red-500 hover:text-red-700 text-sm"
                    >
                      🗑️
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Stage Backdrops */}
        <div className="mt-4">
          <div className="flex justify-between items-center mb-2">
            <h4 className="font-semibold text-gray-800">Stage</h4>
            <button className="bg-purple-500 hover:bg-purple-600 text-white px-2 py-1 rounded text-xs">
              + Choose a Backdrop
            </button>
          </div>
          <div className="bg-white border border-gray-300 rounded p-2">
            <div className="text-sm text-gray-600">Backdrops 1</div>
            <div className="w-16 h-12 bg-white border border-gray-300 rounded mt-1"></div>
          </div>
        </div>

        {/* Collision Info */}
        {state.collisions.length > 0 && (
          <div className="mt-4 p-2 bg-yellow-100 border border-yellow-300 rounded animate-pulse">
            <div className="flex justify-between items-start">
              <div>
                <h4 className="font-semibold text-yellow-800 text-sm">💥 Collision Detected!</h4>
                <p className="text-xs text-yellow-700">Animations have been swapped!</p>
              </div>
              <button
                onClick={() => dispatch({ type: 'CLEAR_COLLISIONS' })}
                className="text-yellow-600 hover:text-yellow-800 text-sm"
              >
                ✕
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
