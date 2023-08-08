import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import { FontLoader } from "three/examples/jsm/loaders/FontLoader";
import { TextGeometry } from "three/examples/jsm/geometries/TextGeometry";

// Loading Manager
const loadingManager = new THREE.LoadingManager();
// loadingManager.onStart = () => {
//   console.log("onStart");
// };
// loadingManager.onLoad = () => {
//   console.log("onLoad");
// };
// loadingManager.onProgress = () => {
//   console.log("onProgress");
// };
// loadingManager.onError = () => {
//   console.log("onError");
// };

/**
 * Texture Loader
 */
const textureLoader = new THREE.TextureLoader(loadingManager);
const matcapTexture = textureLoader.load("./assets/textures/matcaps/1.png");

/**
 * Font Loader
 */

const fontLoader = new FontLoader(loadingManager);

fontLoader.load("./assets/fonts/helvetiker_regular.typeface.json", (font) => {
  const textGeometry = new TextGeometry("Hello Three.js", {
    font: font,
    size: 0.5,
    height: 0.2,
    curveSegments: 12,
    bevelEnabled: true,
    bevelThickness: 0.03,
    bevelSize: 0.02,
    bevelOffset: 0,
    bevelSegments: 4,
  });
  // textGeometry.computeBoundingBox();
  // let boundingBox = textGeometry.boundingBox!;
  // textGeometry.translate(
  //   -(boundingBox.max.x - 0.02) * 0.5,
  //   -(boundingBox.max.y - 0.02) * 0.5,
  //   -(boundingBox.max.z - 0.03) * 0.5
  // );
  textGeometry.center();
  // const textMaterial = new THREE.MeshBasicMaterial({ wireframe: true });
  const textMaterial = new THREE.MeshMatcapMaterial({ matcap: matcapTexture });
  const text = new THREE.Mesh(textGeometry, textMaterial);
  scene.add(text);

  console.time("donut");
  const donutGeometry = new THREE.TorusGeometry(0.3, 0.2, 20, 45);
  const donutMaterial = new THREE.MeshMatcapMaterial({
    matcap: matcapTexture,
  });
  for (let i = 0; i < 100; i++) {
    const donut = new THREE.Mesh(donutGeometry, donutMaterial);
    donut.position.x = (Math.random() - 0.5) * 10;
    donut.position.y = (Math.random() - 0.5) * 10;
    donut.position.z = (Math.random() - 0.5) * 10;

    donut.rotation.x = Math.random() * Math.PI;
    donut.rotation.y = Math.random() * Math.PI;

    let rnd = Math.random();
    donut.scale.x = rnd;
    donut.scale.y = rnd;
    donut.scale.z = rnd;

    scene.add(donut);
  }
  console.timeEnd("donut");
  // console.log(textGeometry.boundingBox);
});

/**
 * Window Events
 */
// Resize
window.addEventListener("resize", () => {
  // Update Sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = sizes.width / sizes.height;
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
 * Axes Helper
 */
const axesHelper = new THREE.AxesHelper();
axesHelper.visible = false;
scene.add(axesHelper);

// Resources
/**
 * 1.https://gero3.github.io/facetype.js/
 */

/**
 * Objects
 */

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

/**
 * Camera
 */
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(1, 1, 2);
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

// Clock
// const clock = new THREE.Clock();

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  // const elapsedTime = clock.getElapsedTime();

  // Render
  renderer.render(scene, camera);

  // Request Animation Frame
  window.requestAnimationFrame(tick);
};
tick();
