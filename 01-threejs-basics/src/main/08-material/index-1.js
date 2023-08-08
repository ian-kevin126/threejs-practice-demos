import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";

/**
 * Debug
 */
const gui = new dat.GUI();

/**
 * Textures
 */

// Loading Manager
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

// Texture Loader
const textureLoader = new THREE.TextureLoader(loadingManager);
// Cube Texture Loader
const cubeTextureLoader = new THREE.CubeTextureLoader(loadingManager);

// All Textures
// const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
// const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
// const doorNormalTexture = textureLoader.load(
//   "./textures/door/normal.jpg"
// );
// const doorHeightTexture = textureLoader.load(
//   "./textures/door/height.jpg"
// );
// const doorAmbientOcclusionTexture = textureLoader.load(
//   "./textures/door/ambientOcclusion.jpg"
// );
// const doorMetalnessTexture = textureLoader.load(
//   "./textures/door/metalness.jpg"
// );
// const doorRoughnessTexture = textureLoader.load(
//   "./textures/door/roughness.jpg"
// );
// const matcapTexture = textureLoader.load("./textures/matcaps/1.png");
const gradientTexture = textureLoader.load("./textures/gradients/3.jpg");

gradientTexture.generateMipmaps = false;
gradientTexture.minFilter = THREE.NearestFilter;
gradientTexture.magFilter = THREE.NearestFilter;

const environmentMapTexture = cubeTextureLoader.load([
  "./textures/environmentMaps/0/px.jpg",
  "./textures/environmentMaps/0/nx.jpg",
  "./textures/environmentMaps/0/py.jpg",
  "./textures/environmentMaps/0/ny.jpg",
  "./textures/environmentMaps/0/pz.jpg",
  "./textures/environmentMaps/0/nz.jpg",
]);

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
 * Objects
 */

// 1.way
// const material = new THREE.MeshBasicMaterial({ map: doorColorTexture });

// 2.way
// const material = new THREE.MeshBasicMaterial();
// material.map = doorColorTexture;
// material.color = new THREE.Color(0xff0000);
// material.wireframe = true;
// material.transparent = true;
// material.opacity = 0.5;
// material.alphaMap = doorAlphaTexture;
// material.side = THREE.FrontSide;
// material.side = THREE.BackSide;
// material.side = THREE.DoubleSide;

// Mesh Normal Material
// const material = new THREE.MeshNormalMaterial();
// material.wireframe = true;
// material.flatShading = true;

// Mesh Matcap Material
// const material = new THREE.MeshMatcapMaterial();
// material.matcap = matcapTexture;

// Mesh Depth Material
// const material = new THREE.MeshDepthMaterial();

// Mesh LambertMaterial
// const material = new THREE.MeshLambertMaterial();

// Mesh Phong Material
// const material = new THREE.MeshPhongMaterial();
// material.shininess = 100;
// material.specular = new THREE.Color(0x1188ff);

// Mesh Toon material
// const material = new THREE.MeshToonMaterial();
// material.gradientMap = gradientTexture;

// Mesh Standard Material
// const material = new THREE.MeshStandardMaterial();
// material.metalness = 0.45;
// material.roughness = 0.65;
// material.map = doorColorTexture;
// material.aoMap = doorAmbientOcclusionTexture;
// material.aoMapIntensity = 1;
// material.displacementMap = doorHeightTexture;
// material.displacementScale = 0.05;
// material.metalnessMap = doorMetalnessTexture;
// material.roughnessMap = doorRoughnessTexture;
// material.normalMap = doorNormalTexture;
// material.normalScale.set(0.5, 0.5);
// material.transparent = true;
// material.alphaMap = doorAlphaTexture;

const material = new THREE.MeshStandardMaterial();
material.metalness = 0.7;
material.roughness = 0.2;
material.envMap = environmentMapTexture;

// Debug
gui.add(material, "metalness").min(0).max(1).step(0.0001);
gui.add(material, "roughness").min(0).max(1).step(0.0001);
gui.add(material, "aoMapIntensity").min(0).max(10).step(0.0001);
gui.add(material, "displacementScale").min(0).max(1).step(0.0001);
gui.add(material, "envMapIntensity").min(0).max(10).step(0.0001);

// Resources
/**
 * 1.hdrihaven.com,polyhaven.com
 * 2.https://matheowis.github.io/HDRI-to-CubeMap/
 */

// sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 64, 64), material);
sphere.position.x = -1.5;
sphere.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(sphere.geometry.attributes.uv.array, 2)
);

// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1, 100, 100), material);
plane.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(plane.geometry.attributes.uv.array, 2)
);

// torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(torus.geometry.attributes.uv.array, 2)
);
torus.position.x = 1.5;

scene.add(sphere, plane, torus);

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);

// Point Light
const pointLight = new THREE.PointLight(0xffffff, 0.5);
pointLight.position.set(2, 3, 4);

scene.add(ambientLight, pointLight);

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

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Controls
 */
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Tick
 */

// Clock
const clock = new THREE.Clock();

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  //   Update Objects
  sphere.rotation.x = 0.15 * elapsedTime;
  plane.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  sphere.rotation.y = 0.1 * elapsedTime;
  plane.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Request Animation Frame
  window.requestAnimationFrame(tick);
};
tick();
