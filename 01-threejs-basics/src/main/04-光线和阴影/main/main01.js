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
  300
);

// 2.2 相机位置,并添加到场景中
camera.position.set(0, 0, 18);
scene.add(camera);

// 创建立方体
const cubeGeometry = new THREE.BoxBufferGeometry(2, 2, 2);
const materialBox = new THREE.MeshBasicMaterial({
  wireframe: true,
});
// 选中物体成为红色
const redMaterial = new THREE.MeshBasicMaterial({
  color: "#ff0000",
});

// 创建 1000 个立方体
let cubeArr = [];
// 创建组
let cubeGroup = new THREE.Group();

for (let i = 0; i < 5; i++) {
  for (let j = -0; j < 5; j++) {
    for (let z = -0; z < 5; z++) {
      const cube = new THREE.Mesh(cubeGeometry, materialBox);
      cube.position.set(i * 2 - 5, j * 2 - 5, z * 2 - 5);
      cubeGroup.add(cube);
      cubeGroup.position.setY(-3);
      cubeArr.push(cube);
    }
  }
}
scene.add(cubeGroup);

// 创建三角形
var sjx;
var sjxGroup = new THREE.Group();
// new THREE.BufferAttribute() 缓冲区
for (let i = 0; i < 50; i++) {
  const geometry = new THREE.BufferGeometry();
  const positionArray = new Float32Array(9);
  for (let j = 0; j < 9; j++) {
    if (j % 3 == 1) {
      positionArray[j] = Math.random() * 10 - 5;
    } else {
      positionArray[j] = Math.random() * 10 - 5;
    }
  }
  geometry.setAttribute(
    "position",
    new THREE.BufferAttribute(positionArray, 3)
  );
  // 材质
  let color = new THREE.Color(Math.random(), Math.random(), Math.random());

  const material = new THREE.MeshBasicMaterial({
    color: color,
    transparent: true,
    opacity: 0.5,
    side: THREE.DoubleSide,
  });
  // 3.3 创建物体
  sjx = new THREE.Mesh(geometry, material);
  // 3.3 将物体添加到场景中
  sjxGroup.add(sjx);
  sjxGroup.position.set(0, -40, 0);
  scene.add(sjxGroup);
}

// 3.1 创建几何体
var sphereGroup = new THREE.Group();
const sphereGeometry = new THREE.SphereBufferGeometry(1, 20, 20);
// 3.2 添加材质
const material = new THREE.MeshStandardMaterial({
  // color: "#ffffff",
});
material.side = THREE.DoubleSide;
const sphere = new THREE.Mesh(sphereGeometry, material);
sphere.castShadow = true;
// scene.add(sphere)
sphereGroup.add(sphere);

const planeGeometry = new THREE.PlaneBufferGeometry(50, 50);
const plane = new THREE.Mesh(planeGeometry, material);
plane.position.set(0, -1, 0);
plane.rotation.x = -Math.PI / 2;
plane.receiveShadow = true;
sphereGroup.add(plane);
// scene.add(plane)

const smallBall = new THREE.Mesh(
  new THREE.SphereBufferGeometry(0.1, 20, 20),
  new MeshBasicMaterial({
    color: 0xff0000,
  })
);
smallBall.position.set(2, 2, 2);
// 点光源
const pointLight = new THREE.PointLight(0xff0000, 0.5);
pointLight.position.set(2, 2, 2);
pointLight.castShadow = true;
// 设置阴影贴图模糊度
pointLight.shadow.radius = 20;
// 设置阴影贴图分辨率
pointLight.shadow.mapSize.set(2048, 2048);
pointLight.intensity = 3;
console.log(pointLight.shadow);
// 聚光灯目标物体
pointLight.target = sphere;
smallBall.add(pointLight);
sphereGroup.add(smallBall);
scene.add(sphereGroup);
sphereGroup.position.set(0, -70, 0);

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
const renderer = new THREE.WebGLRenderer({
  alpha: true,
});
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight);
// 渲染器透明

// 4.2 将 webgl 渲染的 canvas 添加到 body 中
document.body.appendChild(renderer.domElement);
// 4.3 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

// 5. 创建轨道控制器
// const controls = new OrbitControls(camera, renderer.domElement)
//  5.1 设置控制器阻尼;需要在动画循环里设置 .update()
// controls.enableDamping = true

// 8. 设置时钟
const clock = new THREE.Clock();

// 6. 渲染函数，下一次动画帧渲染
function render() {
  let time = clock.getElapsedTime();
  cubeGroup.rotation.x = time * 0.5;
  cubeGroup.rotation.y = time * 0.5;
  sjxGroup.rotation.x = time * 0.4;
  sjxGroup.rotation.y = time * 0.4;
  smallBall.position.x = Math.sin(time) * 3;
  smallBall.position.z = Math.cos(time) * 3;
  // 上下横跳
  smallBall.position.y = 2 + Math.sin(time * 3);
  // 根据当前滚动的 scrolly ,去设置相机移动的位置
  camera.position.y = -(window.scrollY / window.innerHeight) * 35; //两物体上下差30
  // 物体左右抖动
  camera.position.x += mouse.x * 10 - camera.position.x;
  // controls.update()
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

// 设置当前值
let currentPage = 0;
// 监听滚动事件，让相机随着页面滚动
window.addEventListener("scroll", () => {
  const newPage = Math.round(window.scrollY / window.innerHeight);
  if (newPage != currentPage) {
    currentPage = newPage;
  }
});

// 7. 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
