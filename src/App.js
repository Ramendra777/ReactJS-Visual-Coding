import React from "react";
import { AppProvider } from "./context/AppContext";
import TopNavigation from "./components/TopNavigation";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  return (
    <AppProvider>
      <div className="min-h-screen bg-gray-100 font-sans">
        {/* Professional Header */}
        <div className="bg-white border-b border-gray-200 shadow-sm">
          <TopNavigation />
        </div>
        
        {/* Main Content Area - Professional Layout */}
        <div className="flex flex-row h-screen pt-16">
          {/* Left Panel - Block Palette */}
          <div className="w-80 bg-white border-r border-gray-200 shadow-sm">
            <Sidebar />
          </div>
          
          {/* Center Panel - Stage Area */}
          <div className="flex-1 bg-gray-50">
            <PreviewArea />
          </div>
          
          {/* Right Panel - Scripts Area */}
          <div className="w-96 bg-white border-l border-gray-200 shadow-sm">
            <MidArea />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
