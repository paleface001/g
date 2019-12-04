/**
 * @fileoverview SDF 绘制 2D 图形
 * @author pyqiverson@gmail.com
 */

import ShapeBase from './base';
import { IModel } from '../services/renderer/IModel';
import circleVertex from '../shaders/circle.vert.glsl';
import circleFragment from '../shaders/circle.frag.glsl';
import { rgb2arr } from '../util/color';
import { gl } from '../services/renderer/gl';
import { getPixelRatio } from '../util/util';

export default class Rect extends ShapeBase {
  private model: IModel;

  protected buildModel() {
    const { createModel, createAttribute, createBuffer, createElements } = this.rendererService;
    // @ts-ignore
    const { x, y, width, height, radius, fill, fillOpacity, stroke, strokeOpacity, lineWidth } = this.attr();
    const halfWidth = width / 2;
    const halfHeight = height / 2;
    const centerX = x + halfWidth;
    const centerY = y + halfHeight;

    const fillColor = rgb2arr(fill);
    const strokeColor = rgb2arr(stroke);

    // 注册 Shader 模块并编译
    this.shaderModuleService.registerModule('rect', {
      vs: circleVertex,
      fs: circleFragment,
    });

    // 获取编译结果
    const { vs, fs, uniforms } = this.shaderModuleService.getModule('rect');

    this.model = createModel({
      vs,
      fs,
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: [centerX, centerY, centerX, centerY, centerX, centerY, centerX, centerY],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
        a_Extrude: createAttribute({
          buffer: createBuffer({
            data: [-1, -1, 1, -1, 1, 1, -1, 1],
            type: gl.FLOAT,
          }),
          size: 2,
        }),
        a_Size: createAttribute({
          buffer: createBuffer({
            data: [
              halfWidth,
              halfHeight,
              radius,
              halfWidth,
              halfHeight,
              radius,
              halfWidth,
              halfHeight,
              radius,
              halfWidth,
              halfHeight,
              radius,
            ],
            type: gl.FLOAT,
          }),
          size: 3,
        }),
        a_Shape: createAttribute({
          buffer: createBuffer({
            data: [2, 2, 2, 2],
            type: gl.FLOAT,
          }),
          size: 1,
        }),
        a_Color: createAttribute({
          buffer: createBuffer({
            data: [...fillColor, ...fillColor, ...fillColor, ...fillColor],
            type: gl.FLOAT,
          }),
          size: 4,
        }),
        a_PickingColor: createAttribute({
          buffer: createBuffer({
            data: [...[0, 0, 0], ...[0, 0, 0], ...[0, 0, 0], ...[0, 0, 0]],
            type: gl.FLOAT,
          }),
          size: 3,
        }),
      },
      uniforms: {
        ...uniforms,
        u_StrokeColor: strokeColor,
        u_Opacity: fillOpacity,
        u_StrokeOpacity: strokeOpacity,
        u_StrokeWidth: lineWidth,
      },
      primitive: gl.TRIANGLES,
      elements: createElements({
        data: [0, 1, 2, 2, 3, 0],
        type: gl.UNSIGNED_INT,
        count: 6,
      }),
      depth: {
        enable: false,
      },
      blend: {
        enable: true,
        func: {
          srcRGB: gl.SRC_ALPHA,
          srcAlpha: 1,
          dstRGB: gl.ONE_MINUS_SRC_ALPHA,
          dstAlpha: 1,
        },
      },
    });
  }

  protected drawModel() {
    const { width, height } = this.rendererService.getViewportSize();
    const pixelRatio = getPixelRatio();
    this.model.draw({
      uniforms: {
        u_ViewportSize: [width / pixelRatio, height / pixelRatio],
        u_ViewProjectionMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
        u_ModelMatrix: [1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 0, 0, 1],
      },
    });
  }
}
