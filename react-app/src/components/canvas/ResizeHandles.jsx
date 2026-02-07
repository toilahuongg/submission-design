import { useRef, useCallback } from 'react';

export default function ResizeHandles({ element, zoom, onResize, restrictHandles }) {
  const allHandles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
  const handles = restrictHandles ? allHandles.filter(h => restrictHandles.includes(h)) : allHandles;
  const isResizing = useRef(false);
  const startData = useRef(null);

  const handleMouseDown = useCallback((e, handle) => {
    e.stopPropagation();
    e.preventDefault();
    isResizing.current = true;
    startData.current = {
      handle,
      startX: e.clientX,
      startY: e.clientY,
      origWidth: element.width || 100,
      origHeight: element.height || 50,
      origX: element.x,
      origY: element.y
    };

    const handleMouseMove = (e) => {
      if (!isResizing.current || !startData.current) return;
      const { handle: h, startX, startY, origWidth, origHeight, origX, origY } = startData.current;
      const dx = (e.clientX - startX) / zoom;
      const dy = (e.clientY - startY) / zoom;

      let newWidth = origWidth;
      let newHeight = origHeight;
      let newX = origX;
      let newY = origY;

      if (h.includes('e')) newWidth = Math.max(20, origWidth + dx);
      if (h.includes('w')) { newWidth = Math.max(20, origWidth - dx); newX = origX + (origWidth - newWidth); }
      if (h.includes('s')) newHeight = Math.max(20, origHeight + dy);
      if (h.includes('n')) { newHeight = Math.max(20, origHeight - dy); newY = origY + (origHeight - newHeight); }

      if (e.shiftKey) {
        const ratio = origWidth / origHeight;
        if (h === 'e' || h === 'w') newHeight = newWidth / ratio;
        else if (h === 'n' || h === 's') newWidth = newHeight * ratio;
        else {
          newHeight = newWidth / ratio;
        }
      }

      onResize({ width: Math.round(newWidth), height: Math.round(newHeight), x: Math.round(newX), y: Math.round(newY) });
    };

    const handleMouseUp = () => {
      isResizing.current = false;
      startData.current = null;
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, zoom, onResize]);

  const elWidth = element.width || 100;
  const elHeight = element.height || (element.size || 50);

  const positions = {
    nw: { left: -4, top: -4, cursor: 'nw-resize' },
    n: { left: elWidth / 2 - 4, top: -4, cursor: 'n-resize' },
    ne: { left: elWidth - 4, top: -4, cursor: 'ne-resize' },
    e: { left: elWidth - 4, top: elHeight / 2 - 4, cursor: 'e-resize' },
    se: { left: elWidth - 4, top: elHeight - 4, cursor: 'se-resize' },
    s: { left: elWidth / 2 - 4, top: elHeight - 4, cursor: 's-resize' },
    sw: { left: -4, top: elHeight - 4, cursor: 'sw-resize' },
    w: { left: -4, top: elHeight / 2 - 4, cursor: 'w-resize' },
  };

  return handles.map(h => (
    <div
      key={h}
      className="resize-handle"
      style={{ ...positions[h] }}
      onMouseDown={(e) => handleMouseDown(e, h)}
    />
  ));
}
