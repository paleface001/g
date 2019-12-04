
attribute vec2 a_Position;
attribute float a_Miter;
attribute vec4 a_Color;
attribute float a_Size;
attribute vec2 a_Normal;
attribute float a_Distance;
attribute float a_TotalDistance;
attribute float a_DashArray;

uniform vec2 u_ViewportSize : [ 1, 1 ];

#pragma include "picking"

varying vec4 v_Color;
varying vec2 v_Normal;
varying float v_DashArray;
varying float v_DistanceRatio;

void main() {
  v_Normal = a_Normal * sign(a_Miter);
  v_Color = a_Color;

  v_DashArray = a_DashArray;
  v_DistanceRatio = a_Distance / a_TotalDistance;

  vec2 offset = normalize(a_Normal) * a_Miter * a_Size;

  // gl_Position = u_ModelMatrix * u_ViewProjectionMatrix * vec4(a_Position + offset, 0.0, 1.0);
  gl_Position = vec4(a_Position + offset, 0.0, 1.0);
  gl_Position.xy = (gl_Position.xy / u_ViewportSize * 2.0 - 1.) * vec2(1, -1);

  setPickingColor(a_PickingColor);
}
