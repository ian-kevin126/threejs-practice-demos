import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";

// 置换贴图、顶点细分设置

// 1、创建场景
const scene = new THREE.Scene();

// 2、创建相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 导入纹理
const textureLoader = new THREE.TextureLoader();
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");
const doorAoTexture = textureLoader.load(
  "./textures/door/ambientOcclusion.jpg"
);
const roughnessTexture = textureLoader.load("./textures/door/roughness.jpg");
const metalnessTexture = textureLoader.load("./textures/door/metalness.jpg");
const normalTexture = textureLoader.load("./textures/door/normal.jpg");
// 导入置换贴图
const doorHeightTexture = textureLoader.load("./textures/door/height.jpg");

// 添加物体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1, 100, 100, 100);
console.log(cubeGeometry);
// 材质
const material = new THREE.MeshStandardMaterial({
  color: "#ffff00",
  map: doorColorTexture,
  alphaMap: doorAlphaTexture,
  transparent: true,
  side: THREE.DoubleSide,
  // 环境遮挡
  aoMap: doorAoTexture,
  // 遮挡强度
  aoMapIntensity: 0.5,
  //   opacity: 0.3,
  //   side: THREE.DoubleSide,
  // 置换属性
  displacementMap: doorHeightTexture,
  // 置换影响程度
  displacementScale: 0.1,
  // 必须配上粗糙度才会有光照视差效果
  roughness: 1,
  roughnessMap: roughnessTexture,
  // 关照的时候金属效果
  metalness: 1,
  metalnessMap: metalnessTexture,
  normalMap: normalTexture,
});

// material.side = THREE.DoubleSide;

const cube = new THREE.Mesh(cubeGeometry, material);
scene.add(cube);
// 给cube添加第二组uv
cubeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(cubeGeometry.attributes.uv.array, 2)
);

// 添加平面
const planeGeometry = new THREE.PlaneGeometry(1, 1, 200, 200);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(2, 0, 0);
scene.add(plane);
// console.log(plane);
// 给平面设置第二组uv
planeGeometry.setAttribute(
  "uv2",
  new THREE.BufferAttribute(planeGeometry.attributes.uv.array, 2)
);

// 灯光
// 环境光 颜色/光强
const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);
// 直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
scene.add(directionalLight);

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 使用渲染器，通过相机将场景渲染进来
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器更有真实效果,必须在动画循环里调用.update()。
controls.enableDamping = true;

// 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
// 设置时钟
const clock = new THREE.Clock();

function render() {
  controls.update();
  renderer.render(scene, camera);
  //   渲染下一帧的时候就会调用render函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  //   console.log("画面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  //   更新摄像机的投影矩阵
  camera.updateProjectionMatrix();

  //   更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  //   设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
