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

  /**
   * 渲染服务
   */
  protected rendererService: IRendererService;

  /**
   * Shader 模块化服务
   */
  protected shaderModuleService: IShaderModuleService;

  /**
   * 待更新的脏属性
   */
  protected dirtyAttributes: {
    [attributeName: string]: unknown;
  } = {};

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
    // @ts-ignore
    const type = this.get('type');
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

  onAttrChange(name: string, value: any, originValue: any) {
    super.onAttrChange(name, value, originValue);
    this.dirtyAttributes[name] = value;
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
    this.dirtyAttributes = {};
  }

  skipDraw() {
    this.set('hasChanged', false);
    this.dirtyAttributes = {};
  }

  protected buildModel() {
    throw new Error('Method was not implemented');
  }

  protected drawModel() {
    throw new Error('Method was not implemented');
  }
}

export default ShapeBase;
