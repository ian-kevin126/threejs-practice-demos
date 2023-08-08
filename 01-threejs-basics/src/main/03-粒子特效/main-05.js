import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入 dat.gui
import * as dat from "dat.gui";
import { MeshBasicMaterial } from "three";

// 复杂形状臂形旋转银河星系

// 1.创建场景
const scene = new THREE.Scene();

// 2.创建相机
// 2.1 透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  20
);

// 2.2 相机位置,并添加到场景中
camera.position.set(0, 0, 20);
scene.add(camera);

const params = {
  count: 1000,
  size: 0.1,
  radius: 5,
  branch: 3,
  color: "#ffffff",
};

let geometry = null;
let material = null;
let points = null;
const particlesTexture = new THREE.TextureLoader();

// 生成顶点
const generateGalaxy = () => {
  geometry = new THREE.BufferGeometry();
  // 顶点位置随机生成
  const positions = new Float32Array(params.count * 3);
  // 顶点颜色随机生成
  // const colors = new Float32Array(params.count * 3);
  // 循环生成定点
  for (let i = 0; i < params.count; i++) {
    // 当前点应该在那一条分支的角度上：有三条分支，所以每一条的角度就是 120° * n
    const branchAngel = (i % params.branch) * ((2 * Math.PI) / params.branch);
    // 当前点距离圆心的距离
    const distance = Math.random() * params.radius;

    // 在固定的angle上依据距离圆心的距离设置弯曲的程度，达到完全的效果，加入随机数就可以散开来
    positions[i * 3] =
      Math.cos(branchAngel + distance) * distance + Math.random();
    positions[i * 3 + 1] = Math.random();
    positions[i * 3 + 2] =
      Math.sin(branchAngel + distance) * distance + Math.random();
  }

  geometry.setAttribute("position", new THREE.BufferAttribute(positions, 3));

  // 设置顶点材质
  material = new THREE.PointsMaterial({
    color: new THREE.Color(params.color),
    size: params.size,
    sizeAttenuation: true,
    depthWrite: false,
    blending: THREE.AdditiveBlending,
    map: particlesTexture.load("./textures/particles/1.png"),
    transparent: true,
    // vertexColors: true
  });
  points = new THREE.Points(geometry, material);
  scene.add(points);
};

generateGalaxy();

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);

// 4. 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 4.2 将 webgl 渲染的 canvas 添加到 body 中
document.body.appendChild(renderer.domElement);
// 4.3 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

// 5. 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);
// 5.1 设置控制器阻尼;需要在动画循环里设置 .update()
controls.enableDamping = true;

// 8. 设置时钟
const clock = new THREE.Clock();

// 6. 渲染函数，下一次动画帧渲染
function render() {
  let time = clock.getElapsedTime();
  controls.update();
  renderer.render(scene, camera);
  // 请求动画帧，下一帧调用函数
  requestAnimationFrame(render);
}
render();

window.addEventListener("dblclick", () => {
  // 全屏
  // document.fullscreenElement  ==>  全屏元素
  if (!document.fullscreenElement) {
    // 进入全屏
    renderer.domElement.requestFullscreen();
  } else {
    // 退出全屏
    document.exitFullscreen();
  }
});

// 10. 监听窗口变化，更新渲染画面
window.addEventListener("resize", () => {
  console.log("画面变化");
  // 更新摄像头
  camera.aspect = window.innerWidth / window.innerHeight;
  // 更新摄像机的投影矩阵
  camera.updateProjectionMatrix();
  // 更新渲染器
  renderer.setSize(window.innerWidth, window.innerHeight);
  // 设置渲染器的像素比
  renderer.setPixelRatio(window.devicePixelRatio);
});

// 7. 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
