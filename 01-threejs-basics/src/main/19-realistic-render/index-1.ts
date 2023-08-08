import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Window Events
 */
window.addEventListener("resize", () => {
  // Update Sizes
  updateSizes();

  // Update Camera
  camera.aspect = aspectRatio();
  scene.add(camera);

  // Update Renderer
  updateRenderer();
});

/**
 * Debug GUI
 */
const gui = new dat.GUI();
const debugObject = { envMapIntensity: 0 };

/**
 * Scene
 */
const scene = new THREE.Scene();
/**
 * Update All Materials
 */
const updateAllMaterials = () => {
  scene.traverse((child) => {
    if (
      child instanceof THREE.Mesh &&
      child.material instanceof THREE.MeshStandardMaterial
    ) {
      //   child.material.envMap = environmentMap;
      child.material.envMapIntensity = debugObject.envMapIntensity;
      child.material.needsUpdate = true;
      child.castShadow = true;
      child.receiveShadow = true;
    }
  });
};

/**
 * Environment Maps
 */
// CubeTextureLoader
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMap = cubeTextureLoader.load([
  "../../../textures/environmentMaps/0/px.jpg",
  "../../../textures/environmentMaps/0/nx.jpg",
  "../../../textures/environmentMaps/0/py.jpg",
  "../../../textures/environmentMaps/0/ny.jpg",
  "../../../textures/environmentMaps/0/pz.jpg",
  "../../../textures/environmentMaps/0/nz.jpg",
]);
environmentMap.encoding = THREE.sRGBEncoding;
scene.background = environmentMap;
scene.environment = environmentMap;

debugObject.envMapIntensity = 5;
gui
  .add(debugObject, "envMapIntensity")
  .min(0)
  .max(10)
  .step(0.001)
  .onChange(updateAllMaterials);

/**
 * Models
 */
// GLTFLoader
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// 1.FLightHelmet

// gltfLoader.load(
//   "./models/FlightHelmet/glTF/FlightHelmet.gltf",
//   (gltf) => {
//     gltf.scene.scale.set(10, 10, 10);
//     gltf.scene.position.set(0, -4, 0);
//     gltf.scene.rotation.y = Math.PI * 0.5;
//     scene.add(gltf.scene);

//     gui
//       .add(gltf.scene.rotation, "y")
//       .min(-Math.PI)
//       .max(Math.PI)
//       .step(0.0001)
//       .name("rotation");
//     updateAllMaterials();
//   }
// );

// 2.Hamburger
gltfLoader.load("../../../models/Hamburger/hamburger.glb", (gltf) => {
  gltf.scene.scale.set(0.3, 0.3, 0.3);
  gltf.scene.position.set(0, -1, 0);
  scene.add(gltf.scene);
  gui
    .add(gltf.scene.rotation, "y")
    .min(-Math.PI)
    .max(Math.PI)
    .step(0.001)
    .name("rotation");
  updateAllMaterials();
});

/**
 * Lights
 */
// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 3);
directionalLight.position.set(0.25, 3, -2.25);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.castShadow = true;
directionalLight.shadow.normalBias = 0.05;
scene.add(directionalLight);

// const directionalLightCameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(directionalLightCameraHelper);

gui
  .add(directionalLight, "intensity")
  .min(0)
  .max(10)
  .step(0.001)
  .name("lightIntensity");
gui
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightX");
gui
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightY");
gui
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.001)
  .name("lightZ");

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
camera.position.set(4, 1, -4);
scene.add(camera);

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({ canvas, antialias: true });
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

renderer.physicallyCorrectLights = true;
renderer.outputEncoding = THREE.sRGBEncoding;
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 3;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

gui
  .add(renderer, "toneMapping", {
    No: THREE.NoToneMapping,
    Linear: THREE.LinearToneMapping,
    Reinhard: THREE.ReinhardToneMapping,
    Cineon: THREE.CineonToneMapping,
    ACESFilmic: THREE.ACESFilmicToneMapping,
  })
  .onFinishChange(() => {
    renderer.toneMapping = Number(renderer.toneMapping);
    updateAllMaterials();
  });
gui.add(renderer, "toneMappingExposure").min(0).max(10).step(0.001);

/**
 * Tick
 */
const tick = () => {
  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
