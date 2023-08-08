import * as THREE from "three";
// 导入控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入GSAP动画库
import gsap from "gsap";
// 导入GUI图形操作库
import * as dat from "dat.gui";
// 导入RGBELoader
import { RGBELoader } from "three/examples/jsm/loaders/RGBELoader";
import { DoubleSide } from "three";

// points和点材质

/**
 * 1.创建场景
 */
const scene = new THREE.Scene();

/**
 * 2.创建相机
 */
// 创建透视相机; (角度, 宽高比,近端参, 远端参;)
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);
// 设置相机位置; (x,y,z);
camera.position.set(0, 0, 10);
// 把相机添加到场景中
scene.add(camera);

/**
 * 3.创建球状点材质几何体
 */
const sphereGeometry = new THREE.SphereGeometry(3, 20, 20);

const positionArray = [];
for (let i = 0; i < 10000; i++) {
  positionArray.push(
    new THREE.Vector3().random().subScalar(0.5).multiplyScalar(400)
  );
}
const particleBufferGeometry = new THREE.BufferGeometry().setFromPoints(
  positionArray
);

// const sphereMaterial = new THREE.MeshBasicMaterial({
//   color: 0xff0000,
//   wireframe: true,
// });
// const sphereMesh = new THREE.Mesh(sphereGeometry, sphereMaterial);
// scene.add(sphereMesh);

// 设置点材质
const pointsMaterial = new THREE.PointsMaterial();
pointsMaterial.size = 2;
pointsMaterial.color.set(0xfff000);
// 随相机深度而衰减
pointsMaterial.sizeAttenuation = true;

// 载入纹理
const textureLoader = new THREE.TextureLoader();
textureLoader.load("./textures/particles/1.png", (texture) => {
  // 纹理贴图
  pointsMaterial.map = texture;
  // 灰度贴图
  pointsMaterial.alphaMap = texture;
  // 材质是否透明
  pointsMaterial.transparent = true;
  // 材质对深度缓冲区的影响
  pointsMaterial.depthWrite = false;
  // 材质显示对象混合模式
  pointsMaterial.blending = THREE.AdditiveBlending;

  const points = new THREE.Points(sphereGeometry, pointsMaterial);
  // const points = new THREE.Points(particleBufferGeometry, pointsMaterial);
  scene.add(points);
});

/**
 * 4.初始化渲染器
 */
// 创建渲染器;
const renderer = new THREE.WebGLRenderer();
// 设置渲染尺寸大小; (画布宽, 画布高);
renderer.setSize(window.innerWidth, window.innerHeight);
// 设置渲染器允许场景中的阴影贴图
renderer.shadowMap.enabled = true;

// 将webgl渲染的canvas内容添加到body元素上
document.body.appendChild(renderer.domElement);

/**
 * 5.创建控制器
 */
// 创建轨道控制器; (相机,渲染器Canvas);
const control = new OrbitControls(camera, renderer.domElement);
// 设置阻尼感,操作效果更真实;
control.enableDamping = true;

/**
 * 添加坐标轴辅助器
 */
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

/**
 * 封装渲染函数
 */
function render() {
  control.update();
  renderer.render(scene, camera);
  // 渲染下一帧时递归调用rander函数;
  requestAnimationFrame(render);
}

render();

/**
 * 监听窗口改变,重新渲染画布
 */
window.addEventListener("resize", () => {
  // 更新摄像头宽高比
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

/**
 * 双击控制全屏模式
 */
window.addEventListener("contextmenu", () => {
  // 判断是否在全屏状态(返回全屏元素DOM);
  if (document.fullscreenElement) {
    // 在全屏状态时退出全屏
    document.exitFullscreen();
  } else {
    // 不再全屏状态时开启全屏
    renderer.domElement.requestFullscreen();
  }
});
