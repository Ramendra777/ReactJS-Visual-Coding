import React, { useState } from "react";
import { Block } from "./BlockSystem";
import { useApp } from "../context/AppContext";

export default function MidArea() {
  const { state, dispatch } = useApp();
  const [draggedBlock, setDraggedBlock] = useState(null);

  const activeSprite = state.sprites.find(sprite => sprite.id === state.activeSprite);

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e) => {
    e.preventDefault();
    const blockData = e.dataTransfer.getData('application/json');
    if (blockData) {
      const block = JSON.parse(blockData);
      dispatch({
        type: 'ADD_BLOCK_TO_SPRITE',
        payload: {
          spriteId: state.activeSprite,
          block: { ...block, id: `${block.type}_${Date.now()}` }
        }
      });
    }
  };

  const handleBlockDragStart = (block) => {
    setDraggedBlock(block);
  };

  const handleBlockInputChange = (updatedBlock) => {
    // Update the block in the sprite's blocks array
    const blockIndex = activeSprite.blocks.findIndex(b => b.id === updatedBlock.id);
    if (blockIndex !== -1) {
      const newBlocks = [...activeSprite.blocks];
      newBlocks[blockIndex] = updatedBlock;
      dispatch({
        type: 'REMOVE_BLOCK_FROM_SPRITE',
        payload: { spriteId: state.activeSprite, blockIndex }
      });
      dispatch({
        type: 'ADD_BLOCK_TO_SPRITE',
        payload: { spriteId: state.activeSprite, block: updatedBlock }
      });
    }
  };

  const handleNestedDrop = (parentBlockId, nestedBlock) => {
    const blockIndex = activeSprite.blocks.findIndex(b => b.id === parentBlockId);
    if (blockIndex !== -1) {
      const updatedBlock = {
        ...activeSprite.blocks[blockIndex],
        nestedBlocks: [...(activeSprite.blocks[blockIndex].nestedBlocks || []), nestedBlock]
      };
      
      dispatch({
        type: 'REMOVE_BLOCK_FROM_SPRITE',
        payload: { spriteId: state.activeSprite, blockIndex }
      });
      dispatch({
        type: 'ADD_BLOCK_TO_SPRITE',
        payload: { spriteId: state.activeSprite, block: updatedBlock }
      });
    }
  };

  const removeBlock = (blockIndex) => {
    dispatch({
      type: 'REMOVE_BLOCK_FROM_SPRITE',
      payload: { spriteId: state.activeSprite, blockIndex }
    });
  };

  return (
    <div 
      className="flex-1 overflow-auto bg-white"
      onDragOver={handleDragOver}
      onDrop={handleDrop}
      style={{ height: '100%' }}
    >
      <div className="min-h-full p-4">
        <h3 className="text-lg font-semibold mb-4 text-gray-800">
          Scripts for {activeSprite?.name || 'No Sprite'}
        </h3>
        
        {activeSprite && activeSprite.blocks.length > 0 ? (
          <div className="space-y-3">
            {activeSprite.blocks.map((block, index) => (
              <div key={block.id} className="flex items-center space-x-3">
                <Block
                  block={block}
                  onDragStart={handleBlockDragStart}
                  onInputChange={handleBlockInputChange}
                  onDropNested={handleNestedDrop}
                  nestedBlocks={block.nestedBlocks || []}
                />
                <button
                  onClick={() => removeBlock(index)}
                  className="text-red-500 hover:text-red-700 text-lg font-bold px-2 py-1 rounded hover:bg-red-50 transition-colors"
                >
                  ✕
                </button>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-gray-500 text-center py-16 bg-gray-50 rounded-lg border-2 border-dashed border-gray-300">
            <div className="text-4xl mb-4">🎯</div>
            <p className="text-lg font-medium mb-2">Drag blocks here to create scripts</p>
            <p className="text-sm">Blocks will appear here when you drag them from the sidebar</p>
          </div>
        )}
      </div>
    </div>
  );
}
