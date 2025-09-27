import React from "react";
import { AppProvider } from "./context/AppContext";
import TopNavigation from "./components/TopNavigation";
import Sidebar from "./components/Sidebar";
import MidArea from "./components/MidArea";
import PreviewArea from "./components/PreviewArea";

export default function App() {
  return (
    <AppProvider>
      <div className="bg-gray-100 font-sans" style={{ height: '100vh' }}>
        {/* Top Navigation */}
        <TopNavigation />
        
        {/* Main Content Area */}
        <div className="flex flex-row" style={{ height: 'calc(100vh - 48px)' }}>
          <div className="flex-1 flex flex-row bg-white">
            <Sidebar />
            <MidArea />
          </div>
          <div className="w-80 bg-gray-100">
            <PreviewArea />
          </div>
        </div>
      </div>
    </AppProvider>
  );
}
