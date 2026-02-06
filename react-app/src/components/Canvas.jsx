import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import useEditorStore from '../store/editorStore';
import { SnapLines, GuideLines, Rulers, DraggableElement } from './canvas';

function getElBounds(el, zoom, overrideX, overrideY) {
  const domEl = document.querySelector(`[data-element-id="${el.id}"]`);
  let w, h;
  if (domEl) {
    const rect = domEl.getBoundingClientRect();
    w = rect.width / zoom;
    h = rect.height / zoom;
  } else {
    w = el.width || 100;
    h = el.height || 50;
  }
  const x = overrideX ?? el.x;
  const y = overrideY ?? el.y;
  return { left: x, top: y, right: x + w, bottom: y + h, width: w, height: h, cx: x + w / 2, cy: y + h / 2 };
}

function findNearest(bounds, others) {
  let L = null, R = null, T = null, B = null;
  let dL = Infinity, dR = Infinity, dT = Infinity, dB = Infinity;

  for (const o of others) {
    const vOver = bounds.top < o.bottom && bounds.bottom > o.top;
    const hOver = bounds.left < o.right && bounds.right > o.left;

    if (vOver) {
      if (o.right <= bounds.left) { const d = bounds.left - o.right; if (d < dL) { dL = d; L = o; } }
      if (o.left >= bounds.right) { const d = o.left - bounds.right; if (d < dR) { dR = d; R = o; } }
    }
    if (hOver) {
      if (o.bottom <= bounds.top) { const d = bounds.top - o.bottom; if (d < dT) { dT = d; T = o; } }
      if (o.top >= bounds.bottom) { const d = o.top - bounds.bottom; if (d < dB) { dB = d; B = o; } }
    }
  }
  return { L, R, T, B };
}

// Collect unique gaps between adjacent element pairs
function collectExistingGaps(bounds) {
  const hGaps = new Set();
  const vGaps = new Set();
  for (let i = 0; i < bounds.length; i++) {
    for (let j = i + 1; j < bounds.length; j++) {
      const a = bounds[i], b = bounds[j];
      const vOver = a.top < b.bottom && a.bottom > b.top;
      if (vOver) {
        if (a.right <= b.left) hGaps.add(Math.round(b.left - a.right));
        else if (b.right <= a.left) hGaps.add(Math.round(a.left - b.right));
      }
      const hOver = a.left < b.right && a.right > b.left;
      if (hOver) {
        if (a.bottom <= b.top) vGaps.add(Math.round(b.top - a.bottom));
        else if (b.bottom <= a.top) vGaps.add(Math.round(a.top - b.bottom));
      }
    }
  }
  return { hGaps: [...hGaps], vGaps: [...vGaps] };
}

// Build distance measurements from final position to nearest elements
function buildMeasurements(fb, others) {
  const { L, R, T, B } = findNearest(fb, others);
  const m = [];

  if (L) {
    const d = fb.left - L.right;
    if (d > 0) {
      const oT = Math.max(fb.top, L.top), oB = Math.min(fb.bottom, L.bottom);
      m.push({ orientation: 'horizontal', start: L.right, end: fb.left, offset: (oT + oB) / 2, value: Math.round(d) });
    }
  }
  if (R) {
    const d = R.left - fb.right;
    if (d > 0) {
      const oT = Math.max(fb.top, R.top), oB = Math.min(fb.bottom, R.bottom);
      m.push({ orientation: 'horizontal', start: fb.right, end: R.left, offset: (oT + oB) / 2, value: Math.round(d) });
    }
  }
  if (T) {
    const d = fb.top - T.bottom;
    if (d > 0) {
      const oL = Math.max(fb.left, T.left), oR = Math.min(fb.right, T.right);
      m.push({ orientation: 'vertical', start: T.bottom, end: fb.top, offset: (oL + oR) / 2, value: Math.round(d) });
    }
  }
  if (B) {
    const d = B.top - fb.bottom;
    if (d > 0) {
      const oL = Math.max(fb.left, B.left), oR = Math.min(fb.right, B.right);
      m.push({ orientation: 'vertical', start: fb.bottom, end: B.top, offset: (oL + oR) / 2, value: Math.round(d) });
    }
  }

  // Mark equal-spacing measurements
  const hm = m.filter(x => x.orientation === 'horizontal');
  if (hm.length === 2 && hm[0].value === hm[1].value) hm.forEach(x => { x.equal = true; });
  const vm = m.filter(x => x.orientation === 'vertical');
  if (vm.length === 2 && vm[0].value === vm[1].value) vm.forEach(x => { x.equal = true; });

  return m;
}

// Build bounded alignment lines (Figma-style: only between aligned elements)
function buildAlignmentLines(fb, otherBounds) {
  const ext = 12; // extension beyond elements
  const tol = 1;
  const lineMap = new Map();

  const addLine = (orientation, position, from, to) => {
    const key = `${orientation}-${Math.round(position)}`;
    if (lineMap.has(key)) {
      const existing = lineMap.get(key);
      existing.from = Math.min(existing.from, from);
      existing.to = Math.max(existing.to, to);
    } else {
      lineMap.set(key, { orientation, position, from, to });
    }
  };

  for (const o of otherBounds) {
    const vFrom = Math.min(fb.top, o.top) - ext;
    const vTo = Math.max(fb.bottom, o.bottom) + ext;
    const hFrom = Math.min(fb.left, o.left) - ext;
    const hTo = Math.max(fb.right, o.right) + ext;

    // Vertical alignment lines (X-axis)
    if (Math.abs(fb.left - o.left) < tol) addLine('vertical', o.left, vFrom, vTo);
    if (Math.abs(fb.right - o.right) < tol) addLine('vertical', o.right, vFrom, vTo);
    if (Math.abs(fb.cx - o.cx) < tol) addLine('vertical', o.cx, vFrom, vTo);
    if (Math.abs(fb.left - o.right) < tol) addLine('vertical', o.right, vFrom, vTo);
    if (Math.abs(fb.right - o.left) < tol) addLine('vertical', o.left, vFrom, vTo);

    // Horizontal alignment lines (Y-axis)
    if (Math.abs(fb.top - o.top) < tol) addLine('horizontal', o.top, hFrom, hTo);
    if (Math.abs(fb.bottom - o.bottom) < tol) addLine('horizontal', o.bottom, hFrom, hTo);
    if (Math.abs(fb.cy - o.cy) < tol) addLine('horizontal', o.cy, hFrom, hTo);
    if (Math.abs(fb.top - o.bottom) < tol) addLine('horizontal', o.bottom, hFrom, hTo);
    if (Math.abs(fb.bottom - o.top) < tol) addLine('horizontal', o.top, hFrom, hTo);
  }

  // Canvas center/edge lines (full-width, no bounds)
  if (Math.abs(fb.cx - 800) < tol) addLine('vertical', 800, 0, 900);
  if (Math.abs(fb.cy - 450) < tol) addLine('horizontal', 450, 0, 1600);
  if (Math.abs(fb.left) < tol) addLine('vertical', 0, 0, 900);
  if (Math.abs(fb.right - 1600) < tol) addLine('vertical', 1600, 0, 900);
  if (Math.abs(fb.top) < tol) addLine('horizontal', 0, 0, 1600);
  if (Math.abs(fb.bottom - 900) < tol) addLine('horizontal', 900, 0, 1600);

  return [...lineMap.values()];
}

export default function Canvas() {
  const {
    zoom,
    setZoom,
    background,
    getBackgroundStyle,
    elements,
    selectedElementIds,
    selectElement,
    toggleSelectElement,
    updateElement,
    deselectElement,
    saveState,
    getGroupForElement,
    groups,
    showRulers,
    showGuides,
    guides,
    snapToGuides,
    snapThreshold,
    enterGroup,
  } = useEditorStore();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [snapLines, setSnapLines] = useState([]);
  const [measurements, setMeasurements] = useState([]);

  useEffect(() => { setZoom(1); }, [setZoom]);

  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      setZoom(zoom + (e.deltaY > 0 ? -0.05 : 0.05));
    }
  }, [zoom, setZoom]);

  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;
    container.addEventListener('wheel', handleWheel, { passive: false });
    return () => container.removeEventListener('wheel', handleWheel);
  }, [handleWheel]);

  const handleCanvasClick = (e) => {
    if (e.target === canvasRef.current || e.target.classList.contains('canvas__content') || e.target.classList.contains('canvas__background')) {
      deselectElement();
    }
  };

  // Smart snap + distance measurement logic
  const handleElementUpdate = useCallback((id, updates) => {
    if (!snapToGuides || (updates.x == null && updates.y == null)) {
      updateElement(id, updates);
      setSnapLines([]);
      setMeasurements([]);
      return;
    }

    const el = elements.find(e => e.id === id);
    if (!el) { updateElement(id, updates); return; }

    const proposedX = updates.x ?? el.x;
    const proposedY = updates.y ?? el.y;
    const b = getElBounds(el, zoom, proposedX, proposedY);
    const threshold = snapThreshold;

    // Snap candidates per axis
    const xSnaps = [];
    const ySnaps = [];
    const tryX = (snapped) => { const d = Math.abs(proposedX - snapped); if (d < threshold) xSnaps.push({ v: snapped, d }); };
    const tryY = (snapped) => { const d = Math.abs(proposedY - snapped); if (d < threshold) ySnaps.push({ v: snapped, d }); };

    // Canvas center + edges
    tryX(800 - b.width / 2);
    tryY(450 - b.height / 2);
    tryX(0); tryX(1600 - b.width);
    tryY(0); tryY(900 - b.height);

    // Other elements: alignment snaps
    const others = elements.filter(e => e.id !== id && e.visible !== false);
    const otherBounds = others.map(e => getElBounds(e, zoom));

    for (const o of otherBounds) {
      // Center-to-center
      tryX(o.cx - b.width / 2);
      tryY(o.cy - b.height / 2);
      // Edge alignment
      tryX(o.left); tryX(o.right - b.width);
      tryY(o.top); tryY(o.bottom - b.height);
      // Cross-edge
      tryX(o.right); tryX(o.left - b.width);
      tryY(o.bottom); tryY(o.top - b.height);
    }

    // Find nearest neighbors for spacing snaps
    const proposedBounds = { left: proposedX, top: proposedY, right: proposedX + b.width, bottom: proposedY + b.height, width: b.width, height: b.height };
    const { L, R, T, B: Bot } = findNearest(proposedBounds, otherBounds);

    // Equal spacing: center between two neighbors
    if (L && R) {
      const totalGap = R.left - L.right;
      if (totalGap > b.width) tryX(L.right + (totalGap - b.width) / 2);
    }
    if (T && Bot) {
      const totalGap = Bot.top - T.bottom;
      if (totalGap > b.height) tryY(T.bottom + (totalGap - b.height) / 2);
    }

    // Spacing replication: match existing gaps between other elements
    const { hGaps, vGaps } = collectExistingGaps(otherBounds);
    if (L) { for (const gap of hGaps) tryX(L.right + gap); }
    if (R) { for (const gap of hGaps) tryX(R.left - gap - b.width); }
    if (T) { for (const gap of vGaps) tryY(T.bottom + gap); }
    if (Bot) { for (const gap of vGaps) tryY(Bot.top - gap - b.height); }

    // Guides
    guides.forEach(guide => {
      if (guide.orientation === 'vertical') tryX(guide.position - b.width / 2);
      else tryY(guide.position - b.height / 2);
    });

    // Pick best snap per axis (closest to proposed)
    xSnaps.sort((a, c) => a.d - c.d);
    ySnaps.sort((a, c) => a.d - c.d);
    const snapX = xSnaps.length > 0 ? xSnaps[0].v : proposedX;
    const snapY = ySnaps.length > 0 ? ySnaps[0].v : proposedY;

    // Build bounded alignment lines from final position
    const finalBounds = {
      left: snapX, top: snapY,
      right: snapX + b.width, bottom: snapY + b.height,
      width: b.width, height: b.height,
      cx: snapX + b.width / 2, cy: snapY + b.height / 2,
    };
    const newLines = buildAlignmentLines(finalBounds, otherBounds);
    const newMeasurements = buildMeasurements(finalBounds, otherBounds);

    setSnapLines(newLines);
    setMeasurements(newMeasurements);

    // Apply movement
    const dx = snapX - el.x;
    const dy = snapY - el.y;
    if (dx === 0 && dy === 0) return;

    const movingIds = new Set(selectedElementIds);
    // Only expand to full group when multiple elements are already selected
    if (selectedElementIds.length > 1) {
      movingIds.forEach(eid => {
        const group = getGroupForElement(eid);
        if (group) group.elementIds.forEach(gid => movingIds.add(gid));
      });
    }
    movingIds.forEach(eid => {
      if (eid === id) {
        updateElement(eid, { ...updates, x: snapX, y: snapY });
      } else {
        const otherEl = elements.find(e => e.id === eid);
        if (otherEl) updateElement(eid, { x: otherEl.x + dx, y: otherEl.y + dy });
      }
    });
  }, [updateElement, elements, guides, snapToGuides, snapThreshold, getGroupForElement, selectedElementIds, zoom]);

  const handleDragEnd = useCallback(() => {
    setSnapLines([]);
    setMeasurements([]);
    saveState();
  }, [saveState]);

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const backgroundStyle = getBackgroundStyle();
  const hasBlur = background.type === 'image' && background.blur > 0;

  const selectedGroupBoxes = useMemo(() => {
    if (selectedElementIds.length === 0) return [];
    const seen = new Set();
    const boxes = [];
    for (const id of selectedElementIds) {
      const group = groups.find(g => g.elementIds.includes(id));
      if (!group || seen.has(group.id)) continue;
      seen.add(group.id);
      const members = elements.filter(el => group.elementIds.includes(el.id));
      if (members.length < 2) continue;
      let minX = Infinity, minY = Infinity, maxX = -Infinity, maxY = -Infinity;
      for (const el of members) {
        const domEl = document.querySelector(`[data-element-id="${el.id}"]`);
        let w, h;
        if (domEl) { const rect = domEl.getBoundingClientRect(); w = rect.width / zoom; h = rect.height / zoom; }
        else { w = el.width || el.size || 150; h = el.height || el.size || 50; }
        minX = Math.min(minX, el.x); minY = Math.min(minY, el.y);
        maxX = Math.max(maxX, el.x + w); maxY = Math.max(maxY, el.y + h);
      }
      boxes.push({ id: group.id, x: minX - 12, y: minY - 12, w: maxX - minX + 24, h: maxY - minY + 24 });
    }
    return boxes;
  }, [selectedElementIds, groups, elements, zoom]);

  return (
    <main className="canvas-area">
      <div className="canvas-container" ref={containerRef}>
        {showRulers && <Rulers zoom={zoom} />}
        <div
          ref={canvasRef}
          className="canvas"
          id="canvas"
          style={{
            ...(!hasBlur ? backgroundStyle : {}),
            transform: `scale(${zoom})`,
            marginLeft: showRulers ? 30 : 0,
            marginTop: showRulers ? 24 : 0,
          }}
          onClick={handleCanvasClick}
        >
          {hasBlur && (
            <div
              className="canvas__background"
              style={{
                ...backgroundStyle,
                filter: `blur(${background.blur}px)`,
                transform: 'scale(1.1)',
              }}
            />
          )}
          <div className="canvas__content">
            {sortedElements
              .filter(el => el.visible !== false)
              .map(element => (
                <DraggableElement
                  key={element.id}
                  element={element}
                  isSelected={selectedElementIds.includes(element.id)}
                  zoom={zoom}
                  onSelect={(e) => (e?.shiftKey || e?.ctrlKey || e?.metaKey) ? toggleSelectElement(element.id) : selectElement(element.id)}
                  onClick={() => {
                    const group = getGroupForElement(element.id);
                    if (group && selectedElementIds.includes(element.id)) {
                      enterGroup(group.id);
                      selectElement(element.id);
                    }
                  }}
                  onUpdate={(updates) => handleElementUpdate(element.id, updates)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            {selectedGroupBoxes.map(box => (
              <div
                key={box.id}
                className="group-bbox"
                style={{ position: 'absolute', left: box.x, top: box.y, width: box.w, height: box.h }}
              />
            ))}
            <SnapLines lines={snapLines} measurements={measurements} />
            {showGuides && <GuideLines guides={guides} />}
          </div>
        </div>
      </div>
      <div className="canvas-info">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => setZoom(zoom - 0.1)} disabled={zoom <= 0.25} title="Thu nhỏ">−</button>
          <input type="range" className="zoom-slider" min="25" max="200" value={Math.round(zoom * 100)} onChange={(e) => setZoom(parseInt(e.target.value) / 100)} />
          <button className="zoom-btn" onClick={() => setZoom(zoom + 0.1)} disabled={zoom >= 2} title="Phóng to">+</button>
          <button className="zoom-btn zoom-btn--fit" onClick={() => setZoom(1)} title="Vừa màn hình">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          <select className="zoom-preset" value={Math.round(zoom * 100)} onChange={(e) => { if (e.target.value) setZoom(parseInt(e.target.value) / 100); }}>
            <option value="25">25%</option>
            <option value="50">50%</option>
            <option value="75">75%</option>
            <option value="100">100%</option>
            <option value="150">150%</option>
            <option value="200">200%</option>
          </select>
        </div>
      </div>
    </main>
  );
}
