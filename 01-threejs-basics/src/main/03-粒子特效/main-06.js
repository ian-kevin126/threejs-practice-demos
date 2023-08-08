import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入 dat.gui
import * as dat from "dat.gui";
import { MeshBasicMaterial } from "three";

// 光线投射与物体交互

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

// 创建立方体
const cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
const material = new THREE.MeshBasicMaterial({
  wireframe: true,
});
// 选中物体成为红色
const redMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});

// 创建 1000 个立方体
let cubeArr = [];
for (let i = -5; i < 5; i++) {
  for (let j = -5; j < 5; j++) {
    for (let z = -5; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, material);
      cube.position.set(i, j, z);
      scene.add(cube);
      cubeArr.push(cube);
    }
  }
}

// 创建投射光线对象
const raycaster = new THREE.Raycaster();
// 鼠标位置对象
const mouse = new THREE.Vector2();
// 监听鼠标位置
window.addEventListener("mousemove", (event) => {
  mouse.x = (event.clientX / window.innerWidth) * 2 - 1;
  mouse.y = -((event.clientY / window.innerHeight) * 2 - 1);
  raycaster.setFromCamera(mouse, camera);
  let result = raycaster.intersectObjects(cubeArr);
  if (result.length !== 0) {
    // 对选中，并且是最近的物体更改材质
    result[0].object.material = redMaterial;
  }
});

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
