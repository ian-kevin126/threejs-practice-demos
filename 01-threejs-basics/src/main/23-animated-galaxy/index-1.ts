import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import fragmentShader from "./shaders/galaxy-fragment/fragment.fs.glsl?raw";
import vertexShader from "./shaders/galaxy-vertex/vertex.vs.glsl?raw";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Debug GUI
 */
const gui = new dat.GUI();

/**
 * Window Events
 */
window.addEventListener("resize", () => {
  // Update Sizes
  updateSizes();

  // Update Camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update Renderer
  updateRenderer();
});

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Galaxy
 */
const parameters = {
  count: 200000,
  size: 0.005,
  radius: 5,
  branches: 3,
  spin: 1,
  randomness: 0.5,
  randomnessPower: 3,
  insideColor: "#ff6030",
  outsideColor: "#1b3984",
};

let geometry: THREE.BufferGeometry;
let material: THREE.ShaderMaterial;
let points: THREE.Points;

const generateGalaxy = () => {
  if (points !== undefined) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  /**
   * Geometry
   */
  geometry = new THREE.BufferGeometry();

  const positions = new Float32Array(parameters.count * 3);
  const colors = new Float32Array(parameters.count * 3);
  const scales = new Float32Array(parameters.count);
  const randomness = new Float32Array(parameters.count * 3);

  const insideColor = new THREE.Color(parameters.insideColor);
  const outsideColor = new THREE.Color(parameters.outsideColor);

  for (let i = 0; i < parameters.count; i++) {
    const i3 = i * 3;

    // Position
    const radius = Math.random() * parameters.radius;

    const branchAngle =
      ((i % parameters.branches) / parameters.branches) * Math.PI * 2;

    positions[i3] = Math.cos(branchAngle) * radius;
    positions[i3 + 1] = 0;
    positions[i3 + 2] = Math.sin(branchAngle) * radius;

    // Randomness
    const randomX =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomY =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    const randomZ =
      Math.pow(Math.random(), parameters.randomnessPower) *
      (Math.random() < 0.5 ? 1 : -1) *
      parameters.randomness *
      radius;
    randomness[i3 + 0] = randomX;
    randomness[i3 + 1] = randomY;
    randomness[i3 + 2] = randomZ;

    // Color
    const mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / parameters.radius);

    colors[i3] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;

    // Scales
    scales[i] = Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));
  geometry.setAttribute("aScale", new THREE.BufferAttribute(scales, 1));
  geometry.setAttribute(
    "aRandomness",
    new THREE.BufferAttribute(randomness, 3)
  );

  /**
   * Material
   */
  material = new THREE.ShaderMaterial({
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    vertexColors: true,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    uniforms: {
      uSize: { value: 30.0 * renderer.getPixelRatio() },
      uTime: { value: 0 },
    },
  });

  /**
   * Points
   */
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

gui
  .add(parameters, "count")
  .min(100)
  .max(1000000)
  .step(100)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "radius")
  .min(0.01)
  .max(20)
  .step(0.01)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "branches")
  .min(2)
  .max(20)
  .step(1)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomness")
  .min(0)
  .max(2)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui
  .add(parameters, "randomnessPower")
  .min(1)
  .max(10)
  .step(0.001)
  .onFinishChange(generateGalaxy);
gui.addColor(parameters, "insideColor").onFinishChange(generateGalaxy);
gui.addColor(parameters, "outsideColor").onFinishChange(generateGalaxy);

/**
 * Sizes
 */
const sizes = {
  width: 0,
  height: 0,
};

const aspectRatio = () => {
  return sizes.width / sizes.height;
};

const updateSizes = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};

updateSizes();

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(3, 3, 3);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas });
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Generate Galaxy
 */
generateGalaxy();

/**
 * Tick
 */
const clock = new THREE.Clock();
const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Update Materials
  material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
