import { useRef, useState, useEffect, useCallback } from 'react';
import useEditorStore from '../store/editorStore';
import { SnapLines, GuideLines, Rulers, DraggableElement } from './canvas';

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
    showRulers,
    showGuides,
    guides,
    snapToGuides,
    snapThreshold,
  } = useEditorStore();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [snapLines, setSnapLines] = useState([]);

  useEffect(() => { setZoom(1); }, [setZoom]);

  // Scroll wheel zoom
  const handleWheel = useCallback((e) => {
    if (e.ctrlKey || e.metaKey) {
      e.preventDefault();
      const delta = e.deltaY > 0 ? -0.05 : 0.05;
      setZoom(zoom + delta);
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

  // Smart snap logic
  const handleElementUpdate = useCallback((id, updates) => {
    if (!snapToGuides || (!updates.x && !updates.y)) {
      updateElement(id, updates);
      setSnapLines([]);
      return;
    }

    const newLines = [];
    const el = elements.find(e => e.id === id);
    if (!el) { updateElement(id, updates); return; }

    const newX = updates.x ?? el.x;
    const newY = updates.y ?? el.y;
    const elW = updates.width ?? el.width ?? 100;
    const elH = updates.height ?? el.height ?? 50;
    const centerX = newX + elW / 2;
    const centerY = newY + elH / 2;
    let snapX = newX;
    let snapY = newY;

    // Snap to canvas center
    if (Math.abs(centerX - 800) < snapThreshold) { snapX = 800 - elW / 2; newLines.push({ orientation: 'vertical', position: 800 }); }
    if (Math.abs(centerY - 450) < snapThreshold) { snapY = 450 - elH / 2; newLines.push({ orientation: 'horizontal', position: 450 }); }

    // Snap to canvas edges
    if (Math.abs(newX) < snapThreshold) { snapX = 0; newLines.push({ orientation: 'vertical', position: 0 }); }
    if (Math.abs(newX + elW - 1600) < snapThreshold) { snapX = 1600 - elW; newLines.push({ orientation: 'vertical', position: 1600 }); }
    if (Math.abs(newY) < snapThreshold) { snapY = 0; newLines.push({ orientation: 'horizontal', position: 0 }); }
    if (Math.abs(newY + elH - 900) < snapThreshold) { snapY = 900 - elH; newLines.push({ orientation: 'horizontal', position: 900 }); }

    // Snap to other elements
    elements.forEach(other => {
      if (other.id === id) return;
      const otherW = other.width || 100;
      const otherH = other.height || 50;
      const otherCX = other.x + otherW / 2;
      const otherCY = other.y + otherH / 2;
      if (Math.abs(centerX - otherCX) < snapThreshold) { snapX = otherCX - elW / 2; newLines.push({ orientation: 'vertical', position: otherCX }); }
      if (Math.abs(centerY - otherCY) < snapThreshold) { snapY = otherCY - elH / 2; newLines.push({ orientation: 'horizontal', position: otherCY }); }
    });

    // Snap to guides
    guides.forEach(guide => {
      if (guide.orientation === 'vertical') {
        if (Math.abs(centerX - guide.position) < snapThreshold) { snapX = guide.position - elW / 2; newLines.push({ orientation: 'vertical', position: guide.position }); }
      } else {
        if (Math.abs(centerY - guide.position) < snapThreshold) { snapY = guide.position - elH / 2; newLines.push({ orientation: 'horizontal', position: guide.position }); }
      }
    });

    setSnapLines(newLines);
    const finalX = snapX;
    const finalY = snapY;
    const dx = finalX - el.x;
    const dy = finalY - el.y;

    if (dx === 0 && dy === 0) return;

    // Multi-select & Group dragging logic
    // 1. Collect all elements that should move
    const movingIds = new Set(selectedElementIds);

    // 2. Add group members for all moving elements
    movingIds.forEach(eid => {
      const group = getGroupForElement(eid);
      if (group) group.elementIds.forEach(id => movingIds.add(id));
    });

    // 3. Apply movement to all collected elements
    movingIds.forEach(eid => {
      if (eid === id) {
        updateElement(eid, { ...updates, x: finalX, y: finalY });
      } else {
        const otherEl = elements.find(e => e.id === eid);
        if (otherEl) {
          updateElement(eid, { x: otherEl.x + dx, y: otherEl.y + dy });
        }
      }
    });
  }, [updateElement, elements, guides, snapToGuides, snapThreshold, getGroupForElement, selectedElementIds]);

  const handleDragEnd = useCallback(() => {
    setSnapLines([]);
    saveState();
  }, [saveState]);

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);
  const backgroundStyle = getBackgroundStyle();
  const hasBlur = background.type === 'image' && background.blur > 0;

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
                  onUpdate={(updates) => handleElementUpdate(element.id, updates)}
                  onDragEnd={handleDragEnd}
                />
              ))}
            <SnapLines lines={snapLines} />
            {showGuides && <GuideLines guides={guides} />}
          </div>
        </div>
      </div>
      <div className="canvas-info">
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => setZoom(zoom - 0.1)} disabled={zoom <= 0.25} title="Thu nhỏ">−</button>
          <input
            type="range"
            className="zoom-slider"
            min="25"
            max="200"
            value={Math.round(zoom * 100)}
            onChange={(e) => setZoom(parseInt(e.target.value) / 100)}
          />
          <button className="zoom-btn" onClick={() => setZoom(zoom + 0.1)} disabled={zoom >= 2} title="Phóng to">+</button>
          <button className="zoom-btn zoom-btn--fit" onClick={() => setZoom(1)} title="Vừa màn hình">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>
            </svg>
          </button>
          <select
            className="zoom-preset"
            value={Math.round(zoom * 100)}
            onChange={(e) => { if (e.target.value) setZoom(parseInt(e.target.value) / 100); }}
          >
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
