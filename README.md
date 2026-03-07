# 🐍 Classic Snake Game

A polished, modern take on the classic Snake game, built using vanilla HTML5, CSS3, and JavaScript. This project focuses on clean architecture, smooth performance, and a sleek user interface.

## ✨ Features

- **🎮 Smooth Gameplay**: Optimized canvas rendering for a fluid experience.
- **📊 Real-time Scoring**: Track your progress as you grow longer.
- **⏸️ Game Controls**: Pause, resume, and restart functionality.
- **⌨️ Dual Input Support**: Use either Arrow keys or WASD for movement.
- **📱 Modern Design**: Sleek, responsive interface with clear visual feedback.

## 🚀 Getting Started

### Prerequisites

You only need a web browser to run this game. To serve it locally for the best experience:

### Running Locally

1. Clone the repository:
   ```bash
   git clone https://github.com/dineshmahapatra123/snake-app.git
   ```
2. Navigate to the project directory:
   ```bash
   cd snake-app
   ```
3. Start a local server:
   ```bash
   # Using Python
   python -m http.server 8000
   
   # Or using Node.js (with live-server or similar)
   npx live-server
   ```
4. Open your browser and go to `http://localhost:8000`.

## 🕹️ How to Play

- **Move**: Use `Arrow Keys` or `W`, `A`, `S`, `D` or swipe on touch devices.
- **Pause/Resume**: Press `Space` or use the on-screen button.
- **Restart**: Press `R` or use the on-screen button.
- **Objective**: Eat the red food to grow and increase your score. Avoid hitting the walls or your own tail!

### 🏆 High Score
The header now shows your all-time best score, which is stored locally in the browser using `localStorage`.

## 🧪 Running Tests
A basic Jest test suite is included to verify the core game logic.

1. Install dependencies:
   ```bash
   npm install
   ```
2. Run the tests:
   ```bash
   npm test
   ```

## 🛠️ Technology Stack

- **HTML5**: Semantic structure and Canvas for rendering.
- **CSS3**: Modern styling with custom properties and Flexbox/Grid.
- **JavaScript (ES6+)**: Modular game logic and state management.

## 📂 Project Structure

- `index.html`: Main entry point and game layout.
- `style.css`: Visual styling and animations.
- `src/main.js`: Game loop, rendering, and event handling.
- `src/logic.js`: Core game mechanics and state transitions.

---
Built with ❤️ by [Dinesh Mahapatra](https://github.com/dineshmahapatra123)
