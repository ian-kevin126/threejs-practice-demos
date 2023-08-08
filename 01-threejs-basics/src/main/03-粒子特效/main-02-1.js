import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入动画库
import gsap from "gsap";
// 导入dat.gui
import * as dat from "dat.gui";

// 目标：了解three.js最基本的内容
// 这个效果需要再 Three.js v0.135.0 版本才有效果。

// 1.创建场景
const scene = new THREE.Scene();

// 2.创建透视相机
const camera = new THREE.PerspectiveCamera(
  100,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 2.1、设置相机位置
camera.position.set(0, 0, 10);
// 2.2、相机添加到场景中
scene.add(camera);

// 3.创建物体
// 3.1、创建几何体
const sphereGeometry = new THREE.SphereBufferGeometry(3, 20, 20);

// 设置点材质
const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 0.1;
pointsMaterial.color.set(0xfff000);
// 相机深度而衰减
pointsMaterial.sizeAttenuation = true;
// 载入纹理
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./textures/particles/1.png");
// 设置点材质纹理
pointsMaterial.map = texture;
pointsMaterial.alphaMap = texture;
pointsMaterial.transparent = true;
pointsMaterial.depthWrite = false;
pointsMaterial.blending = THREE.AdditiveBlending;

const points = new THREE.Points(sphereGeometry, pointsMaterial);
scene.add(points);

// 4.初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 4.1、设置渲染的尺寸大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 4.2、将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 5.创建轨迹控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 5.1、设置控制器阻尼，让控制器更具有真实效果，必须在动画循环里调用update()
controls.enableDamping = true;

// 6.添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
// 6.1 添加到场景中
scene.add(axesHelper);

function render(time) {
  controls.update();
  renderer.render(scene, camera);
  // 渲染下一帧的时候就会调用rende函数
  requestAnimationFrame(render);
}

render();

// 监听画面变化，更新渲染画面
window.addEventListener("resize", () => {
  // 更新相机
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新相机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 控制画布全屏和退出全屏
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    renderer.domElement.requestFullscreen();
  } else {
    document.exitFullscreen();
  }
});
