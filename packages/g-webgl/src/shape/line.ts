/**
 * @fileoverview 使用拉伸算法绘制直线
 * @see https://zhuanlan.zhihu.com/p/59541559
 * @author pyqiverson@gmail.com
 */

import ShapeBase from './base';
import { IModel } from '../services/renderer/IModel';
import polylineVertex from '../shaders/polyline.vert.glsl';
import polylineFragment from '../shaders/polyline.frag.glsl';
import { rgb2arr } from '../util/color';
import { gl } from '../services/renderer/gl';
import getNormals from '../util/polyline';
import { getPixelRatio } from '../util/util';

export default class Line extends ShapeBase {
  private model: IModel;

  protected buildModel() {
    const { createModel, createAttribute, createBuffer, createElements } = this.rendererService;
    // @ts-ignore
    const { x1, y1, x2, y2, stroke, lineWidth, lineDash, opacity = 1 } = this.attr();

    const strokeColor = rgb2arr(stroke);
    const halfWidth = lineWidth / 2;
    const dashOffset = 0;
    // 仅支持等距虚线 lineDash: [5, 10]，不支持 [5, 10, 15]
    const dashRatio = lineDash ? lineDash[0] / (lineDash[0] + lineDash[1]) : 0;

    const { normals, attrIndex, attrPos, attrDistance } = getNormals(
      [
        [x1, y1],
        [x2, y2],
      ],
      false,
      0
    );

    const positionBufferData = [];
    const miterBufferData = [];
    const normalBufferData = [];
    const sizeBufferData = [];
    const colorBufferData = [];
    const pickingColorBufferData = [];
    const dashArrayBufferData = [];
    const totalDistanceBufferData = [];
    const totalDistance = attrDistance[attrDistance.length - 1];

    for (let i = 0; i < attrPos.length; i++) {
      positionBufferData.push(...attrPos[i]);
      miterBufferData.push(normals[i][1]);
      normalBufferData.push(...normals[i][0]);
      sizeBufferData.push(halfWidth);
      colorBufferData.push(...strokeColor);
      pickingColorBufferData.push(...[0, 0, 0]);
      totalDistanceBufferData.push(totalDistance);
      dashArrayBufferData.push(lineDash ? lineDash[0] / totalDistance : 1);
    }

    // 注册 Shader 模块并编译
    this.shaderModuleService.registerModule('line', {
      vs: polylineVertex,
      fs: polylineFragment,
    });

    // 获取编译结果
    const { vs, fs, uniforms } = this.shaderModuleService.getModule('line');

    this.model = createModel({
      vs,
      fs,
      attributes: {
        a_Position: createAttribute({
          buffer: createBuffer({
            data: positionBufferData,
            type: gl.FLOAT,
          }),
          size: 2,
        }),
        a_Normal: createAttribute({
          buffer: createBuffer({
            data: normalBufferData,
            type: gl.FLOAT,
          }),
          size: 2,
        }),
        a_Miter: createAttribute({
          buffer: createBuffer({
            data: miterBufferData,
            type: gl.FLOAT,
          }),
          size: 1,
        }),
        a_Size: createAttribute({
          buffer: createBuffer({
            data: sizeBufferData,
            type: gl.FLOAT,
          }),
          size: 1,
        }),
        a_Color: createAttribute({
          buffer: createBuffer({
            data: colorBufferData,
            type: gl.FLOAT,
          }),
          size: 4,
        }),
        a_PickingColor: createAttribute({
          buffer: createBuffer({
            data: pickingColorBufferData,
            type: gl.FLOAT,
          }),
          size: 3,
        }),
        a_Distance: createAttribute({
          buffer: createBuffer({
            data: attrDistance,
            type: gl.FLOAT,
          }),
          size: 1,
        }),
        a_TotalDistance: createAttribute({
          buffer: createBuffer({
            data: totalDistanceBufferData,
            type: gl.FLOAT,
          }),
          size: 1,
        }),
        a_DashArray: createAttribute({
          buffer: createBuffer({
            data: dashArrayBufferData,
            type: gl.FLOAT,
          }),
          size: 1,
        }),
      },
      uniforms: {
        ...uniforms,
        u_Opacity: opacity,
        u_DashOffset: dashOffset,
        u_DashRatio: dashRatio,
      },
      primitive: gl.TRIANGLES,
      elements: createElements({
        data: attrIndex,
        type: gl.UNSIGNED_INT,
        count: attrIndex.length * 3,
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
