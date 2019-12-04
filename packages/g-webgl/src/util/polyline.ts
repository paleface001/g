import { vec2 } from 'gl-matrix';

function computeMiter(tangent: vec2, miter: vec2, lineA: vec2, lineB: vec2, halfThick: number) {
  vec2.add(tangent, lineA, lineB);
  vec2.normalize(tangent, tangent);
  vec2.copy(miter, vec2.fromValues(-tangent[1], tangent[0]));
  const tmp = vec2.fromValues(-lineA[1], lineA[0]);
  return halfThick / vec2.dot(miter, tmp);
}

function computeNormal(out: vec2, dir: vec2) {
  vec2.set(out, -dir[1], dir[0]);
  return out;
}

function direction(out: vec2, a: vec2, b: vec2) {
  vec2.sub(out, a, b);
  vec2.normalize(out, out);
  return out;
}

function extrusions(positions: number[][], out: any, point: number[], normal: number[], scale: number) {
  addNext(out, normal, -scale);
  addNext(out, normal, scale);
  positions.push(point);
  positions.push(point);
}

function addNext(out: any[][], normal: number[], length: number) {
  out.push([[normal[0], normal[1]], length]);
}

export default function(points: number[][], closed: boolean, indexOffset?: number) {
  const lineA = vec2.fromValues(0, 0);
  const lineB = vec2.fromValues(0, 0);
  const tangent = vec2.fromValues(0, 0);
  const miter = vec2.create();
  let _lastFlip = -1;
  let _started = false;
  let _normal: any = null;
  const tmp = vec2.create();
  let count = indexOffset || 0;
  const miterLimit = 3;

  const out: any = [];
  const attrPos: number[][] = [];
  const attrIndex = [];
  const attrDistance: number[] = [0, 0];
  if (closed) {
    points = points.slice();
    points.push(points[0]);
  }

  const total = points.length;
  for (let i = 1; i < total; i++) {
    const index = count;
    const last = points[i - 1];
    const cur = points[i];
    const next = i < points.length - 1 ? points[i + 1] : null;
    // accumulated distance
    const d = vec2.distance(cur, last) + attrDistance[attrDistance.length - 1];

    direction(lineA, cur, last);

    if (!_normal) {
      _normal = [0, 0];
      computeNormal(_normal, lineA);
    }

    if (!_started) {
      _started = true;
      extrusions(attrPos, out, last, _normal, 1);
    }

    attrIndex.push([index + 0, index + 1, index + 2]);

    if (!next) {
      computeNormal(_normal, lineA);
      extrusions(attrPos, out, cur, _normal, 1);
      attrIndex.push(_lastFlip === 1 ? [index, index + 2, index + 3] : [index + 2, index + 1, index + 3]);
      attrDistance.push(d, d);
      count += 2;
    } else {
      // get unit dir of next line
      direction(lineB, next, cur);

      // stores tangent & miter
      let miterLen = computeMiter(tangent, miter, lineA, lineB, 1);

      // get orientation
      let flip = vec2.dot(tangent, _normal) < 0 ? -1 : 1;
      const bevel = miterLen > miterLimit;

      // 处理相邻线段重叠的情况
      if (!isFinite(miterLen)) {
        computeNormal(_normal, lineA);
        extrusions(attrPos, out, cur, _normal, 1);
        attrIndex.push(_lastFlip === 1 ? [index, index + 2, index + 3] : [index + 2, index + 1, index + 3]);

        count += 2;
        _lastFlip = flip;
        attrDistance.push(d, d);
        continue;
      }

      if (bevel) {
        miterLen = miterLimit;

        // next two points in our first segment
        addNext(out, _normal, -flip);
        attrPos.push(cur);
        addNext(out, miter, miterLen * flip);
        attrPos.push(cur);

        attrIndex.push(_lastFlip !== -flip ? [index, index + 2, index + 3] : [index + 2, index + 1, index + 3]);

        // now add the bevel triangle
        attrIndex.push([index + 2, index + 3, index + 4]);

        computeNormal(tmp, lineB);
        vec2.copy(_normal, tmp); // store normal for next round

        addNext(out, _normal, -flip);
        attrPos.push(cur);

        attrDistance.push(d, d, d);
        // the miter is now the normal for our next join
        count += 3;
      } else {
        // next two points for our miter join
        extrusions(attrPos, out, cur, miter, miterLen);
        attrIndex.push(_lastFlip === 1 ? [index, index + 2, index + 3] : [index + 2, index + 1, index + 3]);

        flip = -1;

        // the miter is now the normal for our next join
        vec2.copy(_normal, miter);
        attrDistance.push(d, d);
        count += 2;
      }
      _lastFlip = flip;
    }
  }

  return {
    normals: out,
    attrIndex,
    attrPos,
    attrDistance,
  };
}
