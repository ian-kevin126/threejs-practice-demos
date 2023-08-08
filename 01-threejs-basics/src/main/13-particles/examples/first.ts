import "../../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Debug GUI
 */
const gui = new dat.GUI();

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
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Scene
 */
const scene = new THREE.Scene();
/**
 * Texture Loader
 */
// const textureLoader = new THREE.TextureLoader();

/**
 * Geometry
 */
let obj = {
  count: 100000,
  size: 0.02,
  radius: 8,
  heightDiff: 2,
  width: 6,
  randomnessPower: 2,
  randomness: 0.7,
  insideColor: 0xffff,
  outsideColor: 0xf73e3e,
};

let geometry: THREE.BufferGeometry;
let positions: Float32Array;
let colors: Float32Array;
let material: THREE.PointsMaterial;
let points: THREE.Points;

const make = () => {
  // Destroy Old Points
  if (points !== undefined) {
    geometry.dispose();
    material.dispose();
    scene.remove(points);
  }

  // Geometry
  geometry = new THREE.BufferGeometry();
  // Positions
  positions = new Float32Array(obj.count * 3);
  colors = new Float32Array(obj.count * 3);

  // Calculation points
  let half = obj.count / 2;
  let randomness = obj.randomness;
  let randomnessPower = obj.randomnessPower;
  let width = obj.width;

  let insideColor = new THREE.Color(obj.insideColor);
  let outsideColor = new THREE.Color(obj.outsideColor);

  for (let i = 0; i < obj.count; i++) {
    let i3 = i * 3;
    if (i < half) {
      let radius = Math.random() * (i % obj.radius);
      let spinAngle = radius * 2 * Math.PI;

      let x =
        Math.sin(spinAngle) * radius * (Math.random() < 0 ? -width : width);
      let z =
        Math.cos(spinAngle) * radius * (Math.random() < 0 ? -width : width);
      let y = radius * obj.heightDiff + (Math.random() - 0.5);

      const randomX =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness;
      const randomZ =
        Math.pow(Math.random(), randomnessPower) *
        (Math.random() < 0.5 ? 1 : -1) *
        randomness;

      positions[i3 + 0] = x + randomX;
      positions[i3 + 1] = y + 0;
      positions[i3 + 2] = z + randomZ;

      // Colors
      let mixedColor = insideColor.clone();
      mixedColor.lerp(outsideColor, y / obj.radius);
      colors[i3 + 0] = mixedColor.r;
      colors[i3 + 1] = mixedColor.g;
      colors[i3 + 2] = mixedColor.b;
    } else {
      let index = (i - half) * 3;
      positions[i3 + 0] = -positions[index + 0];
      positions[i3 + 1] = -positions[index + 1];
      positions[i3 + 2] = -positions[index + 2];

      // Colors
      colors[i3 + 0] = colors[index + 0];
      colors[i3 + 1] = colors[index + 1];
      colors[i3 + 2] = colors[index + 2];
    }
  }
  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));
  geometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // Materials
  material = new THREE.PointsMaterial({
    size: obj.size,
    sizeAttenuation: true,
    vertexColors: true,
  });

  // Points
  points = new THREE.Points(geometry, material);
  scene.add(points);
};
make();
gui.add(obj, "count").min(100).max(1000000).step(100).onFinishChange(make);
gui.add(obj, "size").min(0.001).max(0.1).step(0.0001).onFinishChange(make);
gui.add(obj, "radius").min(1).max(10).step(0.01).onFinishChange(make);
gui.add(obj, "heightDiff").min(1).max(10).step(0.01).onFinishChange(make);
gui.add(obj, "width").min(1).max(10).step(0.01).onFinishChange(make);
gui.add(obj, "randomness").min(0.01).max(5).step(0.001).onFinishChange(make);
gui.add(obj, "randomnessPower").min(1).max(5).step(0.01).onFinishChange(make);
gui.addColor(obj, "insideColor").onFinishChange(make);
gui.addColor(obj, "outsideColor").onFinishChange(make);

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
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 1000);
camera.position.z = 100;
camera.position.y = 5;
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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Tick
 */
// const clock = new THREE.Clock();

const tick = () => {
  // Elapsed Time
  // const elapsedTime = clock.getElapsedTime();

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // next frame
  window.requestAnimationFrame(tick);
};
tick();
