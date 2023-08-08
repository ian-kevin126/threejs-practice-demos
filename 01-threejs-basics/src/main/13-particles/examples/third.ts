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

// Mouse Events
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  let y = Math.tan((camera.fov * Math.PI) / 180 / 2) * camera.position.z;
  mouse.x = ((event.clientX / sizes.width) * 2 - 1) * aspectRatio() * y;
  mouse.y = -((event.clientY / sizes.height) * 2 - 1) * y;
  make();
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
  count: 10000,
  size: 0.2,
  outerRadius: 20,
  innerRadius: 1,
  insideColor: 0xff0000,
  outsideColor: 0x0000ff,
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

  let insideColor = new THREE.Color(obj.insideColor);
  let outsideColor = new THREE.Color(obj.outsideColor);

  for (let i = 0; i < obj.count; i++) {
    let i3 = i * 3;
    let angle = Math.random() * Math.PI * 2;
    let radius = obj.innerRadius + Math.random() * obj.outerRadius;

    positions[i3 + 0] = Math.sin(angle) * radius;
    positions[i3 + 1] = Math.cos(angle) * radius;
    positions[i3 + 2] = 0;

    // Colors
    let mixedColor = insideColor.clone();
    mixedColor.lerp(outsideColor, radius / (obj.innerRadius + obj.outerRadius));
    colors[i3 + 0] = mixedColor.r;
    colors[i3 + 1] = mixedColor.g;
    colors[i3 + 2] = mixedColor.b;
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
  points.position.set(mouse.x, mouse.y, 0);
  scene.add(points);
};

gui.add(obj, "count").min(100).max(1000000).step(100).onFinishChange(make);
gui.add(obj, "size").min(0.001).max(0.1).step(0.0001).onFinishChange(make);

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
camera.position.z = 7;
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
 * Ray caster
 */
// const rayCaster = new THREE.Raycaster();

/**
 * Tick
 */
// const clock = new THREE.Clock();

const tick = () => {
  // Elapsed Time
  // const elapsedTime = clock.getElapsedTime();

  // Update
  // rayCaster.setFromCamera(mouse, camera);
  //   if (points) {
  //     for (let i = 0; i < obj.count; i++) {
  //       let i3 = i * 3;
  //       geometry.attributes.position.array[i3 + 0] =
  //         geometry.attributes.position.array[i3 + 0] * 1.05;
  //       geometry.attributes.position.array[i3 + 1] =
  //         geometry.attributes.position.array[i3 + 1] * 1.05;
  //       geometry.attributes.position.array[i3 + 2] = 0;
  //     }
  //     geometry.attributes.position.needsUpdate = true;
  //   }

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // next frame
  window.requestAnimationFrame(tick);
};
tick();
