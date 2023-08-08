import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls.js";
import * as dat from "dat.gui";

/**
 * Base
 */
// Debug
const gui = new dat.GUI();

// Scene
const scene = new THREE.Scene();

// Fog
const fog = new THREE.Fog(0x262837, 1, 15);
scene.fog = fog;
/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();

const doorColorTexture = textureLoader.load("./assets/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./assets/door/alpha.jpg");
const doorHeightTexture = textureLoader.load("./assets/door/height.jpg");
const doorNormalTexture = textureLoader.load("./assets/door/normal.jpg");
const doorAmbientOcclusionTexture = textureLoader.load(
  "./assets/door/ambientOcclusion.jpg"
);
const doorMetalnessTexture = textureLoader.load("./assets/door/metalness.jpg");
const doorRoughnessTexture = textureLoader.load("./assets/door/roughness.jpg");

// Bricks Textures
const bricksColorTexture = textureLoader.load("./assets/bricks/color.jpg");
const bricksAmbientOcclusionTexture = textureLoader.load(
  "./assets/bricks/ambientOcclusion.jpg"
);
const bricksNormalTexture = textureLoader.load("./assets/bricks/normal.jpg");
const bricksRoughnessTexture = textureLoader.load(
  "./assets/bricks/roughness.jpg"
);

// Grass Textures
const grassColorTexture = textureLoader.load("./assets/grass/color.jpg");
const grassAmbientOcclusionTexture = textureLoader.load(
  "./assets/grass/ambientOcclusion.jpg"
);
const grassNormalTexture = textureLoader.load("./assets/grass/normal.jpg");
const grassRoughnessTexture = textureLoader.load(
  "./assets/grass/roughness.jpg"
);

grassColorTexture.repeat.set(8, 8);
grassAmbientOcclusionTexture.repeat.set(8, 8);
grassNormalTexture.repeat.set(8, 8);
grassRoughnessTexture.repeat.set(8, 8);

grassColorTexture.wrapS = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapS = THREE.RepeatWrapping;
grassNormalTexture.wrapS = THREE.RepeatWrapping;
grassRoughnessTexture.wrapS = THREE.RepeatWrapping;

grassColorTexture.wrapT = THREE.RepeatWrapping;
grassAmbientOcclusionTexture.wrapT = THREE.RepeatWrapping;
grassNormalTexture.wrapT = THREE.RepeatWrapping;
grassRoughnessTexture.wrapT = THREE.RepeatWrapping;

/**
 * House
 */
// house
const house = new THREE.Group();
scene.add(house);

// house walls
let wallsHeight = 2.5;
let wallsWidth = 4;
const walls = new THREE.Mesh(
  new THREE.BoxGeometry(wallsWidth, wallsHeight, wallsWidth),
  new THREE.MeshStandardMaterial({
    map: bricksColorTexture,
    aoMap: bricksAmbientOcclusionTexture,
    normalMap: bricksNormalTexture,
    roughnessMap: bricksRoughnessTexture,
  })
);
walls.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(walls.geometry.attributes.uv.array, 2)
);
walls.position.y = wallsHeight / 2;
house.add(walls);

// house roof
let roofHeight = 1;
const roof = new THREE.Mesh(
  new THREE.ConeGeometry(3.5, roofHeight, 4),
  new THREE.MeshStandardMaterial({ color: 0xb35f45 })
);
roof.position.y = wallsHeight + roofHeight / 2;
roof.rotation.y = Math.PI * 0.25;
house.add(roof);

// house door
let doorHeight = 2;
let doorWidth = 2;
const door = new THREE.Mesh(
  new THREE.PlaneGeometry(doorHeight, doorWidth, 100, 100),
  new THREE.MeshStandardMaterial({
    map: doorColorTexture,
    transparent: true,
    alphaMap: doorAlphaTexture,
    aoMap: doorAmbientOcclusionTexture,
    displacementMap: doorHeightTexture,
    displacementScale: 0.1,
    normalMap: doorNormalTexture,
    metalnessMap: doorMetalnessTexture,
    roughnessMap: doorRoughnessTexture,
  })
);
door.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(door.geometry.attributes.uv.array, 2)
);
door.position.z = wallsWidth / 2 + 0.01;
door.position.y = doorHeight / 2;
house.add(door);

// Bushes
const bushGeometry = new THREE.SphereGeometry(1, 16, 16);
const bushMaterial = new THREE.MeshStandardMaterial({ color: 0x89c854 });

// bush1
const bush_1 = new THREE.Mesh(bushGeometry, bushMaterial);
bush_1.scale.set(0.5, 0.5, 0.5);
bush_1.position.set(0.8, 0.2, 2.2);

// bush2
const bush_2 = new THREE.Mesh(bushGeometry, bushMaterial);
bush_2.scale.set(0.25, 0.25, 0.25);
bush_2.position.set(1.4, 0.1, 2.1);

// bush3
const bush_3 = new THREE.Mesh(bushGeometry, bushMaterial);
bush_3.scale.set(0.4, 0.4, 0.4);
bush_3.position.set(-0.8, 0.1, 2.2);

// bush4
const bush_4 = new THREE.Mesh(bushGeometry, bushMaterial);
bush_4.scale.set(0.15, 0.15, 0.15);
bush_4.position.set(-1, 0.05, 2.6);

house.add(bush_1, bush_2, bush_3, bush_4);

// Graves
const graves = new THREE.Group();
scene.add(graves);
let graveHeight = 0.8;
const graveGeometry = new THREE.BoxGeometry(0.6, graveHeight, 0.2);
const graveMaterial = new THREE.MeshStandardMaterial({ color: 0xb2b6b1 });

for (let i = 0; i < 50; i++) {
  const angle = Math.random() * Math.PI * 2;
  const radius = Math.random() * 6 + Math.sqrt((wallsWidth * wallsWidth) / 2);
  const x = Math.sin(angle) * radius;
  const z = Math.cos(angle) * radius;

  const grave = new THREE.Mesh(graveGeometry, graveMaterial);
  grave.position.set(x, graveHeight / 2 - 0.1, z);
  grave.rotation.y = (Math.random() - 0.5) * 0.4;
  grave.rotation.z = (Math.random() - 0.5) * 0.4;
  grave.castShadow = true;
  graves.add(grave);
}

// Floor
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(20, 20),
  new THREE.MeshStandardMaterial({
    map: grassColorTexture,
    aoMap: grassAmbientOcclusionTexture,
    normalMap: grassNormalTexture,
    roughnessMap: grassRoughnessTexture,
  })
);
floor.geometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(floor.geometry.attributes.uv.array, 2)
);
floor.rotation.x = -Math.PI * 0.5;
floor.position.y = 0;
scene.add(floor);

/**
 * Lights
 */
// Ambient light
const ambientLight = new THREE.AmbientLight(0xb9d5ff, 0.12);
gui.add(ambientLight, "intensity").min(0).max(1).step(0.001);
scene.add(ambientLight);

// Directional light
const moonLight = new THREE.DirectionalLight(0xb9d5ff, 0.12);
moonLight.position.set(4, 5, -2);
gui.add(moonLight, "intensity").min(0).max(1).step(0.001);
gui.add(moonLight.position, "x").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "y").min(-5).max(5).step(0.001);
gui.add(moonLight.position, "z").min(-5).max(5).step(0.001);
scene.add(moonLight);

// Door light
const doorLight = new THREE.PointLight(0xff7d46, 1, 7);
doorLight.position.set(0, 2.2, 2.7);
house.add(doorLight);

/**
 * Ghosts
 */
const ghost_1 = new THREE.PointLight(0xff00ff, 2, 3);
scene.add(ghost_1);

const ghost_2 = new THREE.PointLight(0x00ffff, 2, 3);
scene.add(ghost_2);

const ghost_3 = new THREE.PointLight(0xffff00, 2, 3);
scene.add(ghost_3);

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

window.addEventListener("resize", () => {
  // Update sizes
  updateSizes();

  // Update camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update renderer
  updateRenderer();
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(75, aspectRatio(), 0.1, 100);
camera.position.x = 4;
camera.position.y = 2;
camera.position.z = 5;
scene.add(camera);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer();
const canvas = renderer.domElement;
document.body.appendChild(canvas);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();
renderer.setClearColor(0x262837);

/**
 * Shadows
 */
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

moonLight.castShadow = true;
moonLight.shadow.mapSize.set(256, 256);
moonLight.shadow.camera.far = 7;

doorLight.castShadow = true;
doorLight.shadow.mapSize.set(256, 256);
doorLight.shadow.camera.far = 7;

ghost_1.castShadow = true;
ghost_1.shadow.mapSize.set(256, 256);
ghost_1.shadow.camera.far = 7;

ghost_2.castShadow = true;
ghost_2.shadow.mapSize.set(256, 256);
ghost_2.shadow.camera.far = 7;

ghost_3.castShadow = true;
ghost_3.shadow.mapSize.set(256, 256);
ghost_3.shadow.camera.far = 7;

walls.castShadow = true;
roof.castShadow = true;
bush_1.castShadow = true;
bush_2.castShadow = true;
bush_3.castShadow = true;
bush_4.castShadow = true;
floor.receiveShadow = true;

/**
 * Animate
 */
const clock = new THREE.Clock();

const tick = () => {
  const elapsedTime = clock.getElapsedTime();

  // Ghosts
  const ghost_1_Angle = elapsedTime * 0.5;
  ghost_1.position.x = Math.cos(ghost_1_Angle) * 4;
  ghost_1.position.z = Math.sin(ghost_1_Angle) * 4;
  ghost_1.position.y = Math.sin(elapsedTime * 3);

  const ghost_2_Angle = -elapsedTime * 0.32;
  ghost_2.position.x = Math.cos(ghost_2_Angle) * 5;
  ghost_2.position.z = Math.sin(ghost_2_Angle) * 5;
  ghost_2.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  const ghost_3_Angle = -elapsedTime * 0.18;
  ghost_3.position.x =
    Math.cos(ghost_3_Angle) * (7 + Math.sin(elapsedTime * 0.32));
  ghost_3.position.z =
    Math.sin(ghost_3_Angle) * (7 + Math.sin(elapsedTime * 0.5));
  ghost_3.position.y = Math.sin(elapsedTime * 4) + Math.sin(elapsedTime * 2.5);

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
};

tick();
