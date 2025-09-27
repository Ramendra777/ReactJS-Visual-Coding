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
    <div className="h-full flex flex-col">
      {/* Professional Header */}
      <div className="bg-white border-b border-gray-200 p-4">
        <h3 className="text-lg font-semibold text-gray-800">Scripts</h3>
        {activeSprite && (
          <p className="text-sm text-gray-500 mt-1">
            {activeSprite.name}
          </p>
        )}
      </div>
      
      {/* Professional Scripts Workspace */}
      <div 
        className="flex-1 overflow-auto p-4 bg-gray-50"
        onDragOver={handleDragOver}
        onDrop={handleDrop}
      >
        {/* Scripts Area */}
        {activeSprite && activeSprite.blocks.length > 0 ? (
          <div className="space-y-2">
            {activeSprite.blocks.map((block, index) => (
              <div key={block.id} className="bg-white rounded-lg p-3 shadow-sm border border-gray-200 hover:shadow-md transition-all duration-200">
                <div className="flex items-center justify-between">
                  <Block
                    block={block}
                    onDragStart={handleBlockDragStart}
                    onInputChange={handleBlockInputChange}
                    onDropNested={handleNestedDrop}
                    nestedBlocks={block.nestedBlocks || []}
                  />
                  <button
                    onClick={() => removeBlock(index)}
                    className="text-gray-400 hover:text-red-500 hover:bg-red-50 p-1 rounded transition-all duration-200 ml-2"
                    title="Delete"
                  >
                    ✕
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white border-2 border-dashed border-gray-300 rounded-lg text-center py-20 text-gray-500">
            <div className="text-4xl mb-4">📝</div>
            <h4 className="text-lg font-medium text-gray-700 mb-2">Drag blocks here to code</h4>
            <p className="text-sm">Your script will appear here</p>
          </div>
        )}
      </div>
    </div>
  );
}
