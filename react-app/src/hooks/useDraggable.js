import { useRef, useEffect, useCallback } from 'react';

export default function useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd, onClick, canDrag }) {
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
    const DRAG_THRESHOLD = 4;

    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      const dx = e.clientX - startPos.current.x;
      const dy = e.clientY - startPos.current.y;
      if (!hasDragged.current) {
        if (Math.abs(dx) < DRAG_THRESHOLD && Math.abs(dy) < DRAG_THRESHOLD) return;
        hasDragged.current = true;
        ref.current?.classList.add('dragging');
      }
      const newX = Math.round(initialPos.current.x + dx / zoom);
      const newY = Math.round(initialPos.current.y + dy / zoom);
      onUpdate({ x: newX, y: newY });
    };

    const handleMouseUp = () => {
      if (hasDragged.current) {
        ref.current?.classList.remove('dragging');
        hasDragged.current = false;
        onDragEnd?.();
      } else if (isDragging.current) {
        // Click without drag - notify parent
        onClick?.();
      }
      isDragging.current = false;
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [zoom, onUpdate, onDragEnd, onClick]);

  return { ref, handleMouseDown };
}
