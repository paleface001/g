attribute vec4 a_Color;
attribute vec2 a_Position;
attribute vec2 a_Extrude;
attribute float a_Size;
attribute float a_Shape;

uniform mat4 u_ViewProjectionMatrix;
uniform mat4 u_ModelMatrix;
uniform vec2 u_ViewportSize : [ 1, 1 ];

uniform float u_StrokeWidth : 2;

varying vec4 v_Data;
varying vec4 v_Color;
varying float v_Radius;

#pragma include "picking"

void main() {
  // unpack color(vec2)
  v_Color = a_Color;
  vec2 extrude = a_Extrude;

  float shape_type = a_Shape;

  // radius(16-bit)
  v_Radius = a_Size;

  vec2 offset = extrude * (a_Size + u_StrokeWidth);

  // gl_Position = u_ModelMatrix * u_ViewProjectionMatrix * vec4(a_Position + offset, 0.0, 1.0);
  gl_Position = vec4(a_Position + offset, 0.0, 1.0);
  gl_Position.xy = (gl_Position.xy / u_ViewportSize * 2.0 - 1.) * vec2(1, -1);

  // anti-alias
  float antialiasblur = 1.0 / (a_Size + u_StrokeWidth);

  // construct point coords
  v_Data = vec4(extrude, antialiasblur, shape_type);

  setPickingColor(a_PickingColor);
}
