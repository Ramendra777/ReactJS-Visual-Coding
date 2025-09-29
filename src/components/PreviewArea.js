import React, { useRef, useEffect, useState } from "react";
import { useApp } from "../context/AppContext";
import { AnimationEngine } from "../utils/AnimationEngine";
import CatSprite from "./CatSprite";
import DogSprite from "./DogSprite";
import PikachuSprite from "./sprites/PikachuSprite";
import JerrySprite from "./sprites/JerrySprite";

// Speech Bubble Component
function SpeechBubble({ bubble }) {
  const isThinking = bubble.type === 'think';
  
  return (
    <div className={`absolute -top-20 left-1/2 transform -translate-x-1/2 px-4 py-3 text-sm max-w-48 shadow-lg animate-bounce ${
      isThinking 
        ? 'bg-purple-100 border-2 border-purple-300 rounded-3xl' 
        : 'bg-white/95 backdrop-blur-sm border-2 border-blue-200 rounded-xl'
    }`}>
      <div className="text-center font-medium text-gray-800 flex items-center justify-center">
        {isThinking ? (
          <span className="mr-2 text-purple-600">💭</span>
        ) : (
          <span className="mr-2 text-blue-600">💬</span>
        )}
        {bubble.message}
      </div>
      
      {/* Speech bubble tail */}
      {!isThinking && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full">
          <div className="w-0 h-0 border-l-4 border-r-4 border-t-4 border-transparent border-t-blue-200"></div>
        </div>
      )}
      
      {/* Think bubble dots */}
      {isThinking && (
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full flex space-x-1 mt-1">
          <div className="w-2 h-2 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '0ms'}}></div>
          <div className="w-1.5 h-1.5 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '150ms'}}></div>
          <div className="w-1 h-1 bg-purple-300 rounded-full animate-bounce" style={{animationDelay: '300ms'}}></div>
        </div>
      )}
    </div>
  );
}

export default function PreviewArea() {
  const { state, dispatch } = useApp();
  const animationEngineRef = useRef(null);
  const canvasRef = useRef(null);
  const [dragState, setDragState] = useState({
    isDragging: false,
    draggedSprite: null,
    dragOffset: { x: 0, y: 0 }
  });

  const activeSprite = state.sprites.find(sprite => sprite.id === state.activeSprite);

  useEffect(() => {
    if (!animationEngineRef.current) {
      animationEngineRef.current = new AnimationEngine(dispatch, state);
    } else {
      // Update the state reference in the existing engine
      animationEngineRef.current.updateState(state);
    }
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

  const handleReset = () => {
    dispatch({ type: 'RESET_SPRITES' });
  };

  // Drag and Drop handlers
  const handleMouseDown = (e, sprite) => {
    e.preventDefault();
    const rect = e.currentTarget.parentElement.getBoundingClientRect();
    const stageRect = rect;
    
    setDragState({
      isDragging: true,
      draggedSprite: sprite.id,
      dragOffset: {
        x: e.clientX - (stageRect.left + stageRect.width / 2 + sprite.x),
        y: e.clientY - (stageRect.top + stageRect.height / 2 - sprite.y)
      }
    });
    
    // Set as active sprite when dragging
    dispatch({ type: 'SET_ACTIVE_SPRITE', payload: sprite.id });
  };

  const handleMouseMove = (e) => {
    if (!dragState.isDragging || !dragState.draggedSprite) return;
    
    const stageElement = e.currentTarget;
    const rect = stageElement.getBoundingClientRect();
    
    // Calculate new position relative to stage center
    const newX = e.clientX - rect.left - rect.width / 2 - dragState.dragOffset.x;
    const newY = -(e.clientY - rect.top - rect.height / 2 - dragState.dragOffset.y);
    
    // Constrain to stage boundaries (optional)
    const maxX = rect.width / 2 - 30;
    const maxY = rect.height / 2 - 30;
    const constrainedX = Math.max(-maxX, Math.min(maxX, newX));
    const constrainedY = Math.max(-maxY, Math.min(maxY, newY));
    
    dispatch({
      type: 'UPDATE_SPRITE_POSITION',
      payload: {
        spriteId: dragState.draggedSprite,
        x: constrainedX,
        y: constrainedY
      }
    });
  };

  const handleMouseUp = () => {
    setDragState({
      isDragging: false,
      draggedSprite: null,
      dragOffset: { x: 0, y: 0 }
    });
  };

  // Add global mouse event listeners
  useEffect(() => {
    if (dragState.isDragging) {
      const handleGlobalMouseMove = (e) => handleMouseMove(e);
      const handleGlobalMouseUp = () => handleMouseUp();
      
      document.addEventListener('mousemove', handleGlobalMouseMove);
      document.addEventListener('mouseup', handleGlobalMouseUp);
      
      return () => {
        document.removeEventListener('mousemove', handleGlobalMouseMove);
        document.removeEventListener('mouseup', handleGlobalMouseUp);
      };
    }
  }, [dragState.isDragging, dragState.draggedSprite, dragState.dragOffset]);

  const renderSprite = (sprite) => {
    const spriteComponents = {
      cat: CatSprite,
      dog: DogSprite,
      pikachu: PikachuSprite,
      jerry: JerrySprite
    };
    const SpriteComponent = spriteComponents[sprite.type] || CatSprite;
    return <SpriteComponent />;
  };

  return (
    <div className="h-full flex flex-col">
      {/* Professional Stage Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <div className="flex justify-between items-center">
          <h3 className="font-semibold text-gray-800">Stage</h3>
          <div className="flex items-center space-x-3">
            {/* Professional Controls */}
            <div className="flex items-center space-x-2 bg-gray-100 rounded-lg p-1">
              <button
                onClick={handlePlay}
                disabled={state.isPlaying}
                className={`flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium transition-all duration-200 ${
                  state.isPlaying
                    ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                    : 'bg-green-500 text-white hover:bg-green-600'
                }`}
              >
                <span>▶</span>
              </button>
              <button
                onClick={handleStop}
                className="flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium bg-red-500 text-white hover:bg-red-600 transition-all duration-200"
              >
                <span>⏹</span>
              </button>
              <button
                onClick={handleReset}
                className="flex items-center space-x-1 px-3 py-1 rounded-md text-sm font-medium bg-blue-500 text-white hover:bg-blue-600 transition-all duration-200"
              >
                <span>↻</span>
              </button>
            </div>
            
            {/* Stage Size Controls */}
            <div className="flex items-center space-x-1 text-sm">
              <button className="text-gray-600 hover:text-gray-800 px-2 py-1 hover:bg-gray-100 rounded transition-all duration-200">
                Small stage
              </button>
              <button className="text-gray-600 hover:text-gray-800 px-2 py-1 hover:bg-gray-100 rounded transition-all duration-200">
                Full screen
              </button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Professional Stage Canvas */}
      <div className="flex-1 p-4">
        <div 
          className="bg-white border border-gray-300 rounded-lg h-full relative overflow-hidden shadow-sm cursor-default"
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
        >
          {/* Clean Stage Background */}
          <div className="absolute inset-0 bg-white"></div>
          
          {state.sprites.map(sprite => (
            <div
              key={sprite.id}
              className={`absolute transition-all duration-200 select-none ${
                dragState.draggedSprite === sprite.id ? 'cursor-grabbing z-50' : 'cursor-grab hover:scale-105'
              } ${sprite.id === state.activeSprite ? 'ring-4 ring-blue-400 ring-opacity-50' : ''} ${
                sprite.isAnimating ? 'animate-bounce' : ''
              }`}
              style={{
                left: `calc(50% + ${sprite.x}px - 30px)`,
                top: `calc(50% - ${sprite.y}px - 30px)`,
                transform: `${sprite.id === state.activeSprite ? 'scale(1.1)' : 'scale(1)'}`, // Keep sprites upright, no rotation
                transformOrigin: 'center',
                width: '60px',
                height: '60px',
                transition: dragState.draggedSprite === sprite.id ? 'none' : 'all 0.2s ease'
              }}
              onMouseDown={(e) => handleMouseDown(e, sprite)}
              onClick={() => dispatch({ type: 'SET_ACTIVE_SPRITE', payload: sprite.id })}
            >
              {renderSprite(sprite)}
              
              {/* Direction Indicator - Small Arrow */}
              <div 
                className="absolute -top-2 -right-2 w-4 h-4 bg-blue-500 rounded-full flex items-center justify-center text-white text-xs"
                style={{
                  transform: `rotate(${sprite.direction}deg)`,
                  transformOrigin: 'center'
                }}
                title={`Facing ${sprite.direction}°`}
              >
                →
              </div>
              
              {/* Enhanced Speech/Think Bubble */}
              {animationEngineRef.current?.getSpeechBubble(sprite.id)?.visible && (
                <SpeechBubble 
                  bubble={animationEngineRef.current.getSpeechBubble(sprite.id)} 
                />
              )}
            </div>
          ))}
        </div>
        
      </div>
      
      {/* Professional Sprite Management */}
      <div className="bg-white border-t border-gray-200 p-4">
        <div className="flex justify-between items-center">
          {/* Sprite Info */}
          {activeSprite && (
            <div className="flex items-center space-x-6 text-sm">
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">Sprite:</span>
                <span className="font-medium text-gray-800">{activeSprite.name}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">x:</span>
                <span className="font-mono text-gray-800">{Math.round(activeSprite.x)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">y:</span>
                <span className="font-mono text-gray-800">{Math.round(activeSprite.y)}</span>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-gray-500">direction:</span>
                <span className="font-mono text-gray-800">{activeSprite.direction}°</span>
              </div>
            </div>
          )}
          
          {/* Professional Sprites List */}
          <div className="flex items-center space-x-3">
            <span className="text-sm text-gray-500">Sprites:</span>
            <div className="flex items-center space-x-2">
              {state.sprites.map(sprite => (
                <div
                  key={sprite.id}
                  className={`relative w-12 h-12 rounded-lg cursor-pointer transition-all duration-200 flex items-center justify-center text-xl border-2 ${
                    sprite.id === state.activeSprite 
                      ? 'border-blue-500 bg-blue-50 shadow-md' 
                      : 'border-gray-200 bg-white hover:border-gray-300 hover:shadow-sm'
                  }`}
                  onClick={() => dispatch({ type: 'SET_ACTIVE_SPRITE', payload: sprite.id })}
                  title={sprite.name}
                >
                  {sprite.type === 'cat' ? '🐱' : 
                   sprite.type === 'dog' ? '🐶' : 
                   sprite.type === 'pikachu' ? '⚡' : 
                   sprite.type === 'jerry' ? '🐭' : '🐱'}
                  {sprite.isAnimating && (
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full animate-pulse"></div>
                  )}
                </div>
              ))}
              <button
                onClick={() => dispatch({ type: 'ADD_SPRITE' })}
                className="w-12 h-12 rounded-lg border-2 border-dashed border-gray-300 text-gray-400 hover:border-gray-400 hover:text-gray-600 flex items-center justify-center transition-all duration-200"
                title="Choose a Sprite"
              >
                +
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Professional Hero Feature - Collision Detection Display */}
      {state.collisions.length > 0 && (
        <div className="bg-orange-100 border border-orange-300 rounded-lg p-4 m-4">
          <div className="flex justify-between items-start">
            <div className="flex-1">
              <h4 className="font-semibold text-orange-800 text-lg flex items-center mb-2">
                💥 <span className="ml-2">HERO FEATURE - ANIMATION SWAP!</span>
              </h4>
              <p className="text-orange-700 text-sm mb-3">
                Hero Feature: Animation blocks exchanged between colliding sprites!
              </p>
              
              <div className="bg-white rounded-lg p-3 mb-3">
                <div className="text-center text-sm">
                  <div className="font-medium text-gray-800 mb-2">🔄 ANIMATION BLOCKS SWAPPED!</div>
                  <div className="text-gray-600 mb-2">
                    🎯 <strong>Actions Exchanged</strong> - Sprites now perform each other's behaviors
                  </div>
                  <div className="text-gray-600 mb-2">
                    🎭 <strong>Visual Appearance Preserved</strong> - Cat still looks like Cat, Dog still looks like Dog
                  </div>
                  <div className="text-gray-600">
                    ✨ <strong>Behavior Swap</strong> - Cat performs Dog's actions and vice versa
                  </div>
                </div>
              </div>
              
              <p className="text-orange-700 text-sm font-medium">
                🎯 Assignment Hero Feature: Action-Based Animation Swap System
              </p>
            </div>
            <button
              onClick={() => dispatch({ type: 'CLEAR_COLLISIONS' })}
              className="text-orange-600 hover:text-orange-800 hover:bg-orange-200 p-1 rounded transition-all duration-200 ml-4"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
