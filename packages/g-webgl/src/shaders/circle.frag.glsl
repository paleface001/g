uniform float u_Blur : 0;
uniform float u_Opacity : 1;
uniform float u_StrokeWidth : 1;
uniform vec4 u_StrokeColor : [0, 0, 0, 0];
uniform float u_StrokeOpacity : 1;

varying vec4 v_Data;
varying vec4 v_Color;
varying vec3 v_Size;

#pragma include "sdf_2d"
#pragma include "picking"

void main() {
  int shape = int(floor(v_Data.w + 0.5));

  lowp float antialiasblur = v_Data.z;
  float antialiased_blur = -max(u_Blur, antialiasblur);
  float rx = v_Size.x / (v_Size.x + u_StrokeWidth);
  float ry = v_Size.y / (v_Size.y + u_StrokeWidth);

  float outer_df;
  float inner_df;

  if (shape == 0) {
    outer_df = sdCircle(v_Data.xy, 1.);
    inner_df = sdCircle(v_Data.xy, rx);
  } else if (shape == 1) {
    outer_df = sdEllipsoidApproximated(v_Data.xy, vec2(1.));
    inner_df = sdEllipsoidApproximated(v_Data.xy, vec2(rx, ry));
  } else if (shape == 2) {
    outer_df = sdRoundedBox(v_Data.xy, vec2(v_Size.x / v_Size.y, 1.), .2);
    inner_df = sdRoundedBox(v_Data.xy, vec2(rx, ry), 0.);
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
