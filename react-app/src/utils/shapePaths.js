/**
 * SVG path utilities for shape rendering.
 * getShapePath(shapeType, w, h, element) returns JSX-compatible SVG child elements.
 * angleToGradientCoords(deg) converts CSS angle to SVG linearGradient x1,y1,x2,y2.
 */

export function angleToGradientCoords(deg) {
  const rad = ((deg - 90) * Math.PI) / 180;
  const x1 = 0.5 - 0.5 * Math.cos(rad);
  const y1 = 0.5 - 0.5 * Math.sin(rad);
  const x2 = 0.5 + 0.5 * Math.cos(rad);
  const y2 = 0.5 + 0.5 * Math.sin(rad);
  return { x1, y1, x2, y2 };
}

function polygonPoints(cx, cy, rx, ry, sides, startAngle = -Math.PI / 2) {
  const pts = [];
  for (let i = 0; i < sides; i++) {
    const angle = startAngle + (2 * Math.PI * i) / sides;
    pts.push(`${cx + rx * Math.cos(angle)},${cy + ry * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

function starPoints(cx, cy, outerR, innerR, numPoints) {
  const pts = [];
  for (let i = 0; i < numPoints * 2; i++) {
    const angle = -Math.PI / 2 + (Math.PI * i) / numPoints;
    const r = i % 2 === 0 ? outerR : innerR;
    pts.push(`${cx + r * Math.cos(angle)},${cy + r * Math.sin(angle)}`);
  }
  return pts.join(' ');
}

export function getShapeSVGContent(shapeType, w, h, element = {}) {
  switch (shapeType) {
    case 'rectangle': {
      const r = element.borderRadius || 0;
      return { tag: 'rect', attrs: { x: 0, y: 0, width: w, height: h, rx: r, ry: r } };
    }
    case 'circle':
      return { tag: 'ellipse', attrs: { cx: w / 2, cy: h / 2, rx: w / 2, ry: h / 2 } };
    case 'triangle':
      return { tag: 'polygon', attrs: { points: `${w / 2},0 ${w},${h} 0,${h}` } };
    case 'star': {
      const nPts = element.starPoints || 5;
      const innerRatio = element.starInnerRadius || 0.4;
      const cx = w / 2, cy = h / 2;
      const outerR = Math.min(w, h) / 2;
      const innerR = outerR * innerRatio;
      return { tag: 'polygon', attrs: { points: starPoints(cx, cy, outerR, innerR, nPts) } };
    }
    case 'pentagon':
      return { tag: 'polygon', attrs: { points: polygonPoints(w / 2, h / 2, w / 2, h / 2, 5) } };
    case 'hexagon':
      return { tag: 'polygon', attrs: { points: polygonPoints(w / 2, h / 2, w / 2, h / 2, 6) } };
    case 'diamond':
      return { tag: 'polygon', attrs: { points: `${w / 2},0 ${w},${h / 2} ${w / 2},${h} 0,${h / 2}` } };
    case 'line':
      return { tag: 'line', attrs: { x1: 0, y1: h / 2, x2: w, y2: h / 2 } };
    case 'callout': {
      const r = 8;
      const bodyH = h * 0.75;
      const ptr = element.pointerPosition || 'bottom-center';
      let pointerPath = '';
      const pw = 16; // pointer width
      const ph = h - bodyH; // pointer height

      if (ptr.startsWith('bottom')) {
        const px = ptr === 'bottom-left' ? w * 0.25 : ptr === 'bottom-right' ? w * 0.75 : w / 2;
        pointerPath = `L${px - pw / 2},${bodyH} L${px},${h} L${px + pw / 2},${bodyH}`;
      } else if (ptr.startsWith('top')) {
        const px = ptr === 'top-left' ? w * 0.25 : ptr === 'top-right' ? w * 0.75 : w / 2;
        pointerPath = `M${px + pw / 2},${ph} L${px},0 L${px - pw / 2},${ph}`;
        // Build full path for top pointer
        const d = `M${r},${ph} ${pointerPath} L${w - r},${ph} Q${w},${ph} ${w},${ph + r} L${w},${h - r} Q${w},${h} ${w - r},${h} L${r},${h} Q0,${h} 0,${h - r} L0,${ph + r} Q0,${ph} ${r},${ph} Z`;
        return { tag: 'path', attrs: { d } };
      } else if (ptr === 'left') {
        const py = bodyH / 2;
        const d = `M${ph},${r} L${ph},${py - pw / 2} L0,${py} L${ph},${py + pw / 2} L${ph},${bodyH - r} Q${ph},${bodyH} ${ph + r},${bodyH} L${w - r},${bodyH} Q${w},${bodyH} ${w},${bodyH - r} L${w},${r} Q${w},0 ${w - r},0 L${ph + r},0 Q${ph},0 ${ph},${r} Z`;
        return { tag: 'path', attrs: { d } };
      } else if (ptr === 'right') {
        const py = bodyH / 2;
        const bw = w - ph;
        const d = `M${r},0 L${bw - r},0 Q${bw},0 ${bw},${r} L${bw},${py - pw / 2} L${w},${py} L${bw},${py + pw / 2} L${bw},${bodyH - r} Q${bw},${bodyH} ${bw - r},${bodyH} L${r},${bodyH} Q0,${bodyH} 0,${bodyH - r} L0,${r} Q0,0 ${r},0 Z`;
        return { tag: 'path', attrs: { d } };
      }

      // Default bottom pointer
      const d = `M${r},0 L${w - r},0 Q${w},0 ${w},${r} L${w},${bodyH - r} Q${w},${bodyH} ${w - r},${bodyH} ${pointerPath} L${r},${bodyH} Q0,${bodyH} 0,${bodyH - r} L0,${r} Q0,0 ${r},0 Z`;
      return { tag: 'path', attrs: { d } };
    }
    case 'heart': {
      const d = `M${w / 2},${h * 0.3} C${w / 2},${h * 0.15} ${w * 0.25},0 ${w * 0.1},0 C0,0 0,${h * 0.25} 0,${h * 0.25} C0,${h * 0.55} ${w / 2},${h * 0.85} ${w / 2},${h} C${w / 2},${h * 0.85} ${w},${h * 0.55} ${w},${h * 0.25} C${w},${h * 0.25} ${w},0 ${w * 0.9},0 C${w * 0.75},0 ${w / 2},${h * 0.15} ${w / 2},${h * 0.3} Z`;
      return { tag: 'path', attrs: { d } };
    }
    case 'cross': {
      const t = element.crossThickness || 0.33;
      const cx1 = w * ((1 - t) / 2);
      const cx2 = w * ((1 + t) / 2);
      const cy1 = h * ((1 - t) / 2);
      const cy2 = h * ((1 + t) / 2);
      const pts = `${cx1},0 ${cx2},0 ${cx2},${cy1} ${w},${cy1} ${w},${cy2} ${cx2},${cy2} ${cx2},${h} ${cx1},${h} ${cx1},${cy2} 0,${cy2} 0,${cy1} ${cx1},${cy1}`;
      return { tag: 'polygon', attrs: { points: pts } };
    }
    case 'badge':
      return { tag: 'circle', attrs: { cx: w / 2, cy: h / 2, r: Math.min(w, h) / 2 } };
    case 'arrow':
      // Arrow is handled separately in DraggableElement
      return null;
    default:
      return { tag: 'rect', attrs: { x: 0, y: 0, width: w, height: h } };
  }
}

export function getStrokeDasharray(strokeStyle, strokeWidth) {
  if (!strokeStyle || strokeStyle === 'solid') return undefined;
  const sw = Math.max(strokeWidth || 1, 1);
  if (strokeStyle === 'dashed') return `${sw * 4} ${sw * 2}`;
  if (strokeStyle === 'dotted') return `${sw} ${sw * 1.5}`;
  return undefined;
}
