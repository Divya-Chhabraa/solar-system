# solar-system

This project is a 3D interactive solar system simulation built using [Three.js](https://threejs.org/). It is optimized for both desktop and mobile devices, and includes features like tooltips, orbit controls, light/dark mode, and customizable planet speeds.

## How to Run

1. Clone or download the project to your local machine.
2. Make sure all textures are placed inside the correct `./textures/planets/` folder.
3. Open the `index.html` file in any modern browser or use Live Server Extension in VSCode.
4. Ensure you have internet access for external Three.js and OrbitControls dependencies (CDNs).

## Controls

* Rotate View: Click and drag (or touch and drag on mobile)
* Zoom In/Out: Scroll wheel or pinch on mobile
* Pan View: Right-click and drag (or two-finger drag on mobile)
* Tooltip: Hover over a planet to see its name
* Pause/Resume: Toggle animation on/off
* Speed Sliders: Adjust revolution speed of each planet
* Dark/Light Mode: Toggle between two background modes
* Toggle Orbits: Show or hide orbital paths
* Reset View: Return camera to original position

## Technical Aspects

* Framework: Three.js for 3D rendering
* Controls: OrbitControls for camera interaction
* Raycasting: Used for detecting hovered planets to show tooltips
* Responsive Design: Layout adjusts for mobile screens
* Performance: Adjusts rendering resolution for mobile performance

The main objective was to create an interactive and visually engaging representation of our solar system, optimized for mobile view. Key features include planet rotation and revolution, orbit visualization, tooltips, light/dark mode toggle, and real-time control over animation speed. The project aims to combine basic astronomy concepts with web-based 3D visualization techniques.