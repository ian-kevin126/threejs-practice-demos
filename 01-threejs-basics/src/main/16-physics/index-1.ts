import "../style.css";
import * as THREE from "three";
import * as dat from "dat.gui";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import * as CANNON from "cannon-es";

/**
 * Debug
 */
const gui = new dat.GUI();
const debugObject = {
  createSphere: () => {
    createSphere(Math.random() * 0.5, {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
  createBox: () => {
    createBox(Math.random(), Math.random(), Math.random(), {
      x: (Math.random() - 0.5) * 3,
      y: 3,
      z: (Math.random() - 0.5) * 3,
    });
  },
  reset: () => {
    for (const object of objectsToUpdate) {
      // Remove Body
      object.body.removeEventListener("collide", playHitSound);
      world.removeBody(object.body);

      // Remove Mesh
      scene.remove(object.mesh);
    }
  },
};
gui.add(debugObject, "createSphere");
gui.add(debugObject, "createBox");
gui.add(debugObject, "reset");

/**
 * Window Events
 */
window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update Camera
  camera.aspect = aspectRatio();
  camera.updateProjectionMatrix();

  // Update Renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
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
 * Sounds
 */
const hitSound = new Audio("./sounds/hit.mp3");

const playHitSound = (collision: any) => {
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
 * Physics
 */
const world = new CANNON.World();
world.broadphase = new CANNON.SAPBroadphase(world);
world.allowSleep = true;
world.gravity.set(0, -9.82, 0);

// Materials
// const concreteMaterial = new CANNON.Material("concrete");
// const plasticMaterial = new CANNON.Material("plastic");

// const concretePlasticContactMaterial = new CANNON.ContactMaterial(
//   concreteMaterial,
//   plasticMaterial,
//   {
//     friction: 0.1,
//     restitution: 0.7,
//   }
// );
// world.addContactMaterial(concretePlasticContactMaterial);

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
world.defaultContactMaterial = defaultContactMaterial;

// Sphere
// const sphereShape = new CANNON.Sphere(0.5);
// const sphereBody = new CANNON.Body({
//   mass: 1,
//   position: new CANNON.Vec3(0, 3, 0),
//   shape: sphereShape,
//   // material: plasticMaterial,
//   // material: defaultMaterial,
// });
// sphereBody.applyLocalForce(
//   new CANNON.Vec3(150, 0, 0),
//   new CANNON.Vec3(0, 0, 0)
// );
// world.addBody(sphereBody);

// Floor
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
floorBody.mass = 0;
floorBody.addShape(floorShape);
// floorBody.material = concreteMaterial;
// floorBody.material = defaultMaterial;
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(-1, 0, 0), Math.PI * 0.5);
// floorBody.quaternion.setFromEuler(-Math.PI * 0.5, 0, 0);
world.addBody(floorBody);

/**
 * Objects
 */

// Sphere
// const sphere = new THREE.Mesh(
//   new THREE.SphereGeometry(0.5, 32, 32),
//   new THREE.MeshStandardMaterial({
//     metalness: 0.3,
//     roughness: 0.4,
//     envMap: environmentMapTexture,
//   })
// );
// sphere.castShadow = true;
// sphere.position.y = 0.5;
// scene.add(sphere);

// Plane
const floor = new THREE.Mesh(
  new THREE.PlaneGeometry(10, 10),
  new THREE.MeshStandardMaterial({
    color: 0x777777,
    metalness: 0.3,
    roughness: 0.4,
    envMap: environmentMapTexture,
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
directionalLight.shadow.camera.right = 7;
directionalLight.shadow.camera.bottom = -7;
directionalLight.shadow.camera.left = -7;
directionalLight.position.set(5, 5, 5);
scene.add(directionalLight);

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

renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Utils
 */
type ObjectsToUpdateType = {
  mesh: THREE.Mesh;
  body: CANNON.Body;
};
const objectsToUpdate: ObjectsToUpdateType[] = [];
const meshStandardMaterial = new THREE.MeshStandardMaterial({
  metalness: 0.3,
  roughness: 0.4,
  envMap: environmentMapTexture,
});

// Sphere
type CreateSphereFunType = (
  radius: number,
  position: { x: number; y: number; z: number }
) => void;
const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
const createSphere: CreateSphereFunType = (radius, { x, y, z }) => {
  // THREE.js Mesh
  const mesh = new THREE.Mesh(sphereGeometry, meshStandardMaterial);
  mesh.scale.set(radius, radius, radius);

  mesh.castShadow = true;
  mesh.position.copy(new THREE.Vector3(x, y, z));
  scene.add(mesh);

  // Cannon.js Body
  const shape = new CANNON.Sphere(radius);
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.addEventListener("collide", playHitSound);
  body.position.copy(new CANNON.Vec3(x, y, z));
  world.addBody(body);

  // Save in objects to update
  objectsToUpdate.push({ mesh, body });
};
createSphere(0.5, { x: 0, y: 3, z: 0 });

//----- Box
type CreateBoxFunType = (
  width: number,
  height: number,
  depth: number,
  position: { x: number; y: number; z: number }
) => void;
const boxGeometry = new THREE.BoxGeometry(1, 1, 1);
const createBox: CreateBoxFunType = (width, height, depth, { x, y, z }) => {
  // Three.js Body
  const mesh = new THREE.Mesh(boxGeometry, meshStandardMaterial);
  mesh.scale.set(width, height, depth);

  mesh.castShadow = true;
  mesh.position.copy(new THREE.Vector3(x, y, z));
  scene.add(mesh);

  // Cannon.js Body
  const shape = new CANNON.Box(
    new CANNON.Vec3(width / 2, height / 2, depth / 2)
  );
  const body = new CANNON.Body({
    mass: 1,
    position: new CANNON.Vec3(0, 3, 0),
    shape,
    material: defaultMaterial,
  });
  body.addEventListener("collide", playHitSound);
  body.position.copy(new CANNON.Vec3(x, y, z));
  world.addBody(body);

  // Save in objects to update
  objectsToUpdate.push({
    mesh,
    body,
  });
};
// createBox(1, 1, 1, { x: 0, y: 3, z: 0 });

/**
 * Tick
 */

const clock = new THREE.Clock();
let oldElapsedTime = 0;

const tick = () => {
  // Update Controls
  controls.update();

  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();
  const deltaTime = elapsedTime - oldElapsedTime;
  oldElapsedTime = elapsedTime;

  // Update Physics World
  world.step(1 / 60, deltaTime, 3);

  // Sphere
  // sphereBody.applyForce(new CANNON.Vec3(-0.5, 0, 0), sphereBody.position);
  // sphere.position.copy(sphereBody.position);
  // sphere.position.set(
  //   sphereBody.position.x,
  //   sphereBody.position.y,
  //   sphereBody.position.z
  // );

  // Each Objects
  for (const object of objectsToUpdate) {
    let { x, y, z } = object.body.position;
    object.mesh.position.copy(new THREE.Vector3(x, y, z));
    let { x: qX, y: qY, z: qZ, w } = object.body.quaternion;
    object.mesh.quaternion.copy(new THREE.Quaternion(qX, qY, qZ, w));
  }

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
