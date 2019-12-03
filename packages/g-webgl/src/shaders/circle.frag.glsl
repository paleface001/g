uniform float u_Blur : 0;
uniform float u_Opacity : 1;
uniform float u_StrokeWidth : 1;
uniform vec4 u_StrokeColor : [0, 0, 0, 0];
uniform float u_StrokeOpacity : 1;

varying vec4 v_Data;
varying vec4 v_Color;
varying float v_Radius;

#pragma include "sdf_2d"
#pragma include "picking"

void main() {
  int shape = int(floor(v_Data.w + 0.5));

  lowp float antialiasblur = v_Data.z;
  float antialiased_blur = -max(u_Blur, antialiasblur);
  float r = v_Radius / (v_Radius + u_StrokeWidth);

  float outer_df;
  float inner_df;
  // 'circle', 'triangle', 'square', 'pentagon', 'hexagon', 'octogon', 'hexagram', 'rhombus', 'vesica'
  if (shape == 0) {
    outer_df = sdCircle(v_Data.xy, 1.0);
    inner_df = sdCircle(v_Data.xy, r);
  } else if (shape == 1) {
    outer_df = sdEquilateralTriangle(1.1 * v_Data.xy);
    inner_df = sdEquilateralTriangle(1.1 / r * v_Data.xy);
  } else if (shape == 2) {
    outer_df = sdBox(v_Data.xy, vec2(1.));
    inner_df = sdBox(v_Data.xy, vec2(r));
  } else if (shape == 3) {
    outer_df = sdPentagon(v_Data.xy, 0.8);
    inner_df = sdPentagon(v_Data.xy, r * 0.8);
  } else if (shape == 4) {
    outer_df = sdHexagon(v_Data.xy, 0.8);
    inner_df = sdHexagon(v_Data.xy, r * 0.8);
  } else if (shape == 5) {
    outer_df = sdOctogon(v_Data.xy, 1.0);
    inner_df = sdOctogon(v_Data.xy, r);
  } else if (shape == 6) {
    outer_df = sdHexagram(v_Data.xy, 0.52);
    inner_df = sdHexagram(v_Data.xy, r * 0.52);
  } else if (shape == 7) {
    outer_df = sdRhombus(v_Data.xy, vec2(1.0));
    inner_df = sdRhombus(v_Data.xy, vec2(r));
  } else if (shape == 8) {
    outer_df = sdVesica(v_Data.xy, 1.1, 0.8);
    inner_df = sdVesica(v_Data.xy, r * 1.1, r * 0.8);
  }

  float opacity_t = smoothstep(0.0, antialiased_blur, outer_df);
  if (u_StrokeWidth < 0.01) {
    gl_FragColor = v_Color * opacity_t;
    return;
  }
  float color_t = u_StrokeWidth < 0.01 ? 0.0 : smoothstep(
    antialiased_blur,
    0.0,
    inner_df
  );
  vec4 strokeColor = u_StrokeColor == vec4(0) ? v_Color : u_StrokeColor;

  gl_FragColor = opacity_t * mix(vec4(v_Color.rgb, v_Color.a * u_Opacity), strokeColor * u_StrokeOpacity, color_t);

  gl_FragColor = filterColor(gl_FragColor);
}
