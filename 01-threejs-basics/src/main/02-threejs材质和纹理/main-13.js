import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入 dat.gui
import * as dat from "dat.gui";

const gui = new dat.GUI();

// console.log(THREE)

// 灯光与阴影
// a. 物体材质要满足对光照有反应 可以使用标准网格材质 MeshStandardMaterial
// b. 设置渲染器开启阴影计算 renderer.shadowMap.enabled = true
// c. 设置光照投射阴影 directionalLight.castShadow = true
// d. 设置物体投射阴影 sphere.castShadow = true
// c. 设置物体接收阴影 plane.receiveShadow = true
// d. 设置阴影模糊度

// 1.创建场景
const scene = new THREE.Scene();

// 2.创建相机
// 2.1 透视相机
const camera = new THREE.PerspectiveCamera(
  75,
  window.innerWidth / window.innerHeight,
  0.1,
  1000
);

// 2.2 相机位置,并添加到场景中
camera.position.set(0, 0, 10);
scene.add(camera);

// 3. 添加物体
// 3.1 创建几何体
const sphereGeometry = new THREE.SphereGeometry(1, 20, 20);
// 3.2 添加材质
const material = new THREE.MeshStandardMaterial({
  // color: "#ffffff",
});
material.side = THREE.DoubleSide;
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.castShadow = true;
scene.add(sphere);

// 添加一个平面
const planeGeometry = new THREE.PlaneGeometry(10, 10);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
// 平面要设置为接受阴影
plane.receiveShadow = true;
scene.add(plane);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
// 直线光源
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
directionalLight.position.set(10, 10, 10);
directionalLight.castShadow = true;

// 设置阴影贴图模糊度
directionalLight.shadow.radius = 20;
// 设置阴影贴图分辨率
directionalLight.shadow.mapSize.set(2048, 2048);
console.log(directionalLight.shadow);

// 设置平行光投射相机的属性 ==> 超过一定距离不再渲染阴影
directionalLight.shadow.camera.near = 0.5;
directionalLight.shadow.camera.far = 500;
directionalLight.shadow.camera.top = 5;
directionalLight.shadow.camera.bottom = -5;
directionalLight.shadow.camera.left = -5;
directionalLight.shadow.camera.right = 5;

scene.add(directionalLight);

gui
  .add(directionalLight.shadow.camera, "near")
  .min(0)
  .max(20)
  .step(0.1)
  .onChange(() => {
    // 更新摄像机矩阵，在任何参数被改变后必须被调用
    directionalLight.shadow.camera.updateProjectionMatrix();
  });

// 4. 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight);
renderer.shadowMap.enabled = true;
// console.log(renderer); // 包含一个 canvas
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
