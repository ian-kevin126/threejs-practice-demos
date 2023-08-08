import * as THREE from "three";
// 导入轨道控制器
import { OrbitControls } from "three/examples/jsm/controls/OrbitControls";

// 导入顶点着色和片元着色
import basicVertexShader from "../shader/raw/vertex.glsl";
import basicFragmentShader from "../shader/raw/fragment.glsl";

// webgl RawShaderMaterial 材质的使用

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
const cubeGeometry = new THREE.PlaneGeometry(2, 2, 64, 64);

// 纹理加载器
const textureLoader = new THREE.TextureLoader();
const texture = textureLoader.load("./assets/texture/ca.jpg");

// 3.2 材质

// 使用外部着色器
const shaderMatrial = new THREE.RawShaderMaterial({
  // 顶点着色
  vertexShader: basicVertexShader,
  // 片元着色
  fragmentShader: basicFragmentShader,
  // wireframe: true
  // 传入数据
  uniforms: {
    uTime: {
      value: 0,
    },
    uTexture: {
      value: texture,
    },
  },
});

shaderMatrial.side = THREE.DoubleSide;
// 3.3 创建物体
const cube = new THREE.Mesh(cubeGeometry, shaderMatrial);
cube.position.set(0, 1, 0);
cube.rotation.x = -Math.PI / 2;

// 3.3 将物体添加到场景中
scene.add(cube);

// 4. 初始化渲染器
const renderer = new THREE.WebGLRenderer();
// 4.1 设置渲染尺寸和大小
renderer.setSize(window.innerWidth, window.innerHeight);
// console.log(renderer); // 包含一个 canvas
// 4.2 将 webgl 渲染的 canvas 添加到 body 中
document.body.appendChild(renderer.domElement);
// 4.3 使用渲染器，通过相机将场景渲染进来
renderer.render(scene, camera);

// 5. 创建轨道控制器
const controls = new OrbitControls(camera, renderer.domElement);

const clock = new THREE.Clock();
// 6. 渲染函数，下一次动画帧渲染
function render() {
  const elapsedTime = clock.getElapsedTime();
  shaderMatrial.uniforms.uTime.value = elapsedTime;
  renderer.render(scene, camera);
  // 请求动画帧，下一帧调用函数
  requestAnimationFrame(render);
}
render();

// 7. 添加坐标轴辅助器
const axesHelper = new THREE.AxesHelper(5);
scene.add(axesHelper);
