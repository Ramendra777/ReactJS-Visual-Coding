export default function App() {
  const [sprites, setSprites] = React.useState([
    { id: 1, name: "Sprite1", x: 0, y: 0, direction: 90, stack: [] }
  ]);
  const [selectedId, setSelectedId] = React.useState(1);

  return (
    <div className="bg-blue-100 pt-6 font-sans">
      <div className="h-screen overflow-hidden flex flex-row  ">
        <div className="flex-1 h-screen overflow-hidden flex flex-row bg-white border-t border-r border-gray-200 rounded-tr-xl mr-2">
          <Sidebar />
          <MidArea selectedId={selectedId} sprites={sprites} setSprites={setSprites} />
        </div>
        <div className="w-1/3 h-screen overflow-hidden flex flex-row bg-white border-t border-l border-gray-200 rounded-tl-xl ml-2">
          <PreviewArea sprites={sprites} setSprites={setSprites} selectedId={selectedId} setSelectedId={setSelectedId} />
        </div>
      </div>
    </div>
  );
}
