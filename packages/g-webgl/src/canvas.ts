import { AbstractCanvas } from '@antv/g-base';
import { ChangeType } from '@antv/g-base/lib/types';
import { IElement } from './interfaces';
import EventController from '@antv/g-base/lib/event/event-contoller';
import * as Shape from './shape';
import Group from './group';
import { drawChildren } from './util/draw';
import { getPixelRatio } from './util/util';
import { IRendererService } from './services/renderer/IRendererService';
import ReglRendererService from './services/renderer/regl';
import { IShaderModuleService } from './services/shader/IShaderModuleService';
import ShaderModuleService from './services/shader/ShaderModuleService';

class Canvas extends AbstractCanvas {
  private rendererService: IRendererService;
  private shaderModuleService: IShaderModuleService;

  getDefaultCfg() {
    const cfg = super.getDefaultCfg();
    // 是否自动绘制，不需要用户调用 draw 方法
    cfg['autoDraw'] = true;
    // 是否允许局部刷新图表
    cfg['localRefresh'] = true;
    cfg['refreshElements'] = [];
    return cfg;
  }

  /**
   * 一些方法调用会引起画布变化
   * @param {ChangeType} changeType 改变的类型
   */
  onCanvasChange(changeType: ChangeType) {
    // 排序时图形的层次发生变化，
    // 画布大小改变可能也会引起变化
    if (changeType === 'sort' || changeType === 'changeSize') {
      this.set('refreshElements', [this]);
      this.draw();
    }
  }

  getShapeBase() {
    return Shape;
  }

  getGroupBase() {
    return Group;
  }
  /**
   * 获取屏幕像素比
   */
  getPixelRatio() {
    return this.get('pixelRatio') || getPixelRatio();
  }

  getViewRange() {
    const element = this.get('el');
    return {
      minX: 0,
      minY: 0,
      maxX: element.width,
      maxY: element.height,
    };
  }

  // 复写处理事件
  initEvents() {
    const eventController = new EventController({
      canvas: this,
    });
    eventController.init();
    this.set('eventController', eventController);
  }

  // 复写基类的方法生成标签
  createDom(): HTMLElement {
    const $canvas = document.createElement('canvas');
    this.rendererService = new ReglRendererService();
    this.rendererService.init($canvas);

    this.shaderModuleService = new ShaderModuleService();
    this.shaderModuleService.registerBuiltinModules();
    return $canvas;
  }

  setDOMSize(width: number, height: number) {
    super.setDOMSize(width, height);
    const el = this.get('el');
    const pixelRatio = this.getPixelRatio();
    const widthInPixel = pixelRatio * width;
    const heightInPixel = pixelRatio * height;
    el.width = widthInPixel;
    el.height = heightInPixel;

    this.rendererService.viewport({
      x: 0,
      y: 0,
      width: widthInPixel,
      height: heightInPixel,
    });
  }

  clear() {
    super.clear();
  }

  /**
   * 刷新图形元素，这里仅仅是放入队列，下次绘制时进行绘制
   * @param {IElement} element 图形元素
   */
  refreshElement(element: IElement) {
    const refreshElements = this.get('refreshElements');
    refreshElements.push(element);
    if (this.get('autoDraw')) {
      this._startDraw();
    }
  }

  // 手工调用绘制接口
  draw() {
    const drawFrame = this.get('drawFrame');
    if (this.get('autoDraw') && drawFrame) {
      return;
    }
    this._startDraw();
  }
  // 绘制所有图形
  _drawAll() {
    this.rendererService.clear({
      color: [0, 0, 0, 0],
      depth: 1,
      stencil: 0,
      framebuffer: null,
    });
    const children = this.getChildren() as IElement[];
    drawChildren(children, {
      rendererService: this.rendererService,
      shaderModuleService: this.shaderModuleService,
    });
  }

  // 触发绘制
  _startDraw() {
    let drawFrame = this.get('drawFrame');
    if (!drawFrame) {
      drawFrame = requestAnimationFrame(() => {
        this._drawAll();
        this.set('drawFrame', null);
      });
      this.set('drawFrame', drawFrame);
    }
  }

  destroy() {
    const eventController = this.get('eventController');
    eventController.destroy();
    super.destroy();
    this.rendererService.destroy();
  }
}

export default Canvas;
