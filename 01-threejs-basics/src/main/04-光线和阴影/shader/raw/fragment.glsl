precision lowp float;
 varying vec2 vUv;
 varying float vElevation;
 uniform sampler2D uTexture;

 void main () {
      // gl_FragColor = vec4(0, 0.74902, 1.0,1.0);
      float height = vElevation + 0.05  * 10.0;
      // gl_FragColor = vec4(0,0.74902* height,1.0,1.0);
      // 依据 uv, 去除对应的颜色
      vec4 textureColor = texture2D(uTexture,vUv);
      // textureColor.rgb *= height;
      gl_FragColor = textureColor;
    }