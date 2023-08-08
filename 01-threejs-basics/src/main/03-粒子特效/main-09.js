import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

/**
 * Canvas
 */
const canvas = document.getElementById("myCanvas");

/**
 * Debug GUI
 */
const gui = new dat.GUI();

const debugObject = {
  createSphere: () => {
    createSphere(Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
  reset: () => {
    objectsToUpdate.forEach((object) => {
      // Remove Body
      object.body.removeEventListener("collide", playHitSound);
      world.removeBody(object.body);

      // Remove Mesh
      scene.remove(object.mesh);
    });
  },
  createBox: () => {
    createBox(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
};
gui.add(debugObject, "createSphere");
gui.add(debugObject, "createBox");
gui.add(debugObject, "reset");

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
 * Sounds
 */
const hitSound = new Audio("./sounds/hit.mp3");
const playHitSound = (collision) => {
  const impactStrength = collision.contact.getImpactVelocityAlongNormal();

  if (impactStrength > 1.5) {
    hitSound.volume = Math.random();
    hitSound.currentTime = 0;
    hitSound.play();
  }
};

/**
 * Textures
 */
// const textureLoader = new THREE.TextureLoader();
const cubeTextureLoader = new THREE.CubeTextureLoader();
const environmentMapTexture = cubeTextureLoader.load([
  "./textures/environmentMaps/4/px.png",
  "./textures/environmentMaps/4/nx.png",
  "./textures/environmentMaps/4/py.png",
  "./textures/environmentMaps/4/ny.png",
  "./textures/environmentMaps/4/pz.png",
  "./textures/environmentMaps/4/nz.png",
]);

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Physics
 */
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// Materials
// 1.way
// const concreteMaterial = new CANNON.Material("concrete");
// const plasticMaterial = new CANNON.Material("plastic")
// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   }
// );
// world.addContactMaterial(concretePlasticContactMaterial);

// 2.way
const defaultMaterial = new CANNON.Material("default");
const defaultContactMaterial = new CANNON.ContactMaterial(
  defaultMaterial,
  defaultMaterial,
  {
    friction: 0.1,
    restitution: 0.7,
  }
);
world.addContactMaterial(defaultContactMaterial);
// 3.way
world.defaultContactMaterial = defaultContactMaterial;

// Sphere Body
let radiusOfSphere = 0.5;
// const sphereShape = new CANNON.Sphere(radiusOfSphere);
// const sphereBody = new CANNON.Body({
//   shape: sphereShape,
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   // 1.way
//   // material: plasticMaterial,
//   // 2.way
//   // material: defaultMaterial,
//   // 3.way
// });
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );
// world.addBody(sphereBody);

// Plane Body
const planeShape = new CANNON.Plane();
const planeBody = new CANNON.Body({
  shape: planeShape,
  mass: 0,
  position: new CANNON.Vec3(0, 0, 0),
  // 1.way
  // material: concreteMaterial,
  // 2.way
  // material: defaultMaterial,
  // 3.way
});
planeBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
world.addBody(planeBody);

/**
 * Test sphere
 */
// const sphere = new THREE.Mesh(
//   new THREE.SphereBufferGeometry(radiusOfSphere, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

/**
 * Floor
 */
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: "#777777",
    metalness: 0.3,
    roughness: 0.4,
  })
);
floor.receiveShadow = true;
floor.rotation.x = -Math.PI * 0.5;
scene.add(floor);

/**
 * Lights
 */
// Ambient Light
const ambientLight = new THREE.AmbientLight(0xffffff, 0.7);
scene.add(ambientLight);

// Directional Light
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.2);
directionalLight.castShadow = true;
directionalLight.shadow.mapSize.set(1024, 1024);
directionalLight.shadow.camera.far = 15;
directionalLight.shadow.camera.top = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.left = -7;
directionalLight.shadow.camera.right = 7;
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
camera.position.set(-3, 3, 3);
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
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;

const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Sphere
 */

let objectsToUpdate = [];

const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const meshStandardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

const createSphere = (radius, { x, y, z }) => {
  // Three.js Mesh
  const mesh = new THREE.Mesh(sphereGeometry, meshStandardMaterial);
  mesh.scale.set(radius, radius, radius);
  mesh.castShadow = true;
  mesh.position.set(x, y, z);
  scene.add(mesh);

  // Cannon.js Body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    shape,
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    material: defaultMaterial,
  });
  body.position.set(x, y, z);
  body.addEventListener("collide", playHitSound);
  world.addBody(body);
  objectsToUpdate.push({ mesh, body });
};
createSphere(radiusOfSphere, { x: 0, y: 3, z: 0 });

const boxGeometry = new THREE.BoxGeometry(1, 1, 1);

const createBox = (width, height, depth, { x, y, z }) => {
  // Three.js Mesh
  const mesh = new THREE.Mesh(boxGeometry, meshStandardMaterial);
  mesh.scale.set(width, height, depth);
  mesh.castShadow = true;
  mesh.position.set(x, y, z);
  scene.add(mesh);

  // Cannon.js Body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width * 0.5, height * 0.5, depth * 0.5)
  );
  const body = new CANNON.Body({
    shape,
    mass: 1,
    position: new CANNON.Vec3(x, y, z),
    material: defaultMaterial,
  });
  body.addEventListener("collide", playHitSound);
  body.position.set(x, y, z);
  world.addBody(body);
  objectsToUpdate.push({ mesh, body });
};
/**
 * Animate
 */
// Clock
const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // // Update Physics World
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
  world.step(1 / 60, deltaTime, 3);

  // // Update Sphere
  // const { x: sX, y: sY, z: sZ } = sphereBody.position;
  // sphere.position.set(sX, sY, sZ);

  // Update objectsToUpdate
  objectsToUpdate.forEach((object) => {
    let { x, y, z } = object.body.position;
    let { x: rX, y: rY, z: rZ, w } = object.body.quaternion;
    object.mesh.position.set(x, y, z);
    object.mesh.quaternion.set(rX, rY, rZ, w);
  });

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
