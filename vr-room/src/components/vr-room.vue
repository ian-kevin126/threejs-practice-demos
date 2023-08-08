<!--
 * @Descripttion: 
 * @version: 
 * @Author: 北冥有你 2509777182@qq.com
 * @Date: 2022-11-29 12:56:57
 * @LastEditors: 北冥有你 2509777182@qq.com
 * @LastEditTime: 2022-11-30 15:32:06
-->
<template>
  <div class="container" ref="container"></div>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from 'vue'
import * as THREE from 'three'
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls'

export default defineComponent({
  name: 'vr-room',
  setup() {
    // 创建场景
    const scene = new THREE.Scene()

    // 创建相机 透视相机
    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerWidth, 0.1, 1000)
    // 设置相机位置
    camera.position.z = 0.1
    scene.add(camera)

    // 初始化渲染器
    const renderer = new THREE.WebGLRenderer()
    // 设置渲染器大小
    renderer.setSize(window.innerWidth, window.innerHeight)

    // 渲染
    const render = () => {
      renderer.render(scene, camera)
      // 请求动画帧，下一帧调用函数
      requestAnimationFrame(render)
    }

    // 添加物体
    const geometry = new THREE.BoxGeometry(10, 10, 10)
    const material = new THREE.MeshBasicMaterial({ color: 0x00ff00 })
    // 加载纹理
    const cube = new THREE.Mesh(geometry, material)
    // cube.position.set(0, 1, 0)
    cube.geometry.scale(1, 1, -1)
    scene.add(cube)

    // 挂载
    const container = ref()
    onMounted(() => {
      // 挂载完成后，获取dom,将 webgl 渲染到的 canvas 添加其中

      // 添加控制器
      const controls = new OrbitControls(camera, container?.value)
      controls.enableDamping = true
      container.value?.appendChild(renderer.domElement)
      render()
    })

    // 进入全屏，退出全屏
    window.addEventListener('dblclick', () => {
      // 进入全屏
      if (!document.fullscreenElement) {
        renderer.domElement.requestFullscreen()
      } else {
        document.exitFullscreen()
      }
    })

    // 监听窗口变化，更新渲染画面
    window.addEventListener('resize', () => {
      // 更新摄像头
      camera.aspect = window.innerWidth / window.innerHeight
      // 更新摄像机的投影矩阵
      camera.updateProjectionMatrix()
      // 更新渲染器
      renderer.setSize(window.innerWidth, window.innerHeight)
      // 设置渲染器的像素比
      renderer.setPixelRatio(window.devicePixelRatio)
    })

    // 添加坐标辅助器
    const axesHelper = new THREE.AxesHelper(5)
    scene.add(axesHelper)
    return {
      container
    }
  }
})
</script>

<style scoped lange="less">
.container {
  height: 100vh;
  width: 100vw;
  background-color: #f0f0f0;
}
</style>
