import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as dat from "dat.gui";
import { RectAreaLightHelper } from "three/examples/jsm/helpers/RectAreaLightHelper";

/**
 * Debug
 */
const gui = new dat.GUI({ closed: true });

/**
 * Window Events
 */
window.addEventListener("resize", () => {
  // Update sizes
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
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0x00ffcc, 0.3);
directionalLight.position.set(1, 0.25, 0);
scene.add(directionalLight);

// Hemisphere Light
const hemisphereLight = new THREE.HemisphereLight(0xff0000, 0x0000ff, 0.3);
scene.add(hemisphereLight);

// Point Light
const pointLight = new THREE.PointLight(0xff9000, 0.5, 10, 2);
pointLight.position.set(1, -0.5, 1);
scene.add(pointLight);

// Rect Area Light
const rectAreaLight = new THREE.RectAreaLight(0x4e00ff, 2, 1, 1);
rectAreaLight.position.set(-1.5, 0, 1.5);
rectAreaLight.lookAt(new THREE.Vector3());
scene.add(rectAreaLight);

// Spot Light
const spotLight = new THREE.SpotLight(
  0x78ff00,
  0.5,
  10,
  Math.PI * 0.1,
  0.25,
  1
);
spotLight.position.set(0, 2, 3);
spotLight.lookAt(new THREE.Vector3());
scene.add(spotLight);
spotLight.target.position.x = -1.75;
scene.add(spotLight.target);

//>>>>>>>> Light Helpers

// 1.HemiSphere Light Helper
const hemisphereLightHelper = new THREE.HemisphereLightHelper(
  hemisphereLight,
  0.2
);
scene.add(hemisphereLightHelper);

// 2.Directional Light Helper
const directionalLightHelper = new THREE.DirectionalLightHelper(
  directionalLight,
  0.2
);
scene.add(directionalLightHelper);

// 3.Point Light Helper
const pointLightHelper = new THREE.PointLightHelper(pointLight, 0.2);
scene.add(pointLightHelper);

// 4.Spot Light Helper
const spotLightHelper = new THREE.SpotLightHelper(spotLight);
window.requestAnimationFrame(() => {
  spotLightHelper.update();
});
scene.add(spotLightHelper);

// 5.Rect Area Light Helper
const rectAreaLightHelper = new RectAreaLightHelper(rectAreaLight);
scene.add(rectAreaLightHelper);

//>>>>>>>> Debug GUI

// 1.Debug Ambient Light
const ambientLightGUI = gui.addFolder("Ambient  Light");
ambientLightGUI.add(ambientLight.position, "x").min(-5).max(5).step(0.0001);
ambientLightGUI.add(ambientLight.position, "y").min(-5).max(5).step(0.0001);
ambientLightGUI.add(ambientLight.position, "z").min(-5).max(5).step(0.0001);
ambientLightGUI.add(ambientLight, "intensity").min(0).max(1).step(0.0001);

// 2.Debug Directional Light
const directionalLightGUI = gui.addFolder("Directional Light");
directionalLightGUI
  .add(directionalLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.0001);
directionalLightGUI
  .add(directionalLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.0001);
directionalLightGUI
  .add(directionalLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.0001);
directionalLightGUI
  .add(directionalLight, "intensity")
  .min(0)
  .max(1)
  .step(0.0001);

// 3.Debug HemiSphere Light
const hemisphereLightGUI = gui.addFolder("Hemisphere Light");
hemisphereLightGUI
  .add(hemisphereLight.position, "x")
  .min(-5)
  .max(5)
  .step(0.0001);
hemisphereLightGUI
  .add(hemisphereLight.position, "y")
  .min(-5)
  .max(5)
  .step(0.0001);
hemisphereLightGUI
  .add(hemisphereLight.position, "z")
  .min(-5)
  .max(5)
  .step(0.0001);
hemisphereLightGUI.add(hemisphereLight, "intensity").min(0).max(1).step(0.0001);

// 4.Debug Point Light
const pointLightGUI = gui.addFolder("Point Light");
pointLightGUI.add(pointLight, "distance").min(0).max(10).step(0.0001);
pointLightGUI.add(pointLight, "decay").min(0).max(10).step(0.0001);
pointLightGUI.add(pointLight, "intensity").min(0).max(1).step(0.0001);
pointLightGUI.add(pointLight.position, "x").min(-5).max(5).step(0.0001);
pointLightGUI.add(pointLight.position, "y").min(-5).max(5).step(0.0001);
pointLightGUI.add(pointLight.position, "z").min(-5).max(5).step(0.0001);

// 5.Debug Rect Area Light
const rectAreaLightGUI = gui.addFolder("Rect Area Light");
rectAreaLightGUI.add(rectAreaLight, "intensity").min(0).max(1).step(0.0001);
rectAreaLightGUI.add(rectAreaLight.position, "x").min(-5).max(5).step(0.0001);
rectAreaLightGUI.add(rectAreaLight.position, "y").min(-5).max(5).step(0.0001);
rectAreaLightGUI.add(rectAreaLight.position, "z").min(-5).max(5).step(0.0001);
rectAreaLightGUI.add(rectAreaLight, "width").min(0).max(5).step(0.0001);
rectAreaLightGUI.add(rectAreaLight, "height").min(0).max(5).step(0.0001);

// 5.Debug Spot Light
const spotLightGUI = gui.addFolder("Spot Light");
spotLightGUI.add(spotLight, "penumbra").min(0).max(1).step(0.0001);
spotLightGUI.add(spotLight, "distance").min(0).max(10).step(0.0001);
spotLightGUI.add(spotLight, "decay").min(0).max(10).step(0.0001);
spotLightGUI.add(spotLight, "intensity").min(0).max(1).step(0.0001);
spotLightGUI.add(spotLight.position, "x").min(-5).max(5).step(0.0001);
spotLightGUI.add(spotLight.position, "y").min(-5).max(5).step(0.0001);
spotLightGUI.add(spotLight.position, "z").min(-5).max(5).step(0.0001);

/**
 * Objects
 */
// Material
const material = new THREE.MeshStandardMaterial();
material.roughness = 0.4;

// Meshes

// Sphere
const sphere = new THREE.Mesh(new THREE.SphereGeometry(0.5, 32, 32), material);
sphere.position.x = -1.5;
// Cube
const cube = new THREE.Mesh(new THREE.BoxGeometry(0.75, 0.75, 0.75), material);
// Torus
const torus = new THREE.Mesh(
  new THREE.TorusGeometry(0.3, 0.2, 64, 128),
  material
);
torus.position.x = 1.5;
// Plane
const plane = new THREE.Mesh(new THREE.PlaneGeometry(5, 5), material);
plane.rotation.x = -Math.PI * 0.5;
plane.position.y = -0.65;

scene.add(sphere, cube, torus, plane);

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
const clock = new THREE.Clock();

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  //   Update Objects
  sphere.rotation.x = 0.15 * elapsedTime;
  cube.rotation.x = 0.15 * elapsedTime;
  torus.rotation.x = 0.15 * elapsedTime;

  sphere.rotation.y = 0.1 * elapsedTime;
  cube.rotation.y = 0.1 * elapsedTime;
  torus.rotation.y = 0.1 * elapsedTime;

  // Render
  renderer.render(scene, camera);

  // Request Animation Frame
  window.requestAnimationFrame(tick);
};
tick();
