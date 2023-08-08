import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import * as dat from "dat.gui";

/**
 * Debug GUI
 */
// const gui = new dat.GUI();

/**
 * Window Events
 */
// Resize
window.addEventListener("resize", () => {
  // Update SIzes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Scene
 */
const scene = new THREE.Scene();
/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader();
const particleTexture = textureLoader.load("./assets/textures/particles/2.png");

/**
 * Particles
 */
// Geometry
// const particleGeometry = new THREE.SphereGeometry(1, 32, 32);

// Material
// const particleMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });

// Points
// const particles = new THREE.Points(particleGeometry, particleMaterial);
// scene.add(particles);

// Custom Particles

// Geometry
const particleGeometry = new THREE.BufferGeometry();
// const particlesPositions = new Float32Array([
//   0, 0, 0, 1, 0, 0, 0, 1, 0, 0, 0, 1, -1, 0, 0, 0, -1, 0, 0, 0, -1,
// ]);

const count = 500;
const particlesPositions = new Float32Array(count * 3);
const particlesColors = new Float32Array(count * 3);

for (let i = 0; i < count * 3; i++) {
  particlesPositions[i] = (Math.random() - 0.5) * 10;
  particlesColors[i] = Math.random();
}

particleGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(particlesPositions, 3)
);
particleGeometry.setAttribute(
  "color",
  new THREE.BufferAttribute(particlesColors, 3)
);

// Material
const particlesMaterial = new THREE.PointsMaterial({
  color: 0xff88cc,
});
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true;
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// particlesMaterial.alphaTest = 0.001;
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;

// Particles
const particles = new THREE.Points(particleGeometry, particlesMaterial);
scene.add(particles);

// const cube = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(cube);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.z = 3;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer();
const canvas = renderer.domElement;
document.body.appendChild(canvas);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Tick
 */
const clock = new THREE.Clock();

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Particles
  //   particles.rotation.y = elapsedTime * 0.8;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    const x = particleGeometry.attributes.position.array[i3 + 0];
    particleGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particleGeometry.attributes.position.needsUpdate = true;

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // next frame
  window.requestAnimationFrame(tick);
};
tick();
