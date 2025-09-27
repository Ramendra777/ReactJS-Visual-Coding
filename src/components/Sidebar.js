import React from "react";
import { BlockPalette } from "./BlockSystem";

export default function Sidebar({ onDragStart }) {
  return (
    <BlockPalette onDragStart={onDragStart} />
  );
}
