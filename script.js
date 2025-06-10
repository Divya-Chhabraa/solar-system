// Setup
const canvas = document.getElementById('webgl');
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.setPixelRatio(window.devicePixelRatio);

const scene = new THREE.Scene();
scene.background = new THREE.Color('#020c1b');

const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
camera.position.z = 50;

// Lighting
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

const directionalLight = new THREE.DirectionalLight(0x88ccff, 1);
directionalLight.position.set(10, 20, 15);
scene.add(directionalLight);

// Star texture generator
function createStarTexture() {
  const size = 64;
  const starCanvas = document.createElement('canvas');
  starCanvas.width = size;
  starCanvas.height = size;
  const ctx = starCanvas.getContext('2d');

  const gradient = ctx.createRadialGradient(size / 2, size / 2, 0, size / 2, size / 2, size / 2);
  gradient.addColorStop(0, 'white');
  gradient.addColorStop(0.2, '#ffffff');
  gradient.addColorStop(1, 'transparent');

  ctx.fillStyle = gradient;
  ctx.beginPath();
  ctx.arc(size / 2, size / 2, size / 2, 0, Math.PI * 2);
  ctx.fill();

  return new THREE.CanvasTexture(starCanvas);
}

// Create stars
const starGeometry = new THREE.BufferGeometry();
const starCount = 1000;
const positions = [];

for (let i = 0; i < starCount; i++) {
  positions.push(
    (Math.random() - 0.5) * 300,
    (Math.random() - 0.5) * 300,
    (Math.random() - 0.5) * 300
  );
}

starGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));

const starMaterial = new THREE.PointsMaterial({
  size: 1.5,
  map: createStarTexture(),
  transparent: true,
  alphaTest: 0.05,
  depthWrite: false
});

const stars = new THREE.Points(starGeometry, starMaterial);
scene.add(stars);

// Existing star background code stays untouched above...

// --- SUN ---
const sunGeometry = new THREE.SphereGeometry(6, 32, 32);
//const sunMaterial = new THREE.MeshBasicMaterial({ color: 0xFDB813 }); // Bright yellow sun

const textureLoader = new THREE.TextureLoader();
const sunTexture = textureLoader.load('textures/sun.jpg');

const sunMaterial = new THREE.MeshStandardMaterial({
  map: sunTexture,
  emissive: 0xffaa00,
  emissiveMap: sunTexture,
  emissiveIntensity: 2,
  roughness: 0.5
});

const sunMesh = new THREE.Mesh(sunGeometry, sunMaterial);
scene.add(sunMesh);


// --- PLANET DATA ---
const planetData = [
  { name: 'Mercury', radius: 0.8, orbit: 10, speed: 0.006, color: 0xaaaaaa },
  { name: 'Venus', radius: 1.2, orbit: 14, speed: 0.004, color: 0xffcc99 },
  { name: 'Earth', radius: 1.3, orbit: 18, speed: 0.0035, color: 0x3399ff },
  { name: 'Mars', radius: 1.1, orbit: 22, speed: 0.003, color: 0xff3300 },
  { name: 'Jupiter', radius: 2.5, orbit: 28, speed: 0.0023, color: 0xff9966 },
  { name: 'Saturn', radius: 2.2, orbit: 34, speed: 0.002, color: 0xffcc66 },
  { name: 'Uranus', radius: 1.8, orbit: 40, speed: 0.0018, color: 0x66ccff },
  { name: 'Neptune', radius: 1.7, orbit: 46, speed: 0.0015, color: 0x3366ff }
];





// --- PLANET MESHES + ANGLES ---
const planets = [];
const planetAngles = [];
//const textureLoader = new THREE.TextureLoader();


planetData.forEach(data => {
  const geometry = new THREE.SphereGeometry(data.radius, 32, 32);

// Try loading texture based on planet name
let texture;
try {
  texture = textureLoader.load(`textures/${data.name.toLowerCase()}.jpg`);
} catch {
  texture = null;
}

const material = new THREE.MeshStandardMaterial({
  map: texture || null,
  color: texture ? 0xffffff : data.color,
  emissive: data.color,
  emissiveIntensity: 0.9,
  roughness: 0.7,
  metalness: 0.3
});




  const planetMesh = new THREE.Mesh(geometry, material);
  scene.add(planetMesh);

    const glow = createPlanetGlow(data.radius, data.color);
    planetMesh.add(glow);


  if (data.name === 'Saturn') {
  const ringGeometry = new THREE.RingGeometry(data.radius + 0.5, data.radius + 2, 64);
  const ringMaterial = new THREE.MeshBasicMaterial({
    color: 0xffe0aa,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.5,
  });

  const ring = new THREE.Mesh(ringGeometry, ringMaterial);
  ring.rotation.x = -Math.PI / 2.5;
  ring.position.copy(planetMesh.position); // bind to planet
  planetMesh.add(ring); // attach to Saturn
}


  planets.push(planetMesh);
  planetAngles.push(Math.random()); // random start for variation

  const orbitCurve = new THREE.RingGeometry(data.orbit - 0.05, data.orbit + 0.05, 64);
  const orbitMat = new THREE.MeshBasicMaterial({
    color: 0x8888aa,
    side: THREE.DoubleSide,
    transparent: true,
    opacity: 0.2
  });
  const orbit = new THREE.Mesh(orbitCurve, orbitMat);
  orbit.rotation.x = Math.PI / 2;
  scene.add(orbit);
});



// --- ANIMATION LOOP ---
const clock = new THREE.Clock();

function animate() {
  requestAnimationFrame(animate);
  const delta = clock.getDelta(); // Time between frames

  // Stars animation
  const elapsed = clock.getElapsedTime();
  starMaterial.opacity = 0.8 + Math.sin(elapsed * 2) * 0.2;
  stars.rotation.y += 0.0008;
  stars.rotation.x += 0.0004;

  // Orbit planets
  planetData.forEach((data, i) => {
    planetAngles[i] += data.speed * delta * 60; // scaled to frame rate

    const x = Math.cos(planetAngles[i]) * data.orbit;
    const z = Math.sin(planetAngles[i]) * data.orbit;

    planets[i].position.set(x, 0, z);
    planets[i].rotation.y += 0.01;
  });

  renderer.render(scene, camera);
}
animate();

const speedControlsDiv = document.getElementById('speedControls');

planetData.forEach((data, i) => {
  const label = document.createElement('label');
  label.textContent = `${data.name}: `;

  const slider = document.createElement('input');
  slider.type = 'range';
  slider.min = 0.0001;
  slider.max = 0.02;
  slider.step = 0.0001;
  slider.value = data.speed;

  slider.addEventListener('input', () => {
    planetData[i].speed = parseFloat(slider.value);
  });

  label.appendChild(slider);
  speedControlsDiv.appendChild(label);
});


window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
});

function adjustCameraForMobile() {
  if (window.innerWidth < 600) {
    camera.position.z = 70;
  } else {
    camera.position.z = 50;
  }
}
adjustCameraForMobile();

window.addEventListener('resize', () => {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
  adjustCameraForMobile();
});

const controls = new THREE.OrbitControls(camera, renderer.domElement);
controls.enableDamping = true;
controls.enableZoom = false; // optional, restrict zoom
controls.enablePan = false;  // restrict dragging



function createPlanetGlow(radius, color) {
  const spriteMaterial = new THREE.SpriteMaterial({
    map: new THREE.TextureLoader().load('https://raw.githubusercontent.com/mrdoob/three.js/dev/examples/textures/sprites/glow.png'),
    color: color,
    transparent: true,
    blending: THREE.AdditiveBlending,
    depthWrite: false
  });

  const sprite = new THREE.Sprite(spriteMaterial);
  sprite.scale.set(radius * 5, radius * 5, 1);
  return sprite;
}


