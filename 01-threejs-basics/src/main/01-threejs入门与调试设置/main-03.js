import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

console.log(THREE);

// 给物体添加辅助坐标系

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

// 4.添加物体（几何体）
const cubeGeometry = new THREE.BoxGeometry();
// 设置材质
const cubeMaterial = new THREE.MeshBasicMaterial({ color: 0xffff00 });
// 根据几何体和材质创建物体
const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);

// 5.将几何体添加到场景中
scene.add(cube);

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

// 添加坐标轴辅助器，默认红色代表X轴，绿色代表Y轴，蓝色代表Z轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

function render() {
  renderer.render(scene, camera);
  // 渲染下一帧就会重新执行 render 函数
  requestAnimationFrame(render);
}

render();

// 转动页面，就可以看到立方体在跟着转动了
