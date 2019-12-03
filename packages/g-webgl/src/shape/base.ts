import { AbstractShape } from '@antv/g-base';
import { ChangeType, BBox } from '@antv/g-base/lib/types';
import { refreshElement } from '../util/draw';
import { IRendererService } from '../services/renderer/IRendererService';
import { IShaderModuleService } from '../services/shader/IShaderModuleService';

class ShapeBase extends AbstractShape {
  /**
   * 待渲染 model 是否新建完毕
   */
  private isModelCreated: boolean = false;

  protected rendererService: IRendererService;

  protected shaderModuleService: IShaderModuleService;

  getDefaultAttrs() {
    const attrs = super.getDefaultAttrs();
    // 设置默认值
    attrs['lineWidth'] = 1;
    attrs['lineAppendWidth'] = 0;
    attrs['strokeOpacity'] = 1;
    attrs['fillOpacity'] = 1;
    return attrs;
  }

  calculateBBox(): BBox {
    const type = this.get('type');
    // const lineWidth = this.getHitLineWidth();
    // const attrs = this.attr();
    // const box = this.getInnerBox(attrs);
    // const halfLineWidth = lineWidth / 2;
    // const minX = box.x - halfLineWidth;
    // const minY = box.y - halfLineWidth;
    // const maxX = box.x + box.width + halfLineWidth;
    // const maxY = box.y + box.height + halfLineWidth;
    // return {
    //   x: minX,
    //   minX,
    //   y: minY,
    //   minY,
    //   width: box.width + lineWidth,
    //   height: box.height + lineWidth,
    //   maxX,
    //   maxY,
    // };
    return {
      x: 0,
      y: 0,
      width: 0,
      height: 0,
      minX: 0,
      minY: 0,
      maxX: 0,
      maxY: 0,
    };
  }

  /**
   * 一些方法调用会引起画布变化
   * @param {ChangeType} changeType 改变的类型
   */
  onCanvasChange(changeType: ChangeType) {
    refreshElement(this, changeType);
  }

  isFill() {
    return !!this.attrs['fill'] || this.isClipShape();
  }

  isStroke() {
    return !!this.attrs['stroke'];
  }

  draw({
    rendererService,
    shaderModuleService,
  }: {
    rendererService: IRendererService;
    shaderModuleService: IShaderModuleService;
  }) {
    if (!this.isModelCreated) {
      this.rendererService = rendererService;
      this.shaderModuleService = shaderModuleService;
      this.buildModel();
      this.isModelCreated = true;
    }
    this.drawModel();
    this._afterDraw();
  }

  _afterDraw() {
    // 绘制后消除标记
    this.set('hasChanged', false);
  }

  skipDraw() {
    this.set('hasChanged', false);
  }

  protected buildModel() {
    throw new Error('Method was not implemented');
  }

  protected drawModel() {
    throw new Error('Method was not implemented');
  }
}

export default ShapeBase;
