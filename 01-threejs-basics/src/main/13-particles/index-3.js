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
// // Geometry
// const particlesGeometry = new THREE.SphereGeometry(1, 32, 32);

// // Materials
// const particlesMaterial = new THREE.PointsMaterial({
//   size: 0.02,
//   sizeAttenuation: true,
// });

// // Points
// const particles = new THREE.Points(particlesGeometry, particlesMaterial);
// scene.add(particles);

// Custom Geometry
const particlesGeometry = new THREE.BufferGeometry();
const particlesMaterial = new THREE.PointsMaterial();
particlesMaterial.size = 0.1;
particlesMaterial.sizeAttenuation = true;
// particlesMaterial.color = new THREE.Color(0xff88cc);
particlesMaterial.transparent = true;
particlesMaterial.alphaMap = particleTexture;
// particlesMaterial.alphaTest = 0.001;
// particlesMaterial.depthTest = false;
particlesMaterial.depthWrite = false;
particlesMaterial.blending = THREE.AdditiveBlending;
particlesMaterial.vertexColors = true;

const count = 20000;
const positions = new Float32Array(count * 3);
const colors = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  let index = i * 3;
  positions[index + 0] = (Math.random() - 0.5) * 10;
  positions[index + 1] = (Math.random() - 0.5) * 10;
  positions[index + 2] = (Math.random() - 0.5) * 10;

  // Colors
  colors[index + 0] = Math.random();
  colors[index + 1] = Math.random();
  colors[index + 2] = Math.random();
}
particlesGeometry.setAttribute(
  "position",
  new THREE.BufferAttribute(positions, 3)
);
particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

const particles = new THREE.Points(particlesGeometry, particlesMaterial);
scene.add(particles);

// mesh
// const box = new THREE.Mesh(
//   new THREE.BoxGeometry(1, 1, 1),
//   new THREE.MeshBasicMaterial()
// );
// scene.add(box);

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
  // particles.rotation.y = elapsedTime * 0.3;
  for (let i = 0; i < count; i++) {
    const i3 = i * 3;
    let x = particlesGeometry.attributes.position.array[i3];
    particlesGeometry.attributes.position.array[i3 + 1] = Math.sin(
      elapsedTime + x
    );
  }
  particlesGeometry.attributes.position.needsUpdate = true;

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // next frame
  window.requestAnimationFrame(tick);
};

tick();
