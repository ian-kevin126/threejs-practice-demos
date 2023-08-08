precision lowp float;
 varying vec2 vUv;
 varying float vElevation;
 uniform sampler2D uTexture;

 void main () {
      // 1.通过顶点对应的 uv 、位置，决定每一个像素的颜色
      // gl_FragColor = vec4(vUv,0,1);

      // 2.对第一种变形
      // gl_FragColor = vec4(vUv,1,1);

      // 3.利用uv实现渐变效果 反方向 1.0-vUv
      // gl_FragColor = vec4(1.0-vUv.x,1.0-vUv.y,1.0,1.0);

      // 4.利用取模达到反复效果
      // float strength = mod(vUv.y * 10.0 ,1.0);
      // gl_FragColor = vec4(strength,strength,strength,1.0);

      // 5.利用step达到黑白条纹
      // float strength = mod(vUv.y * 10.0 ,1.0);
      // strength = step(0.1,strength);
      // gl_FragColor = vec4(strength,strength,strength,1.0);

      
      // 6.条纹可以加减乘除
      float strength =step(0.8,mod(vUv.x * 10.0 ,1.0));
      strength += step(0.8,mod(vUv.y * 10.0 ,1.0));
      gl_FragColor = vec4(strength,strength,strength,1.0);
    }