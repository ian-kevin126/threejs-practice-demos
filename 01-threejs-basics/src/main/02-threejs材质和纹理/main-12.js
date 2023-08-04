import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import Stats from "stats.js";

// 环境贴图、经纬线贴图、HDR

// 1、创建场景
const scene = new THREE.Scene();

// 加载 hdr ,使用 hdr 贴图
const rgbeLoader = new RGBELoader();
rgbeLoader.loadAsync("./textures/hdr/002.hdr").then((texture) => {
  // 对hdr 图做经纬映射
  texture.mapping = THREE.EquirectangularReflectionMapping;
  scene.background = texture;
  scene.environment = texture;
});

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

// 设置 cube 纹理加载器
const cubeTextureLoader = new THREE.CubeTextureLoader();
const envMapTexture = cubeTextureLoader.load([
  "./textures/environmentMaps/1/px.jpg",
  "./textures/environmentMaps/1/nx.jpg",
  "./textures/environmentMaps/1/py.jpg",
  "./textures/environmentMaps/1/ny.jpg",
  "./textures/environmentMaps/1/pz.jpg",
  "./textures/environmentMaps/1/nz.jpg",
]);

console.log("envMapTexture", envMapTexture);

// 添加物体
// 添加一个球
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
const material = new THREE.MeshStandardMaterial({
  metalness: 0.7,
  roughness: 0.1,
  // envMap: envMapTexture
});
const sphere = new THREE.Mesh(sphereGeometry, material);
scene.add(sphere);
// 添加场景贴图
scene.background = envMapTexture;
// 给所有物体添加默认环境贴图
scene.environment = envMapTexture;

// 灯光
// 环境光 颜色/光强
const light = new THREE.AmbientLight(0xffffff, 0.8);
scene.add(light);
// 直线光源
const directionaLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionaLight.position.set(5, 5, 0);
// scene.add(directionaLight)

// 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer);
// 将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// // 使用渲染器，通过相机将场景渲染进来
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

// 帧率显示
var stats = new Stats();
stats.showPanel(1); // 0: fps, 1: ms, 2: mb, 3+: custom
document.body.appendChild(stats.dom);

function animate() {
  stats.begin();

  // monitored code goes here

  stats.end();

  requestAnimationFrame(animate);
}

requestAnimationFrame(animate);
