import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";
import * as dat from "dat.gui";

// 透明纹理

// 1.创建场景
const scene = new THREE.Scene();

// 2.创建透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 3.设置相机位置
camera.position.set(0, 0, 10);
scene.add(camera);

// 导入纹理
const textureLoader = new THREE.TextureLoader();
// 注意：需要将textures文件夹复制到dist文件夹中
const doorColorTexture = textureLoader.load("./textures/door/color.jpg");
const doorAlphaTexture = textureLoader.load("./textures/door/alpha.jpg");

// 4.添加物体（几何体）
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
// 材质
const basicMaterial = new THREE.MeshBasicMaterial({
  color: "#ffff00",
  map: doorColorTexture,
  transparent: true,
  // alphaMap: doorAlphaTexture,
  opacity: 0.3,
  side: THREE.DoubleSide,
});

const cube = new THREE.Mesh(cubeGeometry, basicMaterial);
scene.add(cube);

// 添加平面
const plane = new THREE.Mesh(new THREE.PlaneGeometry(1, 1), basicMaterial);
plane.position.set(3, 0, 0);
scene.add(plane);

// 6.初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 设置渲染的尺寸
renderer.setSize(window.innerWidth, window.innerHeight);

// 7.将webgl渲染的canvas内容添加到body
document.body.appendChild(renderer.domElement);

// 8.使用渲染器，通过相机、场景渲染
// renderer.render(scene, camera);

// 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 设置控制器阻尼，让控制器效果更逼真，注意：必须在动画循环里调用 update() 方法
controls.enableDamping = true;

// 添加坐标轴辅助器，默认红色代表X轴，绿色代表Y轴，蓝色代表Z轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 双击控制全屏（进入+退出）
window.addEventListener("dblclick", () => {
  const fullScreenElement = document.fullscreenElement;
  if (!fullScreenElement) {
    // 双击控制屏幕进入全屏，让画布对象全屏
    renderer.domElement.requestFullscreen();
  } else {
    // 这里就是要让 document 退出全屏
    document.exitFullscreen();
  }
});

function render() {
  controls.update();
  renderer.render(scene, camera);
  // 渲染下一帧就会重新执行 render 函数
  requestAnimationFrame(render);
}

render();

// 监听画面的变化，更新渲染
window.addEventListener("resize", () => {
  console.log("页面变化了");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});
