import { useRef, useEffect, useCallback } from 'react';

export default function useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd, canDrag }) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotation-handle') || e.target.closest('.rotation-handle')) return;
    if (element.locked) return;
    if (canDrag && !canDrag(e)) return;
    e.preventDefault();
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: element.x, y: element.y };
    onSelect(e);
  }, [element.x, element.y, element.locked, onSelect, canDrag]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      hasDragged.current = true;
      const dx = (e.clientX - startPos.current.x) / zoom;
      const dy = (e.clientY - startPos.current.y) / zoom;
      const newX = Math.round(initialPos.current.x + dx);
      const newY = Math.round(initialPos.current.y + dy);
      onUpdate({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (hasDragged.current) {
        hasDragged.current = false;
        onDragEnd?.();
      }
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom, onUpdate, onDragEnd]);

  return { ref, handleMouseDown };
}
