import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
import gsap from "gsap";

// 掌握 gsap：补间动画，专门用来做各种动画的

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
console.log("cube: ", cube);
// 修改物体的位置
// cube.position.set(5, 0, 0);
// 或者直接修改对应的轴
// cube.position.x = 5;

// 缩放，Y轴3倍，Y轴2倍，Z轴1倍
// cube.scale.set(3, 2, 1);
// 也可以单独设置某一个方向上的scale
// cube.scale.x = 5;

// 旋转
cube.rotation.set(Math.PI / 4, 0, 0, "XZY");

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
// 设置控制器阻尼，让控制器效果更逼真，注意：必须在动画循环里调用 update() 方法
controls.enableDamping = true;

// 添加坐标轴辅助器，默认红色代表X轴，绿色代表Y轴，蓝色代表Z轴
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);

// 设置时钟
const clock = new THREE.Clock();

// gsap 设置动画
// 控制 cube 在x轴上 5 秒运动到 5 的位置
let animate_1 = gsap.to(cube.position, {
  x: 5,
  duration: 5,
  ease: "power1.inOut",
  repeat: 2, // 重复两次，无限次循环是 -1
  yoyo: true, // 往返运动
  delay: 2, // 延迟时间
  onStart: () => {
    console.log("动画开始");
  },
  onComplete: () => {
    console.log("动画完成");
  },
});
gsap.to(cube.rotation, { x: 2 * Math.PI, duration: 5, ease: "power1.inOut" });

// 控制动画
window.addEventListener("dblclick", () => {
  if (animate_1.isActive()) {
    console.log("双击停止运动");
    animate_1.pause();
  } else {
    console.log("双击恢复运动");
    animate_1.resume();
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
