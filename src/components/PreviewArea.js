
import React, { useState } from "react";
import CatSprite from "./CatSprite";

export default function PreviewArea({ sprites, setSprites, selectedId, setSelectedId }) {
  const [isPlaying, setIsPlaying] = useState(false);

  const addSprite = () => {
    const newId = sprites.length + 1;
    setSprites([
      ...sprites,
      { id: newId, name: `Sprite${newId}`, x: 0, y: 0, direction: 90, stack: [] }
    ]);
    setSelectedId(newId);
  };

  const selectSprite = (id) => {
    setSelectedId(id);
  };

  // Animation logic
  const runAnimations = () => {
    setIsPlaying(true);
    // Calculate new positions and directions for all sprites
    let updatedSprites = sprites.map(sprite => {
      let x = sprite.x;
      let y = sprite.y;
      let direction = sprite.direction;
      sprite.stack.forEach(block => {
        if (block.startsWith("Move")) {
          const steps = parseInt(block.match(/\d+/));
          x += steps * Math.cos(direction * Math.PI / 180);
          y += steps * Math.sin(direction * Math.PI / 180);
        } else if (block.startsWith("Turn left")) {
          const deg = parseInt(block.match(/\d+/));
          direction -= deg;
        } else if (block.startsWith("Turn right")) {
          const deg = parseInt(block.match(/\d+/));
          direction += deg;
        } else if (block.startsWith("Go to x:")) {
          const coords = block.match(/x:(-?\d+) y:(-?\d+)/);
          if (coords) {
            x = parseInt(coords[1]);
            y = parseInt(coords[2]);
          }
        }
      });
      return { ...sprite, x, y, direction };
    });

    // Collision detection and swap stacks
    for (let i = 0; i < updatedSprites.length; i++) {
      for (let j = i + 1; j < updatedSprites.length; j++) {
        const a = updatedSprites[i];
        const b = updatedSprites[j];
        // Simple collision: if distance < 50px
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        if (Math.sqrt(dx * dx + dy * dy) < 50) {
          // Swap stacks
          const tempStack = a.stack;
          updatedSprites[i].stack = b.stack;
          updatedSprites[j].stack = tempStack;
        }
      }
    }

    setSprites(updatedSprites);
    setTimeout(() => setIsPlaying(false), 1000);
  };

  return (
    <div className="flex-none h-full overflow-y-auto p-2">
      <div className="mb-4">
        <div className="font-bold mb-2">Stage</div>
        <div className="relative bg-gray-100 border rounded-lg w-[400px] h-[300px] mx-auto">
          {sprites.map(sprite => (
            <div
              key={sprite.id}
              style={{
                position: "absolute",
                left: 200 + sprite.x,
                top: 150 - sprite.y,
                transition: "left 0.3s, top 0.3s"
              }}
            >
              <CatSprite />
              <div className="text-xs text-center">{sprite.name}</div>
            </div>
          ))}
        </div>
        <button
          className={`mt-2 px-4 py-2 rounded bg-blue-500 text-white font-bold shadow ${isPlaying ? 'opacity-50 cursor-not-allowed' : ''}`}
          onClick={runAnimations}
          disabled={isPlaying}
        >
          ▶ Play
        </button>
      </div>
      <div className="flex flex-row gap-4 mb-2">
        {sprites.map(sprite => (
          <div
            key={sprite.id}
            className={`flex flex-col items-center cursor-pointer ${selectedId === sprite.id ? 'ring-2 ring-blue-500' : ''}`}
            onClick={() => selectSprite(sprite.id)}
          >
            <CatSprite />
            <div className="text-xs mt-1">{sprite.name}</div>
            {selectedId === sprite.id && (
              <div className="text-xs text-blue-500 font-bold">Selected</div>
            )}
          </div>
        ))}
        <button
          className="bg-green-500 text-white px-2 py-1 rounded shadow hover:bg-green-600 h-fit self-center"
          onClick={addSprite}
        >
          + Add Sprite
        </button>
      </div>
    </div>
  );
}
