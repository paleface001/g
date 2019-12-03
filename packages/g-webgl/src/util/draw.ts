import { IElement } from '../interfaces';
import { IRendererService } from '../services/renderer/IRendererService';
import { IShaderModuleService } from '../services/shader/IShaderModuleService';

// 刷新图形元素(Shape 或者 Group)
export function refreshElement(element, changeType) {
  const canvas = element.get('canvas');
  // 只有存在于 canvas 上时生效
  if (canvas) {
    if (changeType === 'remove') {
      // 一旦 remove，则无法在 element 上拿到包围盒
      // destroy 后所有属性都拿不到，所以需要暂存一下
      // 这是一段 hack 的代码
      element._cacheCanvasBBox = element.get('cacheCanvasBBox');
    }
    if (!element.get('hasChanged')) {
      // 防止反复刷新
      if (canvas.get('localRefresh')) {
        canvas.refreshElement(element, changeType, canvas);
      }
      if (canvas.get('autoDraw')) {
        canvas.draw();
      }
      element.set('hasChanged', true);
    }
  }
}

export function drawChildren(
  children: IElement[],
  services: {
    rendererService: IRendererService;
    shaderModuleService: IShaderModuleService;
  }
) {
  for (let i = 0; i < children.length; i++) {
    const child = children[i] as IElement;
    if (child.get('visible')) {
      child.draw(services);
    } else {
      child.skipDraw();
    }
  }
}
