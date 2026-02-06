import { useRef, useLayoutEffect } from 'react';
import useDraggable from '../../hooks/useDraggable';
import DeviceFrame from './DeviceFrame';
import ResizeHandles from './ResizeHandles';
import RotationHandle from './RotationHandle';

function DraggableText({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const textRef = useRef(null);
  const { ref, handleMouseDown } = useDraggable({
    element,
    zoom,
    onUpdate,
    onSelect,
    onDragEnd,
    canDrag: () => document.activeElement !== textRef.current,
  });

  useLayoutEffect(() => {
    if (textRef.current && document.activeElement !== textRef.current) {
      textRef.current.textContent = element.content;
    }
  }, [element.content]);

  const textStyle = {
    left: element.x,
    top: element.y,
    fontFamily: `'${element.font}', sans-serif`,
    fontSize: element.size,
    color: element.color,
    fontWeight: element.weight,
    fontStyle: element.italic ? 'italic' : 'normal',
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
      ref={(node) => { ref.current = node; textRef.current = node; }}
      className={`canvas-element canvas-text ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={textStyle}
      onMouseDown={handleMouseDown}
      contentEditable={!element.locked}
      suppressContentEditableWarning
      onInput={(e) => onUpdate({ content: e.currentTarget.textContent })}
      onBlur={() => onDragEnd?.()}
    >
      {isSelected && !element.locked && (
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
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd });

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
      case 'arrow': {
        const { arrowStyle, arrowHead, arrowHeadStyle, curvature, fill, strokeWidth } = element;
        const w = element.width;
        const h = element.height;
        const midY = h / 2;

        // Define arrow head markers
        const renderMarkers = () => (
          <defs>
            {/* Classic Triangle */}
            <marker id={`arrowhead-classic-${element.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <polygon points="0 0, 10 3.5, 0 7" fill={fill} />
            </marker>
            {/* Stealth */}
            <marker id={`arrowhead-stealth-${element.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
              <path d="M0 0 L10 3.5 L0 7 L3 3.5 Z" fill={fill} />
            </marker>
            {/* Open */}
            <marker id={`arrowhead-open-${element.id}`} markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
              <path d="M1 1 L9 5 L1 9" fill="none" stroke={fill} strokeWidth="2" strokeLinecap="round" />
            </marker>
            {/* Circle */}
            <marker id={`arrowhead-circle-${element.id}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
              <circle cx="4" cy="4" r="3" fill={fill} />
            </marker>
            {/* Diamond */}
            <marker id={`arrowhead-diamond-${element.id}`} markerWidth="12" markerHeight="8" refX="6" refY="4" orient="auto">
              <path d="M0 4 L6 0 L12 4 L6 8 Z" fill={fill} />
            </marker>
          </defs>
        );

        const markerId = `url(#arrowhead-${arrowHeadStyle || 'classic'}-${element.id})`;
        const dashArray = arrowStyle === 'dashed' ? '8 4' : arrowStyle === 'dotted' ? '2 3' : 'none';

        let pathData = `M 10 ${midY} L ${w - 10} ${midY}`;
        if (arrowStyle === 'curved') {
          const curveOffset = (curvature || 0) * (h / 2);
          pathData = `M 10 ${midY} Q ${w / 2} ${midY - curveOffset} ${w - 10} ${midY}`;
        }

        return (
          <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
            {renderMarkers()}
            <path
              d={pathData}
              fill="none"
              stroke={fill}
              strokeWidth={Math.max(2, strokeWidth)}
              strokeDasharray={dashArray}
              markerStart={arrowHead === 'both' || arrowHead === 'start' ? markerId : undefined}
              markerEnd={arrowHead === 'both' || arrowHead === 'end' ? markerId : undefined}
              style={{ transition: 'all 0.2s ease' }}
            />
          </svg>
        );
      }
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
      className={`canvas-element canvas-shape ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderShape()}
      {isSelected && !element.locked && (
        <>
          <ResizeHandles element={element} zoom={zoom} onResize={(updates) => { onUpdate(updates); onDragEnd?.(); }} />
          <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
        </>
      )}
    </div>
  );
}

function DraggableImage({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd });

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-image ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
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
      {isSelected && !element.locked && (
        <>
          <ResizeHandles element={element} zoom={zoom} onResize={(updates) => { onUpdate(updates); onDragEnd?.(); }} />
          <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
        </>
      )}
    </div>
  );
}

function DraggableAnnotation({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd });

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
      className={`canvas-element canvas-annotation ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
    >
      {renderAnnotation()}
      {isSelected && !element.locked && (
        <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
      )}
    </div>
  );
}

function DraggableIcon({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd });

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-icon ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
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
      {isSelected && !element.locked && (
        <>
          <ResizeHandles element={element} zoom={zoom} onResize={(updates) => { onUpdate(updates); onDragEnd?.(); }} />
          <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
        </>
      )}
    </div>
  );
}

function DraggableDeviceFrame({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd });

  const getDimensions = () => {
    const scale = element.scale || 85;
    let w = 1200, h = 720;
    if (element.deviceType === 'browser') { w = 1200; h = 760; }
    if (element.deviceType === 'desktop') { w = 1232; h = 900; }
    if (element.deviceType === 'laptop') { w = 1224; h = 750; }
    if (element.deviceType === 'iphone') { w = 304; h = 624; }
    if (element.deviceType === 'android') { w = 302; h = 600; }
    if (element.deviceType === 'ipad') { w = 624; h = 474; }
    if (element.deviceType === 'tablet') { w = 604; h = 444; }
    return { width: w * (scale / 100), height: h * (scale / 100) };
  };

  const { width, height } = getDimensions();

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-device ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        width: width,
        height: height,
        transform: element.rotation ? `rotate(${element.rotation}deg)` : undefined,
      }}
      onMouseDown={handleMouseDown}
    >
      <DeviceFrame
        type={element.deviceType}
        scale={element.scale}
        shadow={element.shadow}
        screenshot={element.screenshot}
      />
      {isSelected && !element.locked && (
        <RotationHandle
          element={{ ...element, width, height }}
          zoom={zoom}
          onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }}
        />
      )}
    </div>
  );
}

export default function DraggableElement({ element, isSelected, zoom, onSelect, onUpdate, onDragEnd }) {
  const commonProps = { element, isSelected, zoom, onSelect, onUpdate, onDragEnd };

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
      return <DraggableDeviceFrame {...commonProps} />;
    default:
      return null;
  }
}
