import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入 dat.gui
import * as dat from "dat.gui";
import { MeshBasicMaterial } from "three";
import * as CANNON from "cannon-es";

// 碰撞事件监听,碰撞音效,CANNON.ContactMaterial设置材质摩擦力，弹性系数

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
camera.position.set(0, 0, 20);
scene.add(camera);

// 创建球和平面
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
const sphereMaterial = new THREE.MeshStandardMaterial();
sphereMaterial.side = THREE.DoubleSide;
const sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
sphere.castShadow = true;
scene.add(sphere);

const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10, 10),
  sphereMaterial
);
scene.add(floor);
floor.position.set(0, -5, 0);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

// 创建物理世界
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// 创建物理小球
const sphereShape = new CANNON.Sphere(1);
// 设置小球的材质
const sphereWorldMaterial = new CANNON.Material("sphere");

// 物理世界中的物体
const sphereBody = new CANNON.Body({
  shape: sphereShape,
  position: new CANNON.Vec3(0, 0, 0),
  // 小球质量
  mass: 1,
  // 小球材质
  material: sphereWorldMaterial,
});
// 将物体添加到世界
world.addBody(sphereBody);
// 创建物理地面
const floorShape = new CANNON.Plane();
const floorBody = new CANNON.Body();
// 创建地面材质
const floorWrldMaterial = new CANNON.Material("floor");
floorBody.material = floorWrldMaterial;
// 当质量为0时，可以使物体保持不动
floorBody.mass = 0;
floorBody.addShape(floorShape);
// 地面位置
floorBody.position.set(0, -5, 0);
// 旋转地面位置
floorBody.quaternion.setFromAxisAngle(new CANNON.Vec3(1, 0, 0), -Math.PI / 2);
world.addBody(floorBody);

// 创建击打声音
const hitSound = new Audio("assets/hit.mp3");

// 设置材质碰撞参数
const defaultContactMaterial = new CANNON.ContactMaterial(
  sphereWorldMaterial,
  floorWrldMaterial,
  {
    friction: 0.1, // 摩擦系数
    restitution: 0.7, // 弹性系数
  }
);
// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial);

function HitEvent(e) {
  console.log(e);
  // 获取碰撞强度
  const impactStrength = e.contact.getImpactVelocityAlongNormal();
  console.log(impactStrength);
  if (impactStrength > 1) {
    // 注：当页面进行交互后，才可以播放音频
    // 函数调用时，重新播放声音
    hitSound.currentTime = 0;
    hitSound.volume = impactStrength / 10;
    hitSound.play();
  }
}
// 添加监听碰撞事件
sphereBody.addEventListener("collide", HitEvent);

// 灯光
// 环境光
const light = new THREE.AmbientLight(0xffffff, 0.5);
scene.add(light);
// 平行光
const dirLight = new THREE.DirectionalLight(0xffffff, 0.5);
// dirLight.position.set(10, 10, 10);
scene.add(dirLight);
dirLight.castShadow = true;

// 4. 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight);

// 4.2 将 webgl 渲染的 canvas 添加到 body 中
document.body.appendChild(renderer.domElement);
// 4.3 使用渲染器，通过相机将场景渲染进来
renderer.shadowMap.enabled = true;
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
  // 更新物理引擎中的物体
  // 模拟步进
  world.fixedStep();
  // 现实物体与渲染物体位置绑定
  sphere.position.copy(sphereBody.position);

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
