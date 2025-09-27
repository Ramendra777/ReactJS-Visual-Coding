import React from "react";
import Icon from "./Icon";

export default function Sidebar() {
  return (
    <div className="w-60 flex-none h-full overflow-y-auto flex flex-col items-start p-2 border-r border-gray-200">
      <div className="font-bold mb-2">Events</div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "When flag clicked")}
        className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        When <Icon name="flag" size={15} className="text-green-600 mx-2" /> clicked
      </div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "When sprite clicked")}
        className="flex flex-row flex-wrap bg-yellow-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        When this sprite clicked
      </div>

      <div className="font-bold mt-4 mb-2">Motion</div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "Move 10 steps")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        Move <span className="bg-white text-blue-500 rounded px-1 mx-1">10</span> steps
      </div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "Turn left 15 degrees")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        Turn <Icon name="undo" size={15} className="text-white mx-2" /> <span className="bg-white text-blue-500 rounded px-1 mx-1">15</span> degrees
      </div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "Turn right 15 degrees")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        Turn <Icon name="redo" size={15} className="text-white mx-2" /> <span className="bg-white text-blue-500 rounded px-1 mx-1">15</span> degrees
      </div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "Go to x:0 y:0")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        Go to x: <span className="bg-white text-blue-500 rounded px-1 mx-1">0</span> y: <span className="bg-white text-blue-500 rounded px-1 mx-1">0</span>
      </div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "Repeat 10 times")}
        className="flex flex-row flex-wrap bg-blue-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        Repeat <span className="bg-white text-blue-500 rounded px-1 mx-1">10</span> times
      </div>

      <div className="font-bold mt-4 mb-2">Looks</div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "Say Hello! for 2 seconds")}
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        Say <span className="bg-white text-purple-500 rounded px-1 mx-1">Hello!</span> for <span className="bg-white text-purple-500 rounded px-1 mx-1">2</span> seconds
      </div>
      <div
        draggable
        onDragStart={e => e.dataTransfer.setData("blockType", "Think Hmm... for 2 seconds")}
        className="flex flex-row flex-wrap bg-purple-500 text-white px-2 py-1 my-2 text-sm rounded-lg shadow cursor-move"
      >
        Think <span className="bg-white text-purple-500 rounded px-1 mx-1">Hmm...</span> for <span className="bg-white text-purple-500 rounded px-1 mx-1">2</span> seconds
      </div>
    </div>
  );
}
