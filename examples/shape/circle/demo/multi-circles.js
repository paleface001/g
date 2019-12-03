const canvas = new G_WebGL.Canvas({
  container: 'container',
  width: 600,
  height: 500,
});

new Array(100).fill(undefined).forEach(() => {
  canvas.addShape('circle', {
    attrs: {
      x: Math.random() * 600,
      y: Math.random() * 500,
      r: 30 + Math.random() * 100,
      fill: '#1890FF',
      stroke: '#F04864',
      lineWidth: 4,
    },
  });
});
