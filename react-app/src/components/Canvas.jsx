import { useRef, useState, useEffect, useLayoutEffect, useCallback } from 'react';
import useEditorStore from '../store/editorStore';

function DeviceFrame({ type, scale, shadow, screenshot }) {
  const baseWidth = 1200 * (scale / 100);
  const baseHeight = 720 * (scale / 100);
  const shadowStyle = { boxShadow: `0 ${shadow / 2}px ${shadow}px rgba(0,0,0,${shadow / 100})` };

  const placeholder = (
    <div style={{
      width: '100%',
      height: '100%',
      background: '#f6f6f7',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      color: '#637381',
      fontSize: '14px'
    }}>
      Tải ảnh chụp màn hình
    </div>
  );

  if (type === 'none') {
    if (!screenshot) return null;
    return (
      <img
        src={screenshot}
        alt="Screenshot"
        className="device-frame"
        style={{
          maxWidth: `${scale}%`,
          maxHeight: `${scale}%`,
          objectFit: 'contain',
          borderRadius: '8px',
          ...shadowStyle
        }}
      />
    );
  }

  if (type === 'browser') {
    return (
      <div className="device-frame device-frame--browser" style={shadowStyle}>
        <div className="browser-bar">
          <div className="browser-dots">
            <span className="browser-dot browser-dot--red"></span>
            <span className="browser-dot browser-dot--yellow"></span>
            <span className="browser-dot browser-dot--green"></span>
          </div>
          <div className="browser-address">shopify.com/admin</div>
        </div>
        <div className="browser-content" style={{ width: baseWidth, height: baseHeight }}>
          {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
        </div>
      </div>
    );
  }

  if (type === 'laptop') {
    return (
      <div className="device-frame device-frame--laptop" style={shadowStyle}>
        <div className="laptop-screen" style={{ width: baseWidth, height: baseHeight }}>
          {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
        </div>
        <div className="laptop-base">
          <div className="laptop-notch"></div>
        </div>
      </div>
    );
  }

  if (type === 'desktop') {
    return (
      <div className="device-frame device-frame--desktop" style={shadowStyle}>
        <div className="monitor-bezel">
          <div className="monitor-screen" style={{ width: baseWidth, height: baseHeight }}>
            {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
          </div>
        </div>
        <div className="monitor-stand"></div>
        <div className="monitor-base"></div>
      </div>
    );
  }

  if (type === 'iphone') {
    const phoneWidth = 280 * (scale / 100);
    const phoneHeight = 606 * (scale / 100);
    return (
      <div className="device-frame device-frame--iphone" style={shadowStyle}>
        <div className="iphone-notch"></div>
        <div className="iphone-screen" style={{ width: phoneWidth, height: phoneHeight }}>
          {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
        </div>
        <div className="iphone-home-indicator"></div>
      </div>
    );
  }

  if (type === 'android') {
    const phoneWidth = 280 * (scale / 100);
    const phoneHeight = 560 * (scale / 100);
    return (
      <div className="device-frame device-frame--android" style={shadowStyle}>
        <div className="android-camera"></div>
        <div className="android-screen" style={{ width: phoneWidth, height: phoneHeight }}>
          {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
        </div>
      </div>
    );
  }

  if (type === 'ipad') {
    const tabletWidth = 600 * (scale / 100);
    const tabletHeight = 450 * (scale / 100);
    return (
      <div className="device-frame device-frame--ipad" style={shadowStyle}>
        <div className="ipad-camera"></div>
        <div className="ipad-screen" style={{ width: tabletWidth, height: tabletHeight }}>
          {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
        </div>
        <div className="ipad-home-indicator"></div>
      </div>
    );
  }

  if (type === 'tablet') {
    const tabletWidth = 580 * (scale / 100);
    const tabletHeight = 420 * (scale / 100);
    return (
      <div className="device-frame device-frame--tablet" style={shadowStyle}>
        <div className="tablet-camera"></div>
        <div className="tablet-screen" style={{ width: tabletWidth, height: tabletHeight }}>
          {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
        </div>
      </div>
    );
  }

  return null;
}

// Resize handles component
function ResizeHandles({ element, zoom, onResize }) {
  const handles = ['nw', 'n', 'ne', 'e', 'se', 's', 'sw', 'w'];
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

// Rotation handle component
function RotationHandle({ element, zoom, onRotate }) {
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

// Snap lines component
function SnapLines({ lines }) {
  if (!lines || lines.length === 0) return null;
  return lines.map((line, i) => (
    <div
      key={i}
      className="snap-line"
      style={line.orientation === 'vertical'
        ? { left: line.position, top: 0, width: 1, height: '100%' }
        : { top: line.position, left: 0, height: 1, width: '100%' }
      }
    />
  ));
}

// Guide lines component
function GuideLines({ guides }) {
  const { removeGuide } = useEditorStore();
  return guides.map((guide) => (
    <div
      key={guide.id}
      className={`guide-line guide-line--${guide.orientation}`}
      style={guide.orientation === 'vertical'
        ? { left: guide.position, top: 0, width: 1, height: '100%' }
        : { top: guide.position, left: 0, height: 1, width: '100%' }
      }
      onDoubleClick={() => removeGuide(guide.id)}
      title="Double-click để xóa guide"
    />
  ));
}

// Ruler component
function Rulers({ zoom }) {
  const rulerSize = 20;
  const canvasWidth = 1600;
  const canvasHeight = 900;

  const renderTicks = (length, orientation) => {
    const ticks = [];
    const step = 50;
    for (let i = 0; i <= length; i += step) {
      const isMajor = i % 100 === 0;
      ticks.push(
        <div
          key={i}
          className={`ruler-tick ${isMajor ? 'ruler-tick--major' : ''}`}
          style={orientation === 'horizontal'
            ? { left: i * zoom, height: isMajor ? rulerSize : rulerSize / 2 }
            : { top: i * zoom, width: isMajor ? rulerSize : rulerSize / 2 }
          }
        >
          {isMajor && <span className="ruler-label">{i}</span>}
        </div>
      );
    }
    return ticks;
  };

  const { addGuide } = useEditorStore();

  return (
    <>
      <div
        className="ruler ruler-horizontal"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientX - rect.left) / zoom;
          addGuide('vertical', Math.round(pos));
        }}
      >
        {renderTicks(canvasWidth, 'horizontal')}
      </div>
      <div
        className="ruler ruler-vertical"
        onClick={(e) => {
          const rect = e.currentTarget.getBoundingClientRect();
          const pos = (e.clientY - rect.top) / zoom;
          addGuide('horizontal', Math.round(pos));
        }}
      >
        {renderTicks(canvasHeight, 'vertical')}
      </div>
      <div className="ruler-corner" />
    </>
  );
}


function DraggableText({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  useLayoutEffect(() => {
    if (ref.current && document.activeElement !== ref.current) {
      ref.current.textContent = element.content;
    }
  }, [element.content]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotation-handle') || e.target.closest('.rotation-handle')) return;
    if (document.activeElement === ref.current) return;
    e.preventDefault();
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: element.x, y: element.y };
    onSelect();
  }, [element.x, element.y, onSelect]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      hasDragged.current = true;

      const dx = (e.clientX - startPos.current.x) / zoom;
      const dy = (e.clientY - startPos.current.y) / zoom;

      const newX = Math.max(0, Math.min(1600 - 100, initialPos.current.x + dx));
      const newY = Math.max(0, Math.min(900 - 30, initialPos.current.y + dy));

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

  const textStyle = {
    left: element.x,
    top: element.y,
    fontFamily: `'${element.font}', sans-serif`,
    fontSize: element.size,
    color: element.color,
    fontWeight: element.weight,
    textAlign: element.textAlign || 'center',
    letterSpacing: element.letterSpacing ? `${element.letterSpacing}px` : '0',
    transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
  };

  if (element.shadow?.enabled) {
    textStyle.textShadow = `${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}`;
  }

  if (element.outline?.enabled) {
    textStyle.WebkitTextStroke = `${element.outline.width}px ${element.outline.color}`;
  }

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-text ${isSelected ? 'selected' : ''}`}
      style={textStyle}
      onMouseDown={handleMouseDown}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      contentEditable
      suppressContentEditableWarning
      onInput={(e) => onUpdate({ content: e.currentTarget.textContent })}
      onBlur={() => onDragEnd?.()}
    >
      {isSelected && (
        <RotationHandle
          element={element}
          zoom={zoom}
          onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }}
        />
      )}
    </div>
  );
}

function DraggableShape({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotation-handle') || e.target.closest('.rotation-handle')) return;
    e.preventDefault();
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: element.x, y: element.y };
    onSelect();
  }, [element.x, element.y, onSelect]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      hasDragged.current = true;
      const dx = (e.clientX - startPos.current.x) / zoom;
      const dy = (e.clientY - startPos.current.y) / zoom;
      const newX = Math.max(0, Math.min(1600 - element.width, initialPos.current.x + dx));
      const newY = Math.max(0, Math.min(900 - element.height, initialPos.current.y + dy));
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
  }, [zoom, onUpdate, onDragEnd, element.width, element.height]);

  const getFillStyle = () => {
    if (element.fillType === 'gradient') {
      return `linear-gradient(${element.fillGradientAngle}deg, ${element.fillGradientStart}, ${element.fillGradientEnd})`;
    }
    return element.fill;
  };

  const renderShape = () => {
    const baseStyle = {
      width: element.width,
      height: element.height,
      border: element.strokeWidth ? `${element.strokeWidth}px solid ${element.stroke}` : 'none',
      opacity: element.opacity,
    };

    if (element.fillType === 'gradient') {
      baseStyle.background = getFillStyle();
    } else {
      baseStyle.backgroundColor = element.fill;
    }

    switch (element.shapeType) {
      case 'rectangle':
        return <div style={{ ...baseStyle, borderRadius: element.borderRadius }} />;
      case 'circle':
        return <div style={{ ...baseStyle, borderRadius: '50%' }} />;
      case 'arrow':
        return (
          <svg width={element.width} height={element.height} viewBox={`0 0 ${element.width} ${element.height}`}>
            <defs>
              <marker id={`arrowhead-${element.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
                <polygon points="0 0, 10 3.5, 0 7" fill={element.fill} />
              </marker>
            </defs>
            <line
              x1="0"
              y1={element.height / 2}
              x2={element.width - 10}
              y2={element.height / 2}
              stroke={element.fill}
              strokeWidth="3"
              markerEnd={`url(#arrowhead-${element.id})`}
            />
          </svg>
        );
      case 'badge':
        return (
          <div style={{
            ...baseStyle,
            borderRadius: '50%',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: '#FFFFFF',
            fontWeight: '700',
            fontSize: element.width * 0.5,
          }}>
            {element.text}
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-shape ${isSelected ? 'selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {renderShape()}
      {isSelected && (
        <>
          <ResizeHandles element={element} zoom={zoom} onResize={(updates) => { onUpdate(updates); onDragEnd?.(); }} />
          <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
        </>
      )}
    </div>
  );
}

function DraggableImage({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotation-handle') || e.target.closest('.rotation-handle')) return;
    e.preventDefault();
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: element.x, y: element.y };
    onSelect();
  }, [element.x, element.y, onSelect]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      hasDragged.current = true;
      const dx = (e.clientX - startPos.current.x) / zoom;
      const dy = (e.clientY - startPos.current.y) / zoom;
      const newX = Math.max(0, Math.min(1600 - element.width, initialPos.current.x + dx));
      const newY = Math.max(0, Math.min(900 - element.height, initialPos.current.y + dy));
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
  }, [zoom, onUpdate, onDragEnd, element.width, element.height]);

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-image ${isSelected ? 'selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <img
        src={element.src}
        alt="Overlay"
        style={{
          width: element.width,
          height: element.height,
          objectFit: 'contain',
          opacity: element.opacity,
        }}
        draggable={false}
      />
      {isSelected && (
        <>
          <ResizeHandles element={element} zoom={zoom} onResize={(updates) => { onUpdate(updates); onDragEnd?.(); }} />
          <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
        </>
      )}
    </div>
  );
}

function DraggableAnnotation({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotation-handle') || e.target.closest('.rotation-handle')) return;
    e.preventDefault();
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: element.x, y: element.y };
    onSelect();
  }, [element.x, element.y, onSelect]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      hasDragged.current = true;
      const dx = (e.clientX - startPos.current.x) / zoom;
      const dy = (e.clientY - startPos.current.y) / zoom;
      const size = element.size || element.width || 100;
      const newX = Math.max(0, Math.min(1600 - size, initialPos.current.x + dx));
      const newY = Math.max(0, Math.min(900 - size, initialPos.current.y + dy));
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
  }, [zoom, onUpdate, onDragEnd, element.size, element.width]);

  const renderAnnotation = () => {
    switch (element.annotationType) {
      case 'callout':
        return (
          <div className="annotation-callout" style={{ opacity: element.opacity }}>
            <div
              className="callout-body"
              style={{
                width: element.width,
                minHeight: element.height,
                background: element.fill,
                color: element.textColor,
              }}
            >
              {element.text}
            </div>
            <div className="callout-pointer" style={{ borderTopColor: element.fill }} />
          </div>
        );
      case 'numbered-circle':
        return (
          <div
            className="annotation-number"
            style={{
              width: element.size,
              height: element.size,
              background: element.fill,
              color: element.textColor,
              opacity: element.opacity,
            }}
          >
            {element.number}
          </div>
        );
      case 'highlight':
        return (
          <div
            className="annotation-highlight"
            style={{
              width: element.width,
              height: element.height,
              background: `${element.fill}40`,
              border: `2px solid ${element.fill}`,
              opacity: element.opacity,
            }}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-annotation ${isSelected ? 'selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      {renderAnnotation()}
      {isSelected && (
        <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
      )}
    </div>
  );
}

function DraggableIcon({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains('resize-handle') || e.target.classList.contains('rotation-handle') || e.target.closest('.rotation-handle')) return;
    e.preventDefault();
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: element.x, y: element.y };
    onSelect();
  }, [element.x, element.y, onSelect]);

  useEffect(() => {
    const handleMouseMove = (e) => {
      if (!isDragging.current) return;
      hasDragged.current = true;
      const dx = (e.clientX - startPos.current.x) / zoom;
      const dy = (e.clientY - startPos.current.y) / zoom;
      const newX = Math.max(0, Math.min(1600 - element.width, initialPos.current.x + dx));
      const newY = Math.max(0, Math.min(900 - element.height, initialPos.current.y + dy));
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
  }, [zoom, onUpdate, onDragEnd, element.width, element.height]);

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-icon ${isSelected ? 'selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <div
        style={{
          width: element.width,
          height: element.height,
          color: element.color,
          opacity: element.opacity,
        }}
        dangerouslySetInnerHTML={{ __html: element.svg }}
      />
      {isSelected && (
        <>
          <ResizeHandles element={element} zoom={zoom} onResize={(updates) => { onUpdate(updates); onDragEnd?.(); }} />
          <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
        </>
      )}
    </div>
  );
}

function DraggableDeviceFrame({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd, screenshot }) {
  const ref = useRef(null);
  const isDragging = useRef(false);
  const hasDragged = useRef(false);
  const startPos = useRef({ x: 0, y: 0 });
  const initialPos = useRef({ x: 0, y: 0 });

  // Calculate dimensions for dragging bounds (approximate based on scale)
  const getDimensions = () => {
    const scale = element.scale || 85;
    let w = 1200, h = 720; // Default browser/laptop
    if (element.deviceType === 'desktop') { w = 1200; h = 800; } // Adjust for stand
    if (element.deviceType === 'iphone') { w = 280; h = 606; }
    if (element.deviceType === 'android') { w = 280; h = 560; }
    if (element.deviceType === 'ipad') { w = 600; h = 450; }
    if (element.deviceType === 'tablet') { w = 580; h = 420; }

    return {
      width: w * (scale / 100),
      height: h * (scale / 100)
    };
  };

  const { width, height } = getDimensions();

  const handleMouseDown = useCallback((e) => {
    if (e.target.classList.contains('rotation-handle') || e.target.closest('.rotation-handle')) return;
    e.preventDefault();
    isDragging.current = true;
    hasDragged.current = false;
    startPos.current = { x: e.clientX, y: e.clientY };
    initialPos.current = { x: element.x, y: element.y };
    onSelect();
  }, [element.x, element.y, onSelect]);

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

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-device ${isSelected ? 'selected' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: width,
        height: height,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
      onClick={(e) => { e.stopPropagation(); onSelect(); }}
    >
      <DeviceFrame
        type={element.deviceType}
        scale={element.scale}
        shadow={element.shadow}
        screenshot={element.screenshot}
      />
      {isSelected && (
        <RotationHandle
          element={{ ...element, width, height }} // Pass calculated dimensions to rotation handle
          zoom={zoom}
          onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }}
        />
      )}
    </div>
  );
}


export default function Canvas() {
  const {
    zoom,
    setZoom,
    background,
    getBackgroundStyle,

    screenshot,
    elements,
    selectedElementId,
    selectElement,
    updateElement,
    deselectElement,
    saveState,
    showRulers,
    showGuides,
    guides,
    snapToGuides,
    snapThreshold,
  } = useEditorStore();

  const canvasRef = useRef(null);
  const containerRef = useRef(null);
  const [snapLines, setSnapLines] = useState([]);

  // Force zoom to 100% for fixed canvas size
  useEffect(() => {
    console.log('Canvas mounted, setting zoom to 100%');
    setZoom(1);
  }, [setZoom]);

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
    if (Math.abs(centerX - 800) < snapThreshold) {
      snapX = 800 - elW / 2;
      newLines.push({ orientation: 'vertical', position: 800 });
    }
    if (Math.abs(centerY - 450) < snapThreshold) {
      snapY = 450 - elH / 2;
      newLines.push({ orientation: 'horizontal', position: 450 });
    }

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

      if (Math.abs(centerX - otherCX) < snapThreshold) {
        snapX = otherCX - elW / 2;
        newLines.push({ orientation: 'vertical', position: otherCX });
      }
      if (Math.abs(centerY - otherCY) < snapThreshold) {
        snapY = otherCY - elH / 2;
        newLines.push({ orientation: 'horizontal', position: otherCY });
      }
    });

    // Snap to guides
    guides.forEach(guide => {
      if (guide.orientation === 'vertical') {
        if (Math.abs(centerX - guide.position) < snapThreshold) {
          snapX = guide.position - elW / 2;
          newLines.push({ orientation: 'vertical', position: guide.position });
        }
      } else {
        if (Math.abs(centerY - guide.position) < snapThreshold) {
          snapY = guide.position - elH / 2;
          newLines.push({ orientation: 'horizontal', position: guide.position });
        }
      }
    });

    setSnapLines(newLines);
    updateElement(id, { ...updates, x: snapX, y: snapY });
  }, [updateElement, elements, guides, snapToGuides, snapThreshold]);

  const handleDragEnd = useCallback(() => {
    setSnapLines([]);
    saveState();
  }, [saveState]);

  const sortedElements = [...elements].sort((a, b) => a.zIndex - b.zIndex);

  const renderElement = (element) => {
    const isSelected = element.id === selectedElementId;
    const commonProps = {
      key: element.id,
      element,
      isSelected,
      zoom,
      onSelect: () => selectElement(element.id),
      onUpdate: (updates) => handleElementUpdate(element.id, updates),
      onDragEnd: handleDragEnd,
    };

    switch (element.type) {
      case 'text':
        return <DraggableText {...commonProps} />;
      case 'shape':
        return <DraggableShape {...commonProps} />;
      case 'image':
        return <DraggableImage {...commonProps} />;
      case 'annotation':
        return <DraggableAnnotation {...commonProps} />;
      case 'icon':
        return <DraggableIcon {...commonProps} />;
      case 'device':
        return <DraggableDeviceFrame {...commonProps} screenshot={screenshot} />;
      default:
        return null;
    }
  };

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
            marginLeft: showRulers ? 20 : 0,
            marginTop: showRulers ? 20 : 0,
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


            {sortedElements.map(renderElement)}

            <SnapLines lines={snapLines} />
            {showGuides && <GuideLines guides={guides} />}
          </div>
        </div>
      </div>
      <div className="canvas-info">
        <span>{Math.round(zoom * 100)}%</span>
        <div className="zoom-controls">
          <button className="zoom-btn" onClick={() => setZoom(zoom - 0.1)}>−</button>
          <button className="zoom-btn" onClick={() => setZoom(1)}>Fit</button>
          <button className="zoom-btn" onClick={() => setZoom(zoom + 0.1)}>+</button>
        </div>
      </div>
    </main>
  );
}
