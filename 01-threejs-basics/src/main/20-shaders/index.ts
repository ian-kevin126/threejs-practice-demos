import "../../style.css";
import * as THREE from "three";
// import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import vertexShader from "./shaders/second/vertex.vs.glsl?raw";
import fragmentShader from "./shaders/second/fragment.fs.glsl?raw";
// import BasicCustomShader from "./shaders/CustomMaterial/BasicCustomShader";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Debug GUI
 */
// const gui = new dat.GUI();

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
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const flagTexture = textureLoader.load(
  "../../../textures/flag-indian.png"
);
/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);
// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(0, 5, 5);
directionalLight.castShadow = true;
scene.add(directionalLight);
/**
 * Test mesh
 */
// Geometry
const geometry = new THREE.PlaneGeometry(1, 1, 32, 32);

const count = geometry.attributes.position.count;
const randoms = new Float32Array(count);

for (let i = 0; i < count; i++) {
  randoms[i] = Math.random();
}

geometry.setAttribute("aRandom", new THREE.BufferAttribute(randoms, 1));

// Material
const material = new THREE.ShaderMaterial({
  fragmentShader,
  vertexShader,
  // transparent: true,
  uniforms: {
    uFrequency: { value: new THREE.Vector2(10, 5) },
    uTime: { value: 0 },
    uColor: { value: new THREE.Color(0x00ffff) },
    uTexture: { value: flagTexture },
  },
});
// const material = new THREE.ShaderMaterial({
//   ...BasicCustomShader,
//   fog: true,
//   lights: true,
//   dithering: true,
// });

// gui
//   .add(material.uniforms.uFrequency.value, "x")
//   .min(0)
//   .max(20)
//   .step(0.01)
//   .name("uFrequencyX");
// gui
//   .add(material.uniforms.uFrequency.value, "y")
//   .min(0)
//   .max(20)
//   .step(0.01)
//   .name("uFrequencyY");

// Mesh
const mesh = new THREE.Mesh(geometry, material);
mesh.scale.y = 2 / 3;
mesh.position.y = 0.65;
mesh.castShadow = true;
scene.add(mesh);

/**
 * Floor
 */
let lightMaterial = new THREE.MeshStandardMaterial();
const floor = new THREE.Mesh(new THREE.PlaneGeometry(50, 50), lightMaterial);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = -0.5;
floor.receiveShadow = true;
scene.add(floor);

/**
 * Pole
 */
const poleGeometry = new THREE.CylinderGeometry(0.025, 0.025, 2);
const pole = new THREE.Mesh(poleGeometry, lightMaterial);
pole.castShadow = true;
pole.position.x = -0.55;
scene.add(pole);

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
// camera.position.set(0.25, -0.25, 1);
camera.position.set(-2, 2, 4);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
updateRenderer();

/**
 * Tick
 */
// const clock = new THREE.Clock();

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  // const elapsedTime = clock.getElapsedTime();

  // Update Materials
  // material.uniforms.uTime.value = elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
