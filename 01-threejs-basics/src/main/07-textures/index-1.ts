import "../style.css";
import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

/**
 * Textures
 */

// -----> 1.way
// const image = new Image();
// const texture = new THREE.Texture(image);
// image.onload = () => {
//   console.log("image loaded");
//   texture.needsUpdate = true;
// };
// image.src = "./textures/door/color.jpg";

// -----> 2.way
// const textureLoader = new THREE.TextureLoader();
// const texture = textureLoader.load(
//   "./textures/door/color.jpg",
//   () => {
//     console.log("load");
//   },
//   () => {
//     console.log("progress");
//   },
//   () => {
//     console.log("error");
//   }
// );

// -----> 3.way
const loadingManager = new THREE.LoadingManager();
loadingManager.onStart = () => {
  console.log("onStart");
};
loadingManager.onLoad = () => {
  console.log("onLoad");
};
loadingManager.onProgress = () => {
  console.log("onProgress");
};
loadingManager.onError = () => {
  console.log("onError");
};
const textureLoader = new THREE.TextureLoader(loadingManager);
// const colorTexture = textureLoader.load("./textures/door/color.jpg");
const colorTexture = textureLoader.load("./textures/minecraft.png");
// const colorTexture = textureLoader.load(
//   "./textures/checkerboard-8x8.png"
// );
// const colorTexture = textureLoader.load(
//   "./textures/checkerboard-1024x1024.png"
// );
// const alphaTexture = textureLoader.load("./textures/door/alpha.jpg");
// const heightTexture = textureLoader.load("./textures/door/height.jpg");
// const normalTexture = textureLoader.load("./textures/door/normal.jpg");
// const ambientOcclusionTexture = textureLoader.load(
//   "./textures/door/ambientOcclusion.jpg"
// );
// const metalnessTexture = textureLoader.load(
//   "./textures/door/metalness.jpg"
// );
// const roughnessTexture = textureLoader.load(
//   "./textures/door/roughness.jpg"
// );

//----- Transforming Texture
// 1.Repeat
// colorTexture.repeat.set(2, 3);
// colorTexture.wrapS = THREE.RepeatWrapping;
// colorTexture.wrapT = THREE.RepeatWrapping;
// colorTexture.wrapS = THREE.MirroredRepeatWrapping;
// colorTexture.wrapT = THREE.MirroredRepeatWrapping;
// colorTexture.offset.set(0.5, 0.5);

//2.Rotation
// colorTexture.rotation = Math.PI * 0.25;
// colorTexture.center.set(0.5, 0.5);

//----- Minification and Mip mapping
colorTexture.minFilter = THREE.NearestFilter;
// =====When we use NearestFilter in minFilter we don't need mip mapping
colorTexture.generateMipmaps = false;
colorTexture.magFilter = THREE.NearestFilter;

/**
 * When preparing your textures, keep in mind 3 crucial elements
 * 1.Weight
 * 2.Size (or the resolution ex.1024x1024,720x720,144x144 etc
 * are sizes ,texture size must be low and divided by 2 )
 * 3.data
 */

// Resources
/**
 * 1.tinypng.com
 * 2.basis type
 * 3.poliigon.com
 * 4.3dtextures.me
 * 5.arroway-textures.ch
 */

// Textures support transparency but we can't have transparency in .jpg if we want to have only one texture that combine color and alpha, we better use .png file

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

// Full Screen
// const exitFullScreen = async () => {
//   await document.exitFullscreen();
// };
// const goFullScreen = async () => {
//   await canvas.requestFullscreen();
// };
// window.addEventListener("dblclick", () => {
//   if (document.fullscreenElement) {
//     exitFullScreen();
//   } else {
//     goFullScreen();
//   }
// });

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas")!;

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Objects
 */
const geometry = new THREE.BoxGeometry(1, 1, 1);

// const material = new THREE.MeshBasicMaterial({ color: 0xff0000 });
// const material = new THREE.MeshBasicMaterial({ map: texture });
const material = new THREE.MeshBasicMaterial({ map: colorTexture });
// const material = new THREE.MeshBasicMaterial({ map: alphaTexture });
// const material = new THREE.MeshBasicMaterial({ map: heightTexture });
// const material = new THREE.MeshBasicMaterial({ map: normalTexture });
// const material = new THREE.MeshBasicMaterial({ map: ambientOcclusionTexture });
// const material = new THREE.MeshBasicMaterial({ map: metalnessTexture });
// const material = new THREE.MeshBasicMaterial({ map: roughnessTexture });

const mesh = new THREE.Mesh(geometry, material);
scene.add(mesh);

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
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

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
