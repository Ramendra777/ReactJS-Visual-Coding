
import React from "react";

export default function MidArea({ selectedId, sprites, setSprites }) {
  const selectedSprite = sprites.find(s => s.id === selectedId);

  const handleDrop = (e) => {
    e.preventDefault();
    const blockType = e.dataTransfer.getData("blockType");
    if (blockType && selectedSprite) {
      setSprites(sprites.map(sprite =>
        sprite.id === selectedId
          ? { ...sprite, stack: [...sprite.stack, blockType] }
          : sprite
      ));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  return (
    <div
      className="flex-1 h-full overflow-auto bg-gray-50 p-4 min-h-[300px] rounded-lg border border-dashed border-gray-300"
      onDrop={handleDrop}
      onDragOver={handleDragOver}
    >
      <div className="font-bold mb-2 text-gray-700">Code Stack for {selectedSprite?.name}</div>
      {!selectedSprite || selectedSprite.stack.length === 0 ? (
        <div className="text-gray-400">Drag blocks here to build your code</div>
      ) : (
        <div className="space-y-2">
          {selectedSprite.stack.map((block, idx) => (
            <div key={idx} className="px-3 py-2 rounded shadow bg-white border">
              {block}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
