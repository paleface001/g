uniform float u_Blur : 0.9;
uniform float u_Opacity : 1.0;
uniform float u_DashOffset : 0.0;
uniform float u_DashRatio : 0.0;

varying vec4 v_Color;
varying vec2 v_Normal;
varying float v_DashArray;
varying float v_DistanceRatio;

#pragma include "picking"

void main() {
  gl_FragColor = v_Color;
  // anti-alias by interpolating normal
  float blur = 1.- smoothstep(u_Blur, 1., length(v_Normal)) * u_Opacity;

  gl_FragColor.a *= u_Opacity * ceil(mod(v_DistanceRatio + u_DashOffset, v_DashArray) - (v_DashArray * u_DashRatio));

  // gl_FragColor.a *= blur;
  gl_FragColor = filterColor(gl_FragColor);
}
