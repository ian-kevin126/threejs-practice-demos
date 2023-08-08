import * as THREE from "three";
// import * as dat from "dat.gui";
import { DRACOLoader } from "three/examples/jsm/loaders/DRACOLoader";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Debug GUI
 */
// const gui = new dat.GUI();

/**
 * Window Events
 */
// Resize
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
 * Models
 */
const dracoLoader = new DRACOLoader();
dracoLoader.setDecoderPath("./assets/draco/");
const gltfLoader = new GLTFLoader();
gltfLoader.setDRACOLoader(dracoLoader);

// Duck Model

// 1.GLTF
// gltfLoader.load("../../../models/Duck/glTF/Duck.gltf", (gltf) => {
//   const duck = gltf.scene.children[0].children[1];
//   duck.scale.set(0.01, 0.01, 0.01);
//   scene.add(duck);
// });

// 2.Binary
// gltfLoader.load("../../../models/Duck/glTF-Binary/Duck.glb", (gltf) => {
//   const duck = gltf.scene.children[0].children[1];
//   duck.scale.set(0.01, 0.01, 0.01);
//   scene.add(duck);
// });

// 3.Binary
// gltfLoader.load("../../../models/Duck/glTF-Draco/Duck.gltf", (gltf) => {
//   const duck = gltf.scene.children[0].children[1];
//   duck.scale.set(0.01, 0.01, 0.01);
//   scene.add(duck);
// });

// 4.Binary
// gltfLoader.load("../../../models/Duck/glTF-Embedded/Duck.gltf", (gltf) => {
//   const duck = gltf.scene.children[0].children[1];
//   duck.scale.set(0.01, 0.01, 0.01);
//   scene.add(duck);
// });

// 2.FlightHelmet Model
// gltfLoader.load(
//   "../../../models/FlightHelmet/glTF/FlightHelmet.gltf",
//   (gltf) => {
//     // while (gltf.scene.children.length) {
//     //   scene.add(gltf.scene.children[0]);
//     // }

//     const children = [...gltf.scene.children];
//     children.forEach((child) => {
//       scene.add(child);
//     });
//   }
// );

// 3.Fox Model
let mixer;
gltfLoader.load("./assets/models/Fox/glTF/Fox.gltf", (gltf) => {
  const fox = gltf.scene;
  mixer = new THREE.AnimationMixer(fox);
  const action = mixer.clipAction(gltf.animations[2]);
  action.play();

  fox.scale.set(0.025, 0.025, 0.025);
  scene.add(fox);
});

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({ color: 0x444444, roughness: 0.5 })
);
floor.receiveShadow = true;
floor.rotation.x = Math.PI * -0.5;
scene.add(floor);

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(ambientLight);
// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.6);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.top = 7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

/**
 * Sizes
 */
const sizes = {
  width: 0,
  height: 0,
};
const updateSizes = () => {
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;
};
updateSizes();
const aspectRatio = () => {
  return sizes.width / sizes.height;
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.set(2, 2, 2);
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

renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Animation
 */
// Clock
const clock = new THREE.Clock();
let oldElapsedTime = 0;

// Tick
const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Mixer
  if (mixer) {
    mixer.update(deltaTime);
  }

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
