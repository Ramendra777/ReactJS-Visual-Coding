import React, { createContext, useContext, useReducer } from 'react';

const AppContext = createContext();

// Initial state
const initialState = {
  sprites: [
    {
      id: 'sprite1',
      name: 'Cat',
      type: 'cat',
      x: -80,  // Positioned to collide with Dog
      y: 0,
      direction: 90,
      size: 100,
      visible: true,
      blocks: [],
      isAnimating: false
    },
    {
      id: 'sprite2',
      name: 'Dog',
      type: 'dog',
      x: 80,   // Positioned to collide with Cat
      y: 0,
      direction: 90,
      size: 100,
      visible: true,
      blocks: [],
      isAnimating: false
    }
  ],
  activeSprite: 'sprite1',
  isPlaying: false,
  collisions: []
};

// Action types
export const ActionTypes = {
  ADD_SPRITE: 'ADD_SPRITE',
  REMOVE_SPRITE: 'REMOVE_SPRITE',
  SET_ACTIVE_SPRITE: 'SET_ACTIVE_SPRITE',
  ADD_BLOCK_TO_SPRITE: 'ADD_BLOCK_TO_SPRITE',
  REMOVE_BLOCK_FROM_SPRITE: 'REMOVE_BLOCK_FROM_SPRITE',
  UPDATE_SPRITE_POSITION: 'UPDATE_SPRITE_POSITION',
  UPDATE_SPRITE_DIRECTION: 'UPDATE_SPRITE_DIRECTION',
  SET_PLAYING: 'SET_PLAYING',
  SET_SPRITE_ANIMATING: 'SET_SPRITE_ANIMATING',
  DETECT_COLLISION: 'DETECT_COLLISION',
  SWAP_ANIMATIONS: 'SWAP_ANIMATIONS',
  CLEAR_COLLISIONS: 'CLEAR_COLLISIONS'
};

// Reducer
function appReducer(state, action) {
  switch (action.type) {
    case ActionTypes.ADD_SPRITE:
      const spriteTypes = ['cat', 'dog'];
      const spriteType = spriteTypes[state.sprites.length % spriteTypes.length];
      const spriteNames = { cat: 'Cat', dog: 'Dog' };
      const newSprite = {
        id: `sprite${Date.now()}`,
        name: `${spriteNames[spriteType]}${state.sprites.length + 1}`,
        type: spriteType,
        x: Math.random() * 200 - 100,
        y: Math.random() * 200 - 100,
        direction: 90,
        size: 100,
        visible: true,
        blocks: [],
        isAnimating: false
      };
      return {
        ...state,
        sprites: [...state.sprites, newSprite],
        activeSprite: newSprite.id
      };

    case ActionTypes.REMOVE_SPRITE:
      return {
        ...state,
        sprites: state.sprites.filter(sprite => sprite.id !== action.payload),
        activeSprite: state.sprites.length > 1 ? state.sprites[0].id : null
      };

    case ActionTypes.SET_ACTIVE_SPRITE:
      return {
        ...state,
        activeSprite: action.payload
      };

    case ActionTypes.ADD_BLOCK_TO_SPRITE:
      return {
        ...state,
        sprites: state.sprites.map(sprite =>
          sprite.id === action.payload.spriteId
            ? { ...sprite, blocks: [...sprite.blocks, action.payload.block] }
            : sprite
        )
      };

    case ActionTypes.REMOVE_BLOCK_FROM_SPRITE:
      return {
        ...state,
        sprites: state.sprites.map(sprite =>
          sprite.id === action.payload.spriteId
            ? { ...sprite, blocks: sprite.blocks.filter((_, index) => index !== action.payload.blockIndex) }
            : sprite
        )
      };

    case ActionTypes.UPDATE_SPRITE_POSITION:
      return {
        ...state,
        sprites: state.sprites.map(sprite =>
          sprite.id === action.payload.spriteId
            ? { ...sprite, x: action.payload.x, y: action.payload.y }
            : sprite
        )
      };

    case ActionTypes.UPDATE_SPRITE_DIRECTION:
      return {
        ...state,
        sprites: state.sprites.map(sprite =>
          sprite.id === action.payload.spriteId
            ? { ...sprite, direction: action.payload.direction }
            : sprite
        )
      };

    case ActionTypes.SET_PLAYING:
      return {
        ...state,
        isPlaying: action.payload
      };

    case ActionTypes.SET_SPRITE_ANIMATING:
      return {
        ...state,
        sprites: state.sprites.map(sprite =>
          sprite.id === action.payload.spriteId
            ? { ...sprite, isAnimating: action.payload.isAnimating }
            : sprite
        )
      };

    case ActionTypes.DETECT_COLLISION:
      return {
        ...state,
        collisions: action.payload
      };

    case ActionTypes.SWAP_ANIMATIONS:
      const { sprite1Id, sprite2Id } = action.payload;
      const sprite1 = state.sprites.find(s => s.id === sprite1Id);
      const sprite2 = state.sprites.find(s => s.id === sprite2Id);
      
      return {
        ...state,
        sprites: state.sprites.map(sprite => {
          if (sprite.id === sprite1Id) {
            return { ...sprite, blocks: sprite2.blocks };
          } else if (sprite.id === sprite2Id) {
            return { ...sprite, blocks: sprite1.blocks };
          }
          return sprite;
        })
      };

    case ActionTypes.CLEAR_COLLISIONS:
      return {
        ...state,
        collisions: []
      };

    default:
      return state;
  }
}

// Provider component
export function AppProvider({ children }) {
  const [state, dispatch] = useReducer(appReducer, initialState);

  return (
    <AppContext.Provider value={{ state, dispatch }}>
      {children}
    </AppContext.Provider>
  );
}

// Hook to use the context
export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within an AppProvider');
  }
  return context;
}
