attribute vec3 position;  // 顶点独有
attribute vec2 uv;
uniform mat4 modelMaterix;  // 顶点全有
uniform mat4 viewMatrix;
uniform mat4 projectionMatrix;
varying vec2 vUv; // 顶点传递给片元
varying float vElevation;

// 获取时间
uniform float uTime;

// 精度 highp > mediump > lowp
// 以多少精度进行渲染
precision lowp float;

void main () {
      vUv = uv;
      vec4 modelPosition =  vec4(position, 1.0);
      gl_Position = projectionMatrix * viewMatrix * modelPosition  ;
    }