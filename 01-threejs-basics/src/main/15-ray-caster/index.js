import * as THREE from "three";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

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
// Hover
const mouse = new THREE.Vector2();
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / sizes.width - 0.5) * 2;
  mouse.y = -(event.clientY / sizes.height - 0.5) * 2;
});

/**
 * Scene
 */
const scene = new THREE.Scene();

/**
 * Objects
 */

const object1 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object1.position.x = -2;
const object2 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
const object3 = new THREE.Mesh(
  new THREE.SphereGeometry(0.5, 16, 16),
  new THREE.MeshBasicMaterial({ color: 0xff0000 })
);
object2.position.x = 2;
scene.add(object1, object2, object3);

/**
 * RayCaster
 */
const raycaster = new THREE.Raycaster();
// const rayOrigin = new THREE.Vector3(-3, 0, 0);
// const rayDirection = new THREE.Vector3(10, 0, 0);
// rayDirection.normalize();

// raycaster.set(rayOrigin, rayDirection);
// const intersectObjects = raycaster.intersectObjects([
//   object1,
//   object2,
//   object3,
// ]);
// console.log(intersectObjects);

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
camera.position.set(0, 0, 3);
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

const updateRenderer = () => {
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
};
updateRenderer();

/**
 * Tick
 */
// Clock
const clock = new THREE.Clock();
let intersectObject = null;

// Tick
const tick = () => {
  // Elapsed Time
  const elapsedTime = clock.getElapsedTime();

  // Animate Objects
  object1.position.y = Math.sin(elapsedTime * 0.3) * 1.5;
  object2.position.y = Math.sin(elapsedTime * 0.8) * 1.5;
  object3.position.y = Math.sin(elapsedTime * 1.4) * 1.5;

  // Raycaster from camera
  raycaster.setFromCamera(mouse, camera);
  const objectsToTest = [object1, object2, object3];
  const intersectObjects = raycaster.intersectObjects(objectsToTest);

  for (const element of objectsToTest) {
    element.material.color.set(0xff0000);
  }

  for (const intersectObject of intersectObjects) {
    if (intersectObject.object instanceof THREE.Mesh) {
      intersectObject.object.material.color.set(0x0000ff);
    }
  }
  if (intersectObjects.length) {
    if (intersectObject === null) {
      console.log("mouse enter");
    }
    intersectObject = intersectObjects[0];
  } else {
    if (intersectObject) {
      console.log("mouse leave");
    }
    intersectObject = null;
  }

  // Create A ray
  // const rayOrigin = new THREE.Vector3(-3, 0, 0);
  // const rayDirection = new THREE.Vector3(1, 0, 0);
  // rayDirection.normalize();
  // raycaster.set(rayOrigin, rayDirection);
  // const objectsToTest = [object1, object2, object3];
  // const intersectObjects = raycaster.intersectObjects(objectsToTest);

  // for (const element of objectsToTest) {
  //   element.material.color.set(0xff0000);
  // }

  // for (const intersectObject of intersectObjects) {
  //   if (intersectObject.object instanceof THREE.Mesh) {
  //     intersectObject.object.material.color.set(0x0000ff);
  //   }
  // }

  // Update Controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Next Frame
  window.requestAnimationFrame(tick);
};
tick();
