import React from 'react';

// Block types and their configurations - Exact MIT Scratch colors and styling
export const BlockTypes = {
  MOTION: {
    MOVE_STEPS: {
      id: 'move_steps',
      name: 'move',
      color: '#4C97FF',
      inputs: [{ type: 'number', default: 10, label: 'steps' }],
      icon: '→'
    },
    TURN_DEGREES: {
      id: 'turn_degrees',
      name: 'turn',
      color: '#4C97FF',
      inputs: [{ type: 'number', default: 15, label: 'degrees' }],
      icon: '↻'
    },
    TURN_DEGREES_COUNTER: {
      id: 'turn_degrees_counter',
      name: 'turn',
      color: '#4C97FF',
      inputs: [{ type: 'number', default: 15, label: 'degrees' }],
      icon: '↺'
    },
    GO_TO_XY: {
      id: 'go_to_xy',
      name: 'go to x:',
      color: '#4C97FF',
      inputs: [
        { type: 'number', default: 0, label: 'x' },
        { type: 'number', default: 0, label: 'y' }
      ],
      icon: '📍'
    }
  },
  LOOKS: {
    SAY_FOR_SECONDS: {
      id: 'say_for_seconds',
      name: 'say',
      color: '#9966FF',
      inputs: [
        { type: 'text', default: 'Hello!', label: 'message' },
        { type: 'number', default: 2, label: 'seconds' }
      ],
      icon: '💬'
    },
    THINK_FOR_SECONDS: {
      id: 'think_for_seconds',
      name: 'think',
      color: '#9966FF',
      inputs: [
        { type: 'text', default: 'Hmm...', label: 'message' },
        { type: 'number', default: 2, label: 'seconds' }
      ],
      icon: '💭'
    }
  },
  CONTROL: {
    REPEAT: {
      id: 'repeat',
      name: 'repeat',
      color: '#FFAB19',
      inputs: [{ type: 'number', default: 10, label: 'times' }],
      icon: '🔄',
      isWrapper: true
    }
  }
};

// Block component
export function Block({ block, onDragStart, onInputChange, isDragging = false, onDropNested, nestedBlocks = [] }) {
  const blockConfig = Object.values(BlockTypes)
    .flatMap(category => Object.values(category))
    .find(config => config.id === block.type);

  if (!blockConfig) return null;

  const handleDragStart = (e) => {
    e.dataTransfer.setData('application/json', JSON.stringify(block));
    onDragStart && onDragStart(block);
  };

  const handleInputChange = (inputIndex, value) => {
    const newInputs = [...block.inputs];
    newInputs[inputIndex] = value;
    onInputChange && onInputChange({ ...block, inputs: newInputs });
  };

  const handleNestedDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    const blockData = e.dataTransfer.getData('application/json');
    if (blockData && blockConfig.isWrapper) {
      const nestedBlock = JSON.parse(blockData);
      onDropNested && onDropNested(block.id, nestedBlock);
    }
  };

  const handleNestedDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
  };

  return (
    <div
      className="cursor-move select-none relative"
      draggable
      onDragStart={handleDragStart}
      style={{
        opacity: isDragging ? 0.5 : 1,
        transform: isDragging ? 'scale(0.95)' : 'scale(1)',
        transition: 'all 0.2s ease'
      }}
    >
      {/* Scratch-style puzzle piece block */}
      <div
        className="text-white px-3 py-2 min-w-[120px] relative"
        style={{
          backgroundColor: blockConfig.color,
          borderRadius: '8px',
          boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
          border: '1px solid rgba(255,255,255,0.2)'
        }}
      >
        {/* Puzzle piece notch on the right */}
        <div
          className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4"
          style={{
            backgroundColor: blockConfig.color,
            borderRadius: '50%',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        />
        
        <div className="flex items-center space-x-2">
          <span className="text-sm font-medium">{blockConfig.name}</span>
          {blockConfig.inputs.map((input, index) => (
            <input
              key={index}
              type={input.type}
              value={block.inputs[index] || input.default}
              onChange={(e) => handleInputChange(index, e.target.value)}
              className="w-16 px-1 py-0.5 text-black text-xs rounded border-0 focus:outline-none focus:ring-1 focus:ring-white"
              placeholder={input.label}
            />
          ))}
        </div>
        
        {/* Nested blocks area for wrapper blocks like Repeat */}
        {blockConfig.isWrapper && (
          <div 
            className="mt-2 ml-4 border-l-2 border-white border-opacity-30 pl-2 min-h-[30px]"
            onDrop={handleNestedDrop}
            onDragOver={handleNestedDragOver}
          >
            {nestedBlocks.length > 0 ? (
              <div className="space-y-1">
                {nestedBlocks.map((nestedBlock, index) => (
                  <Block
                    key={nestedBlock.id}
                    block={nestedBlock}
                    onDragStart={onDragStart}
                    onInputChange={onInputChange}
                  />
                ))}
              </div>
            ) : (
              <div className="text-white text-opacity-50 text-xs py-2">
                Drag blocks here
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

// Block palette component
export function BlockPalette({ onDragStart }) {
  const renderBlocks = (category) => {
    return Object.values(category).map(blockConfig => (
      <div
        key={blockConfig.id}
        className="cursor-move select-none hover:scale-105 transition-transform duration-200"
        draggable
        onDragStart={(e) => {
          const block = {
            id: `${blockConfig.id}_${Date.now()}`,
            type: blockConfig.id,
            inputs: blockConfig.inputs.map(input => input.default)
          };
          e.dataTransfer.setData('application/json', JSON.stringify(block));
          onDragStart && onDragStart(block);
        }}
      >
        {/* Scratch-style puzzle piece block */}
        <div
          className="text-white px-3 py-2 min-w-[120px] relative hover:shadow-lg transition-shadow duration-200"
          style={{
            backgroundColor: blockConfig.color,
            borderRadius: '12px',
            boxShadow: '0 4px 8px rgba(0,0,0,0.2)',
            border: '1px solid rgba(255,255,255,0.2)'
          }}
        >
          {/* Puzzle piece notch on the right */}
          <div
            className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4"
            style={{
              backgroundColor: blockConfig.color,
              borderRadius: '50%',
              border: '1px solid rgba(255,255,255,0.2)'
            }}
          />
          
          <div className="flex items-center space-x-2">
            <span className="text-sm font-medium">{blockConfig.name}</span>
            {blockConfig.inputs.map((input, index) => (
              <span key={index} className="text-xs opacity-90">
                {input.default}
              </span>
            ))}
          </div>
        </div>
      </div>
    ));
  };

  return (
    <div className="flex flex-col h-full">
      {/* Professional Tabs */}
      <div className="flex bg-gray-100 border-b border-gray-200">
        <div className="px-4 py-3 bg-white border-b-2 border-blue-500 text-sm font-medium text-gray-800">
          Code
        </div>
        <div className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-all duration-200">
          Costumes
        </div>
        <div className="px-4 py-3 text-sm text-gray-600 hover:bg-gray-50 cursor-pointer transition-all duration-200">
          Sounds
        </div>
      </div>
      
      {/* Professional Block Categories */}
      <div className="overflow-y-auto flex-1 p-4 space-y-3">
        {/* Motion Category */}
        <div>
          <div 
            className="px-3 py-2 text-white text-sm font-medium cursor-pointer mb-2 rounded"
            style={{ backgroundColor: '#4C97FF' }}
          >
            Motion
          </div>
          <div className="space-y-1 ml-2">
            {renderBlocks(BlockTypes.MOTION)}
          </div>
        </div>
        
        {/* Looks Category */}
        <div>
          <div 
            className="px-3 py-2 text-white text-sm font-medium cursor-pointer mb-2 rounded"
            style={{ backgroundColor: '#9966FF' }}
          >
            Looks
          </div>
          <div className="space-y-1 ml-2">
            {renderBlocks(BlockTypes.LOOKS)}
          </div>
        </div>
        
        {/* Control Category */}
        <div>
          <div 
            className="px-3 py-2 text-white text-sm font-medium cursor-pointer mb-2 rounded"
            style={{ backgroundColor: '#FFAB19' }}
          >
            Control
          </div>
          <div className="space-y-1 ml-2">
            {renderBlocks(BlockTypes.CONTROL)}
          </div>
        </div>
        
        {/* Events Category */}
        <div>
          <div 
            className="px-3 py-2 text-white text-sm font-medium cursor-pointer mb-2 rounded"
            style={{ backgroundColor: '#FFBF00' }}
          >
            Events
          </div>
          <div className="space-y-1 ml-2">
            <div
              className="text-white px-3 py-2 min-w-[120px] relative cursor-move select-none hover:shadow-lg transition-shadow duration-200"
              style={{
                backgroundColor: '#FFBF00',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                border: '1px solid rgba(255,255,255,0.2)'
              }}
            >
              <div
                className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-4 h-4"
                style={{
                  backgroundColor: '#FFBF00',
                  borderRadius: '50%',
                  border: '1px solid rgba(255,255,255,0.2)'
                }}
              />
              <div className="flex items-center space-x-2">
                <span className="text-sm font-medium">when</span>
                <span className="text-xs">🚩</span>
                <span className="text-sm font-medium">clicked</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
