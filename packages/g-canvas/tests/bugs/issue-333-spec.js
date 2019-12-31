// const expect = require('chai').expect;
import Canvas from '../../src/canvas';
// import { getColor } from '../get-color';

const dom = document.createElement('div');
document.body.appendChild(dom);
dom.id = 'c1';
// dom.style.transform = 'scale(0.8)';

describe('#333', () => {
  const canvas = new Canvas({
    container: dom,
    width: 600,
    height: 600,
    attrs: {
      matrix: [0.8, 0, 0, 0, 0.8, 0, 0, 0, 1],
    },
  });

  it('should work correctly when container is transformed by CSS', () => {
    const group = canvas.addGroup({
      attrs: {
        matrix: [0.8, 0, 0, 0, 0.8, 0, 0, 0, 1],
      },
    });

    const circle = group.addShape('circle', {
      attrs: {
        x: 150,
        y: 150,
        r: 60,
        fill: 'red',
      },
    });

    circle.on('mouseenter', () => {
      circle.attr('fill', 'blue');
    });

    circle.on('mouseleave', () => {
      circle.attr('fill', 'red');
    });
  });
});
