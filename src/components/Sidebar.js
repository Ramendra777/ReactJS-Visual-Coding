import React from "react";
import { BlockPalette } from "./BlockSystem";

export default function Sidebar({ onDragStart }) {
  return (
    <div className="h-full overflow-y-auto p-4">
      <div className="mb-4">
        <h2 className="text-xl font-bold text-gray-800 flex items-center">
          🧩 <span className="ml-2">Code Blocks</span>
        </h2>
        <p className="text-sm text-gray-600 mt-1">
          Drag blocks to the center to build your animations
        </p>
      </div>
      <BlockPalette onDragStart={onDragStart} />
    </div>
  );
}
