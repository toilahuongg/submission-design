import { useCallback } from 'react';

export default function RotationHandle({ element, zoom, onRotate }) {
  const handleMouseDown = useCallback((e) => {
    e.stopPropagation();
    e.preventDefault();

    const elWidth = element.width || 100;
    const elHeight = element.height || (element.size || 50);
    const centerX = element.x + elWidth / 2;
    const centerY = element.y + elHeight / 2;

    const handleMouseMove = (moveE) => {
      const canvasEl = document.getElementById('canvas');
      if (!canvasEl) return;
      const rect = canvasEl.getBoundingClientRect();
      const mouseX = (moveE.clientX - rect.left) / zoom;
      const mouseY = (moveE.clientY - rect.top) / zoom;
      const angle = Math.atan2(mouseY - centerY, mouseX - centerX) * (180 / Math.PI) + 90;
      const snapped = moveE.shiftKey ? Math.round(angle / 15) * 15 : Math.round(angle);
      onRotate(((snapped % 360) + 360) % 360);
    };

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };

    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
  }, [element, zoom, onRotate]);

  const elWidth = element.width || 100;

  return (
    <div
      className="rotation-handle"
      style={{ left: elWidth / 2 - 6, top: -30 }}
      onMouseDown={handleMouseDown}
      title="Xoay"
    >
      <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
        <path d="M21 2v6h-6M3 12a9 9 0 0 1 15-6.7L21 8" />
      </svg>
    </div>
  );
}
