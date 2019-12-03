import { IElement as IBaseElement } from '@antv/g-base/lib/interfaces';
import { IRendererService } from './services/renderer/IRendererService';
import { IShaderModuleService } from './services/shader/IShaderModuleService';

// 导出 g-base 中的 interfaces
export * from '@antv/g-base/lib/interfaces';

// 覆盖 g-base 中 IElement 的类型定义
export interface IElement extends IBaseElement {
  /**
   * 调用服务完成绘制
   * @param {IRendererService} services.rendererService 渲染服务
   * @param {IShaderModuleService} services.shaderModuleService Shader 模块化服务
   */
  draw(services: { rendererService: IRendererService; shaderModuleService: IShaderModuleService });
  /**
   * 跳过绘制时需要处理的逻辑
   */
  skipDraw();
}
