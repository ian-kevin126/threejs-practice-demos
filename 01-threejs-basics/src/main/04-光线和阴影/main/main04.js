import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";
// 导入 dat.gui
import * as dat from "dat.gui";
import { MeshBasicMaterial } from "three";
import * as CANNON from "cannon-es";

// 立方体相互碰撞后旋转效果（quaternion）,物体添加作用力

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

// 创建物理世界
const world = new CANNON.World({
  gravity: new CANNON.Vec3(0, -9.82, 0),
});

// 创建击打声音
const hitSound = new Audio("assets/hit.mp3");

// 创建cube
var cubeArr = [];
const cubeMaterial = new THREE.MeshStandardMaterial();
// 设置方块的材质
const cubeWorldMaterial = new CANNON.Material("sphere");

function createCube() {
  // 创建立方体
  const cubeGeometry = new THREE.BoxBufferGeometry(1, 1, 1);
  cubeMaterial.side = THREE.DoubleSide;
  const cube = new THREE.Mesh(cubeGeometry, cubeMaterial);
  cube.castShadow = true;
  scene.add(cube);
  // 创建物理世界的立方体
  const cubeShape = new CANNON.Box(new CANNON.Vec3(0.5, 0.5, 0.5));

  // 物理世界中的物体
  const cubeBody = new CANNON.Body({
    shape: cubeShape,
    position: new CANNON.Vec3(0, 0, 0),
    // 方块质量
    mass: 1,
    // 方块材质
    material: cubeWorldMaterial,
  });
  // 给物体添加本地作用力
  cubeBody.applyLocalForce(
    new CANNON.Vec3(180, 0, 0), // 添加的力的大小和方向
    new CANNON.Vec3(0, 0, 0) // 施加力的作用点
  );
  // 将物体添加到世界
  world.addBody(cubeBody);

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
  cubeBody.addEventListener("collide", HitEvent);
  // 立方体与物理世界立方体添加到数组中
  cubeArr.push({
    mesh: cube,
    body: cubeBody,
  });
}

// 点击创建方块
window.addEventListener("click", createCube);

// 创建平面
const floor = new THREE.Mesh(
  new THREE.PlaneBufferGeometry(10, 10),
  cubeMaterial
);
scene.add(floor);
floor.position.set(0, -5, 0);
floor.rotation.x = -Math.PI / 2;
floor.receiveShadow = true;

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

// 设置材质碰撞参数
const defaultContactMaterial = new CANNON.ContactMaterial(
  cubeWorldMaterial,
  floorWrldMaterial,
  {
    friction: 0.1, // 摩擦系数
    restitution: 0.7, // 弹性系数
  }
);
// 将材料的关联设置添加到物理世界
world.addContactMaterial(defaultContactMaterial);

// 设置世界碰撞的默认材料
world.defaultContactMaterial = defaultContactMaterial;

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
  cubeArr.forEach((item) => {
    item.mesh.position.copy(item.body.position);
    // 设置渲染的物体跟随物理世界物体旋转
    item.mesh.quaternion.copy(item.body.quaternion);
  });

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
