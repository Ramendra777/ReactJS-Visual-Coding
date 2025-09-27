# 🎮 Scratch Visual Coding Environment

A React-based visual coding environment inspired by MIT Scratch, featuring drag-and-drop programming blocks, sprite animations, and collision detection.

## 🚀 Quick Demo - Hero Feature (Collision-Based Animation Swap)

**🎯 Perfect Setup**: Both Cat and Dog sprites are already positioned to collide when you run the demo script!

### Step 1: Add Scripts to Both Sprites

**For Cat Sprite:**
1. Click on the Cat sprite in the right panel (should be selected by default)
2. Drag these blocks from the left sidebar to the center area:
   - `move 50 steps` (Motion category - blue blocks)
   - `turn 15 degrees` (Motion category - blue blocks)
   - `say Hello! for 2 seconds` (Looks category - purple blocks)

**For Dog Sprite:**
1. Click on the Dog sprite in the right panel
2. Drag these blocks from the left sidebar to the center area:
   - `move 30 steps` (Motion category - blue blocks)
   - `turn -10 degrees` (Motion category - blue blocks)
   - `think Woof! for 2 seconds` (Looks category - purple blocks)

### Step 2: Run the Animation

1. Click the **green play button (▶️)** in the stage area
2. Watch both sprites move towards each other and collide!
3. When they collide, you'll see a **💥 Collision Detected!** notification
4. The animations will automatically swap between the sprites!
5. Click the **red stop button (⏹️)** to stop the animation

### 🎪 What You'll See:
- **Cat** starts at position (-80, 0) and moves right
- **Dog** starts at position (80, 0) and moves left  
- They collide in the center and swap animations!
- **Hero Feature**: Collision detection with automatic animation swapping

## 🎯 Features

### ✅ Core Functionality
- **Drag & Drop Programming**: Visual block-based coding
- **Multiple Sprites**: Cat and Dog characters
- **Motion Animations**: Move, turn, go to coordinates
- **Looks Animations**: Say, think with speech bubbles
- **Control Blocks**: Repeat loops with nested blocks
- **Real-time Animation**: Smooth sprite movements

### 🌟 Hero Feature - Collision Detection
- **Automatic Collision Detection**: Sprites detect when they overlap
- **Animation Swapping**: When collision occurs, animations swap between sprites
- **Visual Feedback**: Collision notifications with animations
- **Cooldown System**: Prevents rapid collision spam

## 🛠️ Technology Stack

- **React.js**: Frontend framework
- **TailwindCSS**: Styling and responsive design
- **React Context API**: State management
- **HTML5 Drag & Drop**: Block interaction and sprite positioning
- **SVG**: Sprite rendering
- **Custom Animation Engine**: Smooth sprite movements
- **Interactive Sprite Positioning**: Drag sprites to any coordinate


## 🔧 Installation & Setup

1. **Clone the repository**
2. **Install dependencies**: `npm install`
3. **Start development server**: `npm start`
4. **Open browser**: Navigate to `http://localhost:3000`

## 🎯 Project Structure

```
src/
├── components/
│   ├── sprites/
│   │   ├── PikachuSprite.js    # Pikachu sprite component (⚡)
│   │   └── JerrySprite.js      # Jerry sprite component (🐭)
│   ├── BlockSystem.js          # Block definitions and palette
│   ├── CatSprite.js            # Cat sprite component (🐱)
│   ├── Controls.js             # Play/Stop/Reset controls
│   ├── DogSprite.js            # Dog sprite component (🐶)
│   ├── MidArea.js              # Scripts workspace area
│   ├── PreviewArea.js          # Stage and sprite management
│   ├── Sidebar.js              # Block palette container
│   ├── SpriteList.js           # Sprite management component
│   └── TopNavigation.js        # Professional header navigation
├── context/
│   └── AppContext.js           # Global state management & actions
├── utils/
│   └── AnimationEngine.js      # Animation engine & collision detection
└── App.js                      # Main application component
```

## 🌟 Key Features Explained

### Collision Detection Algorithm
- **Distance Calculation**: Uses Euclidean distance between sprite centers
- **Threshold Detection**: Collision occurs when distance < sprite size
- **Animation Swapping**: Exchanges animation queues between colliding sprites
- **Cooldown System**: 2-second delay prevents rapid collision events

### Interactive Sprite Positioning
- **Drag & Drop**: Click and drag any sprite to move it around the stage
- **Real-time Coordinates**: Position updates instantly in the sprite info panel
- **Boundary Constraints**: Sprites stay within stage boundaries
- **Visual Feedback**: Cursor changes to indicate draggable sprites
- **Active Selection**: Dragging automatically selects the sprite

### Animation Engine
- **Queue Management**: Processes animation blocks sequentially
- **State Updates**: Updates sprite position, rotation, and visibility
- **Speech Bubbles**: Manages temporary text displays
- **Smooth Transitions**: CSS transitions for fluid movements

### Block System
- **Drag & Drop**: HTML5 drag API for block interaction
- **Nested Blocks**: Support for wrapper blocks like "Repeat"
- **Input Validation**: Type checking for numeric inputs
- **Visual Feedback**: Hover effects and drag states

---

**Built with React.js and TailwindCSS**

