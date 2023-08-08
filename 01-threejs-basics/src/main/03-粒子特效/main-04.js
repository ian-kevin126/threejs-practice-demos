import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入 dat.gui
import * as dat from "dat.gui";
import { MeshBasicMaterial } from "three";

// 漫天雪花飞舞

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

// 创建雪花函数
function createPoints(url, size = 0.5) {
  // 3. 添加物体
  // 3.1 创建几何体
  const particlesGeometry = new THREE.BufferGeometry();
  const count = 5000;
  // 设置缓冲区数组
  const position = new Float32Array(count * 3);
  // 设置顶点
  const colors = new Float32Array(count * 3);
  for (let i = 0; i < count * 3; i++) {
    position[i] = (Math.random() - 0.5) * 30;
    colors[i] = Math.random();
  }
  particlesGeometry.setAttribute(
    "position",
    new THREE.BufferAttribute(position, 3)
  );
  // 修改点颜色
  particlesGeometry.setAttribute("color", new THREE.BufferAttribute(colors, 3));

  // 创建 points
  const pointMaterial = new THREE.PointsMaterial();

  // 设置点纹理
  // 载入纹理
  const textureLoader = new THREE.TextureLoader();
  const texture = textureLoader.load(`./textures/particles/${url}.png`);
  // 纹理贴图
  pointMaterial.map = texture;
  // 灰度贴图
  pointMaterial.alphaMap = texture;
  // 材质是否透明
  pointMaterial.transparent = true;
  // 材质对深度缓冲区的影响
  pointMaterial.depthWrite = false;
  // 材质显示对象混合模式
  pointMaterial.blending = THREE.AdditiveBlending;
  // 修改点材质大小
  pointMaterial.size = 0.5;
  // 相机深度衰减 ==> 不衰减，所有点一样大小
  pointMaterial.sizeAttenuation = true;
  // 设置启用顶点颜色
  pointMaterial.vertexColors = true;

  const points = new THREE.Points(particlesGeometry, pointMaterial);
  scene.add(points);

  return points;
}

const points = createPoints("xuehua");
const points_2 = createPoints("3");

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
  // 进行旋转，达到下雪效果
  points.rotation.x = time * 0.3;
  points_2.rotation.x = time * 0.3;
  points_2.rotation.y = time * 0.2;
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
