import { distance } from './util';

export default {
  /**
   * 计算包围盒
   * @param {number} x 圆心 x
   * @param {number} y 圆心 y
   * @param {number} r 半径
   * @returns {object} 包围盒
   */
  box(x: number, y: number, r: number) {
    return {
      x,
      y,
      width: 2 * r,
      height: 2 * r,
    };
  },
  /**
   * 计算周长
   * @param {number} x 圆心 x
   * @param {number} y 圆心 y
   * @param {number} r 半径
   * @returns {number} 周长
   */
  length(x: number, y: number, r: number) {
    return Math.PI * 2 * r;
  },
  /**
   * 根据比例获取点
   * @param {number} x 圆心 x
   * @param {number} y 圆心 y
   * @param {number} r 半径
   * @param {number} t 指定比例，x轴方向为 0
   * @returns {object} 点
   */
  pointAt(x: number, y: number, r: number, t: number) {
    const angle = Math.PI * 2 * t;
    return {
      x: x + r * Math.cos(angle),
      y: y + r * Math.sin(angle),
    };
  },
  /**
   * 点到圆的距离
   * @param {number} x 圆心 x
   * @param {number} y 圆心 y
   * @param {number} r 半径
   * @returns {number} 距离
   */
  pointDistance(x: number, y: number, r: number, x0, y0) {
    return Math.abs(distance(x, y, x0, y0) - r);
  },
  /**
   * 根据比例角度
   * @param {number} x 圆心 x
   * @param {number} y 圆心 y
   * @param {number} r 半径
   * @param {number} t 指定比例，x轴方向为 0
   * @returns {number} 角度
   */
  tangentAngle(x: number, y: number, r: number, t) {
    const angle = Math.PI * 2 * t;
    return angle + Math.PI / 2;
  },
};
