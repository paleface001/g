const canvas = new G_WebGL.Canvas({
  container: 'container',
  width: 600,
  height: 500,
});

const line = canvas.addShape('line', {
  attrs: {
    x1: 200,
    y1: 150,
    x2: 400,
    y2: 150,
    lineWidth: 2,
    stroke: '#F04864',
  },
});

line.animate(
  {
    lineWidth: 50,
    stroke: 'blue',
  },
  {
    delay: 0,
    duration: 2000,
    easing: 'easeLinear',
    callback: () => {},
    repeat: true,
  }
);
