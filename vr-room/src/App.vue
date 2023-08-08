<!--
 * @Descripttion: 基于 threejs 的3D看房页面
 * @version: v1.0
 * @Author: 北冥有你 2509777182@qq.com
 * @Date: 2022-11-29 10:47:11
 * @LastEditors: 北冥有你 2509777182@qq.com
 * @LastEditTime: 2022-11-29 13:06:33
-->
<template>
  <vr-room></vr-room>
</template>

<script lang="ts">
import { defineComponent } from 'vue'
import VrRoom from './components/vr-room.vue'

export default defineComponent({
  name: 'App',
  components: {
    VrRoom
  },
  setup() {
    return {}
  }
})
</script>

<style lang="less">
* {
  margin: 0;
  padding: 0;
}
</style>
