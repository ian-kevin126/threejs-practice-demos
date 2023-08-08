import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shaders/vertex-shaders/vertex.vs.glsl?raw";
import fragmentShader from "./shaders/fragment-shaders/fragment.fs.glsl?raw";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Debug GUI
 */
const gui = new dat.GUI({ width: 340 });
const debugObject = {
  depthColor: 0x186691,
  surfaceColor: 0x9bd8ff,
};

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
 * Geometry
 */
const geometry = new THREE.PlaneGeometry(10, 10, 512, 512);

/**
 * Material
 */
const material = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader,
  uniforms: {
    uTime: { value: 0 },

    uBigWavesElevation: { value: 0.2 },
    uBigWavesFrequency: { value: new THREE.Vector2(4, 1.5) },
    uBigWavesSpeed: { value: 0.75 },

    uDepthColor: { value: new THREE.Color(debugObject.depthColor) },
    uSurfaceColor: { value: new THREE.Color(debugObject.surfaceColor) },
    uColorOffset: { value: 0.08 },
    uColorMultiplier: { value: 5.0 },

    uSmallWavesElevation: { value: 0.15 },
    uSmallWavesFrequency: { value: 3 },
    uSmallWavesSpeed: { value: 0.2 },
    uSmallIterations: { value: 4.0 },
  },
});

/**
 * Big Waves Debug GUI
 */

gui
  .add(material.uniforms.uBigWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uBigWavesElevation");
gui
  .add(material.uniforms.uBigWavesFrequency.value, "x")
  .min(1)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequency X");
gui
  .add(material.uniforms.uBigWavesFrequency.value, "y")
  .min(1)
  .max(10)
  .step(0.001)
  .name("uBigWavesFrequency Y");
gui
  .add(material.uniforms.uBigWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uBigWavesSpeed");

/**
 * Color Debug GUI
 */
gui.addColor(debugObject, "depthColor").onChange(() => {
  material.uniforms.uDepthColor.value.set(debugObject.depthColor);
});
gui.addColor(debugObject, "surfaceColor").onChange(() => {
  material.uniforms.uSurfaceColor.value.set(debugObject.surfaceColor);
});

gui
  .add(material.uniforms.uColorOffset, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uColorOffset");
gui
  .add(material.uniforms.uColorMultiplier, "value")
  .min(0)
  .max(10)
  .step(0.001)
  .name("uColorMultiplier");

/**
 * Small Waves Debug GUI
 */
gui
  .add(material.uniforms.uSmallWavesElevation, "value")
  .min(0)
  .max(1)
  .step(0.001)
  .name("uSmallWavesElevation");
gui
  .add(material.uniforms.uSmallWavesFrequency, "value")
  .min(0)
  .max(30)
  .step(0.001)
  .name("uSmallWavesFrequency");
gui
  .add(material.uniforms.uSmallWavesSpeed, "value")
  .min(0)
  .max(4)
  .step(0.001)
  .name("uSmallWavesSpeed");
gui
  .add(material.uniforms.uSmallIterations, "value")
  .min(0)
  .max(5)
  .step(0.001)
  .name("uSmallIterations");

/**
 * Mesh
 */
const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);
mesh.rotation.x = -Math.PI * 0.5;

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
camera.position.set(1, 1, 1);
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
 * Tick
 */
const clock = new THREE.Clock();

const tick = () => {
  // Update Controls
  controls.update();

  // Update Time
  const elapsedTime = clock.getElapsedTime();

  // Update Water
  material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
