import "../../style.css";
import * as THREE from "three";
import Stats from "stats.js";
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// import { mergeBufferGeometries } from "three/examples/jsm/utils/BufferGeometryUtils";

/**
 * Stats
 */
const stats = new Stats();
stats.showPanel(0);
document.body.appendChild(stats.dom);

/**
 * Base
 */
// Canvas
const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;

// Scene
const scene = new THREE.Scene();

/**
 * Textures
 */
const textureLoader = new THREE.TextureLoader();
const displacementTexture = textureLoader.load(
  "../../../textures/displacementMap.png"
);

/**
 * Sizes
 */
const sizes = {
  width: window.innerWidth,
  height: window.innerHeight,
};

window.addEventListener("resize", () => {
  // Update sizes
  sizes.width = window.innerWidth;
  sizes.height = window.innerHeight;

  // Update camera
  camera.aspect = sizes.width / sizes.height;
  camera.updateProjectionMatrix();

  // Update renderer
  renderer.setSize(sizes.width, sizes.height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
});

/**
 * Camera
 */
// Base camera
const camera = new THREE.PerspectiveCamera(
  75,
  sizes.width / sizes.height,
  0.1,
  100
);
camera.position.set(2, 2, 6);
scene.add(camera);

// Controls
const controls = new OrbitControls(camera, canvas);
controls.enableDamping = true;

/**
 * Test meshes
 */
// const cube = new THREE.Mesh(
//   new THREE.BoxBufferGeometry(2, 2, 2),
//   new THREE.MeshStandardMaterial()
// );
// cube.castShadow = true;
// cube.receiveShadow = true;
// cube.position.set(-5, 0, 0);
// scene.add(cube);

// const torusKnot = new THREE.Mesh(
//   new THREE.TorusKnotBufferGeometry(1, 0.4, 128, 32),
//   new THREE.MeshStandardMaterial()
// );
// torusKnot.castShadow = true;
// torusKnot.receiveShadow = true;
// scene.add(torusKnot);

// const sphere = new THREE.Mesh(
//   new THREE.SphereBufferGeometry(1, 32, 32),
//   new THREE.MeshStandardMaterial()
// );
// sphere.position.set(5, 0, 0);
// sphere.castShadow = true;
// sphere.receiveShadow = true;
// scene.add(sphere);

// const floor = new THREE.Mesh(
//   new THREE.PlaneBufferGeometry(10, 10),
//   new THREE.MeshStandardMaterial()
// );
// floor.position.set(0, -2, 0);
// floor.rotation.x = -Math.PI * 0.5;
// floor.castShadow = true;
// floor.receiveShadow = true;
// scene.add(floor);

/**
 * Lights
 */
// const directionalLight = new THREE.DirectionalLight("#ffffff", 1);
// directionalLight.castShadow = true;
// directionalLight.shadow.mapSize.set(1024, 1024);
// directionalLight.shadow.camera.far = 15;
// directionalLight.shadow.normalBias = 0.05;
// directionalLight.position.set(0.25, 3, 2.25);
// scene.add(directionalLight);

/**
 * Renderer
 */
const renderer = new THREE.WebGLRenderer({
  canvas,
  powerPreference: "high-performance",
  antialias: true,
});
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFSoftShadowMap;
renderer.setSize(sizes.width, sizes.height);
renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

/**
 * Animate
 */
// const clock = new THREE.Clock();

const tick = () => {
  stats.begin();
  // const elapsedTime = clock.getElapsedTime();

  // Update test mesh
  // torusKnot.rotation.y = elapsedTime * 0.1;

  // Update controls
  controls.update();

  // Render
  renderer.render(scene, camera);

  // Call tick again on the next frame
  window.requestAnimationFrame(tick);
  stats.end();
};

tick();

// Tip 4
// console.log(renderer.info);

// Tip 6
// scene.remove(cube);
// cube.geometry.dispose();
// cube.material.dispose();

// Tip 10
// directionalLight.shadow.camera.top = 3;
// directionalLight.shadow.camera.right = 6;
// directionalLight.shadow.camera.left = -6;
// directionalLight.shadow.camera.bottom = -3;
// directionalLight.shadow.camera.far = 10;
// directionalLight.shadow.mapSize.set(1024, 1024);

// const cameraHelper = new THREE.CameraHelper(directionalLight.shadow.camera);
// scene.add(cameraHelper);

// Tip 11
// cube.castShadow = true;
// cube.receiveShadow = false;

// torusKnot.castShadow = true;
// torusKnot.receiveShadow = false;

// sphere.castShadow = true;
// sphere.receiveShadow = false;

// floor.castShadow = false;
// floor.receiveShadow = true;

// // Tip 12
// renderer.shadowMap.autoUpdate = false;
// renderer.shadowMap.needsUpdate = true;

// Tip 13
// Resize Textures
// tinypng.com

// Tip 14
// and must be power of 2 resolution

// Tip 15
// https://github.com/BinomialLLC/basis_universal
// use basis format

// TIp 16
// Use Buffer Geometry

// Tip 17
// DO NOT Update Vertices

// Tip 18
// use same geometry and material for different meshes
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();
// for (let i = 0; i < 50; i++) {
//   const mesh = new THREE.Mesh(geometry, material);
//   mesh.position.x = (Math.random() - 0.5) * 10;
//   mesh.position.y = (Math.random() - 0.5) * 10;
//   mesh.position.z = (Math.random() - 0.5) * 10;
//   mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
//   scene.add(mesh);
// }

// Tip 19
// Merge Geometry which are not moving
// const geometries: THREE.BoxGeometry[] = [];
// for (let i = 0; i < 50; i++) {
//   const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
//   geometry.rotateX((Math.random() - 0.5) * Math.PI * 2);
//   geometry.rotateY((Math.random() - 0.5) * Math.PI * 2);
//   geometry.translate(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );
//   geometries.push(geometry);
// }
// const mergedGeometry = mergeBufferGeometries(geometries);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.Mesh(mergedGeometry, material);
// scene.add(mesh);

// TIp 22
// If You want to move a cube in 50 cube then use instanced mesh
// const geometry = new THREE.BoxGeometry(0.5, 0.5, 0.5);
// const material = new THREE.MeshNormalMaterial();
// const mesh = new THREE.InstancedMesh(geometry, material, 50);
// // IF you intend to change these matrices in the tick function, add this to the InstancedMesh
// mesh.instanceMatrix.setUsage(THREE.DynamicDrawUsage);

// scene.add(mesh);

// for (let i = 0; i < 50; i++) {
//   const position = new THREE.Vector3(
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10,
//     (Math.random() - 0.5) * 10
//   );
//   const quaternion = new THREE.Quaternion();
//   quaternion.setFromEuler(
//     new THREE.Euler(
//       (Math.random() - 0.5) * Math.PI * 2,
//       (Math.random() - 0.5) * Math.PI * 2,
//       0
//     )
//   );

//   const matrix = new THREE.Matrix4();
//   matrix.makeRotationFromQuaternion(quaternion);
//   matrix.setPosition(position);
//   mesh.setMatrixAt(i, matrix);

//   // const mesh = new THREE.Mesh(geometry, material);
//   // mesh.position.x = (Math.random() - 0.5) * 10;
//   // mesh.position.y = (Math.random() - 0.5) * 10;
//   // mesh.position.z = (Math.random() - 0.5) * 10;
//   // mesh.rotation.x = (Math.random() - 0.5) * Math.PI * 2;
//   // mesh.rotation.y = (Math.random() - 0.5) * Math.PI * 2;
//   // scene.add(mesh);
// }

// Tip 23
// Try to use Low Poly model

// Tip 24
// Use Draco Compression

// TIp 25
// Gzip is a compression happening on the server side
// Most of the servers don't gzip files such as .glb, .gltf, .obj, etc.
// see if you can figure out how to fix that, depending on the server you are using
// GZIP

// Tip 26
// Camera FOV
// whe objects are not in the field of view, they won't be rendered(frustum culling)
// That can seem like a tawdry solution, but you can just reduce the camera's field of view

// Tip 27
// Camera Near and far
// Like the field of view, you can reduce the near and far properties of the camera

// TIp 29
// PIXEL RATIO
// use low pixel ratio max <= 2

// Tip 30
// Power Preference
// Some devices may be able to switch between different GPU or different GPU usage
// We can give a hint on what power is required when instantiating the WebGLRenderer by specifying a powerPreference property
// const renderer=new THREE.WebGLRenderer({
//   canvas,
//   powerPreference:'high-performance'
// })

// Tip 31
// Antialias
// default antialias is performant, but less performant than no antialias Only add it if you have visible aliasing and no performance issue

// Tip 32
// PostProcessing
// Limit Pass
// Each post-processing pass will take as many pixels as the render's resolution (including the pixel ratio) to render . if you have a 1920x1080 resolution with 4 passes and a pixel ratio of 2, that makes 1920 * 2 * 1080 * 2* 4= 33 177 600 pixels to render Try to regroup your custom passes into one

// TIp 33
// you can force the precision of the shaders in the materials by changing their precision property
// const shaderMaterial=new THREE.ShaderMaterial({
//   precision:'lowp'
// })
// check the result for any quality downgrade or glitches

const shaderGeometry = new THREE.PlaneBufferGeometry(10, 10, 256, 256);

const shaderMaterial = new THREE.ShaderMaterial({
  uniforms: {
    uDisplacementTexture: { value: displacementTexture },
    // uDisplacementStrength: { value: 1.5 },
  },
  defines: {
    // use defines here
    DISPLACEMENT_STRENGTH: 1.5,
  },
  vertexShader: `
       // Use define for constant value
        #define uDisplacementStrength 1.5
        uniform sampler2D uDisplacementTexture;
        // uniform float uDisplacementStrength;

        varying vec2 vUv;

        void main()
        {
            vec4 modelPosition = modelMatrix * vec4(position, 1.0);

            float elevation = texture2D(uDisplacementTexture, uv).r;
            if(elevation < 0.5)
            {
                elevation = 0.5;
            }

            modelPosition.y += elevation * uDisplacementStrength;

            gl_Position = projectionMatrix * viewMatrix * modelPosition;

            vUv = uv;
        }
    `,
  fragmentShader: `
        uniform sampler2D uDisplacementTexture;

        varying vec2 vUv;

        void main()
        {
            float elevation = texture2D(uDisplacementTexture, vUv).r;
            elevation = max(elevation, 0.25);
            // if(elevation < 0.25)
            // {
            //     elevation = 0.25;
            // }

            vec3 depthColor = vec3(1.0, 0.1, 0.1);
            vec3 surfaceColor = vec3(0.1, 0.0, 0.5);
            // I can use mix
            // vec3 finalColor = vec3(0.0);
            // finalColor.r += depthColor.r + (surfaceColor.r - depthColor.r) * elevation;
            // finalColor.g += depthColor.g + (surfaceColor.g - depthColor.g) * elevation;
            // finalColor.b += depthColor.b + (surfaceColor.b - depthColor.b) * elevation;
            vec3 finalColor = mix(depthColor,surfaceColor,elevation);
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `,
});

const shaderMesh = new THREE.Mesh(shaderGeometry, shaderMaterial);
shaderMesh.rotation.x = -Math.PI * 0.5;
scene.add(shaderMesh);

// Keep your shader codes as simple as possible
// Avoid if statements
// Make good use of swizzles and built-in functions (like clamp,max etc.)

// 33 - Use Textures
// employing perlin noise functions is cool, but it can affect your performance considerably. Sometimes, you better use a texture representing the noise

// Uniforms are beneficial because we can tweak them and animate the values in the javascript , but they have a performance cost
// if the value isn't supposed to change, you can use defines

// 35- Do the calculations in the vertex shader rather than fragment shader
