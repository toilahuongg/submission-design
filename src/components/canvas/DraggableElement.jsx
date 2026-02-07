import { useRef, useLayoutEffect, memo } from 'react';
import useDraggable from '../../hooks/useDraggable';
import DeviceFrame from './DeviceFrame';
import ResizeHandles from './ResizeHandles';
import RotationHandle from './RotationHandle';
import * as LucideIcons from 'lucide-react';
import { getShapeSVGContent, getStrokeDasharray, angleToGradientCoords } from '../../utils/shapePaths';

// Build 3D transform string from rotation properties
function build3DTransform(element) {
  const rotateZ = element.rotateZ ?? element.rotation ?? 0;
  const rotateX = element.rotateX ?? 0;
  const rotateY = element.rotateY ?? 0;

  // Only apply 3D transforms if there's any rotation
  if (rotateZ === 0 && rotateX === 0 && rotateY === 0) {
    return undefined;
  }

  const transforms = [];

  // Add perspective for 3D effect when X or Y rotation is used
  if (rotateX !== 0 || rotateY !== 0) {
    transforms.push('perspective(1000px)');
  }

  if (rotateX !== 0) transforms.push(`rotateX(${rotateX}deg)`);
  if (rotateY !== 0) transforms.push(`rotateY(${rotateY}deg)`);
  if (rotateZ !== 0) transforms.push(`rotateZ(${rotateZ}deg)`);

  return transforms.join(' ');
}

function DraggableText({ element, isSelected, zoom, onSelect, onClick, onUpdate, onDragEnd }) {
  const textRef = useRef(null);
  const { ref, handleMouseDown } = useDraggable({
    element,
    zoom,
    onUpdate,
    onSelect,
    onDragEnd,
    onClick,
    canDrag: () => document.activeElement !== textRef.current,
  });

  useLayoutEffect(() => {
    if (textRef.current && document.activeElement !== textRef.current) {
      textRef.current.innerText = element.content;
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
    lineHeight: element.lineHeight || 1.5,
    opacity: element.opacity ?? 1,
    whiteSpace: 'pre-wrap',
    transform: build3DTransform(element),
    textDecoration: element.textDecoration || 'none',
    textTransform: element.textTransform || 'none',
    wordSpacing: element.wordSpacing ? `${element.wordSpacing}px` : '0',
  };

  if (element.maxWidth > 0) {
    textStyle.maxWidth = element.maxWidth;
    textStyle.wordWrap = 'break-word';
  }

  if (element.textBg?.enabled) {
    textStyle.backgroundColor = element.textBg.color;
    textStyle.padding = element.textBg.padding || 8;
    textStyle.borderRadius = 4;
  }

  // Build textShadow from shadow + glow
  const shadowParts = [];
  if (element.shadow?.enabled) {
    shadowParts.push(`${element.shadow.offsetX}px ${element.shadow.offsetY}px ${element.shadow.blur}px ${element.shadow.color}`);
  }
  if (element.glow?.enabled) {
    const { color, blur, intensity } = element.glow;
    for (let i = 0; i < intensity; i++) {
      shadowParts.push(`0 0 ${blur * (i + 1)}px ${color}`);
    }
  }
  if (shadowParts.length > 0) {
    textStyle.textShadow = shadowParts.join(', ');
  }

  if (element.outline?.enabled) {
    textStyle.WebkitTextStroke = `${element.outline.width}px ${element.outline.color}`;
  }

  if (element.gradient?.enabled) {
    textStyle.backgroundImage = `linear-gradient(${element.gradient.angle}deg, ${element.gradient.start}, ${element.gradient.end})`;
    textStyle.WebkitBackgroundClip = 'text';
    textStyle.WebkitTextFillColor = 'transparent';
    textStyle.backgroundClip = 'text';
  }

  // Separate the contentEditable text from RotationHandle to prevent
  // "removeChild" errors — the browser's editing engine can destroy
  // React-managed child nodes inside contentEditable elements.
  return (
    <div
      ref={ref}
      className={`canvas-element canvas-text ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''} ${element.gradient?.enabled ? 'has-gradient' : ''}`}
      style={textStyle}
      data-element-id={element.id}
      onMouseDown={handleMouseDown}
    >
      <div
        ref={textRef}
        contentEditable={!element.locked}
        suppressContentEditableWarning
        onInput={(e) => onUpdate({ content: e.currentTarget.innerText })}
        onBlur={() => onDragEnd?.()}
        style={{ outline: 'none', minHeight: '1em' }}
      />
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

function DraggableShape({ element, isSelected, zoom, onSelect, onClick, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd, onClick });

  const renderArrow = () => {
    const { arrowStyle, arrowHead, arrowHeadStyle, curvature, fill, strokeWidth } = element;
    const w = element.width;
    const h = element.height;
    const midY = h / 2;

    const markerId = `url(#arrowhead-${arrowHeadStyle || 'classic'}-${element.id})`;
    const dashArray = arrowStyle === 'dashed' ? '8 4' : arrowStyle === 'dotted' ? '2 3' : undefined;

    let pathData = `M 10 ${midY} L ${w - 10} ${midY}`;
    if (arrowStyle === 'curved') {
      const curveOffset = (curvature || 0) * (h / 2);
      pathData = `M 10 ${midY} Q ${w / 2} ${midY - curveOffset} ${w - 10} ${midY}`;
    }

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible' }}>
        <defs>
          <marker id={`arrowhead-classic-${element.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <polygon points="0 0, 10 3.5, 0 7" fill={fill} />
          </marker>
          <marker id={`arrowhead-stealth-${element.id}`} markerWidth="10" markerHeight="7" refX="9" refY="3.5" orient="auto">
            <path d="M0 0 L10 3.5 L0 7 L3 3.5 Z" fill={fill} />
          </marker>
          <marker id={`arrowhead-open-${element.id}`} markerWidth="10" markerHeight="10" refX="9" refY="5" orient="auto">
            <path d="M1 1 L9 5 L1 9" fill="none" stroke={fill} strokeWidth="2" strokeLinecap="round" />
          </marker>
          <marker id={`arrowhead-circle-${element.id}`} markerWidth="8" markerHeight="8" refX="4" refY="4" orient="auto">
            <circle cx="4" cy="4" r="3" fill={fill} />
          </marker>
          <marker id={`arrowhead-diamond-${element.id}`} markerWidth="12" markerHeight="8" refX="6" refY="4" orient="auto">
            <path d="M0 4 L6 0 L12 4 L6 8 Z" fill={fill} />
          </marker>
        </defs>
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
  };

  const renderShape = () => {
    if (element.shapeType === 'arrow') return renderArrow();

    const w = element.width || 100;
    const h = element.height || 100;
    const shapeContent = getShapeSVGContent(element.shapeType, w, h, element);
    if (!shapeContent) return null;

    const gradId = `grad-${element.id}`;
    const fillType = element.fillType || 'solid';
    const isLine = element.shapeType === 'line';

    // Determine fill
    let fillValue = element.fill;
    if (fillType === 'gradient') {
      fillValue = `url(#${gradId})`;
    }

    // Stroke dasharray
    const dasharray = getStrokeDasharray(element.strokeStyle, element.strokeWidth);

    // Build gradient def
    let gradientDef = null;
    if (fillType === 'gradient') {
      const gradType = element.fillGradientType || 'linear';
      if (gradType === 'radial') {
        gradientDef = (
          <radialGradient id={gradId} cx="50%" cy="50%" r="50%">
            <stop offset="0%" stopColor={element.fillGradientStart || '#5C6AC4'} />
            <stop offset="100%" stopColor={element.fillGradientEnd || '#202E78'} />
          </radialGradient>
        );
      } else {
        const coords = angleToGradientCoords(element.fillGradientAngle || 135);
        gradientDef = (
          <linearGradient id={gradId} x1={coords.x1} y1={coords.y1} x2={coords.x2} y2={coords.y2}>
            <stop offset="0%" stopColor={element.fillGradientStart || '#5C6AC4'} />
            <stop offset="100%" stopColor={element.fillGradientEnd || '#202E78'} />
          </linearGradient>
        );
      }
    }

    // Shape props
    const shapeProps = {
      ...shapeContent.attrs,
      fill: isLine ? 'none' : fillValue,
      stroke: isLine ? (element.fill || '#FFFFFF') : (element.strokeWidth ? element.stroke : 'none'),
      strokeWidth: isLine ? Math.max(element.strokeWidth || 2, element.height || 2) : (element.strokeWidth || 0),
      strokeDasharray: dasharray,
      opacity: element.opacity,
    };

    // Flip transform
    const flipH = element.flipH;
    const flipV = element.flipV;
    const hasFlip = flipH || flipV;
    const flipTransform = hasFlip
      ? `translate(${flipH ? w : 0},${flipV ? h : 0}) scale(${flipH ? -1 : 1},${flipV ? -1 : 1})`
      : undefined;

    // Text in shape
    const showText = element.shapeText && !isLine && element.shapeType !== 'arrow';
    const badgeText = element.shapeType === 'badge' ? element.text : null;

    const ShapeTag = shapeContent.tag;

    return (
      <svg width={w} height={h} viewBox={`0 0 ${w} ${h}`} style={{ overflow: 'visible', display: 'block' }}>
        {gradientDef && <defs>{gradientDef}</defs>}
        {hasFlip ? (
          <g transform={flipTransform}>
            <ShapeTag {...shapeProps} />
          </g>
        ) : (
          <ShapeTag {...shapeProps} />
        )}
        {badgeText && (
          <text
            x={w / 2}
            y={h / 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="#FFFFFF"
            fontWeight="700"
            fontSize={w * 0.5}
          >
            {badgeText}
          </text>
        )}
        {showText && (
          <foreignObject x="0" y="0" width={w} height={h}>
            <div
              xmlns="http://www.w3.org/1999/xhtml"
              style={{
                width: '100%',
                height: '100%',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: element.shapeTextColor || '#FFFFFF',
                fontSize: element.shapeTextSize || 16,
                fontWeight: '500',
                textAlign: 'center',
                padding: '4px',
                overflow: 'hidden',
                pointerEvents: 'none',
              }}
            >
              {element.shapeText}
            </div>
          </foreignObject>
        )}
      </svg>
    );
  };

  // Shadow style on container
  const shadow = element.shadow;
  const hasShadow = shadow?.enabled;
  const shadowFilter = hasShadow
    ? `drop-shadow(${shadow.offsetX || 0}px ${shadow.offsetY || 0}px ${shadow.blur || 10}px ${shadow.color || '#00000066'})`
    : undefined;

  const restrictHandles = element.shapeType === 'line' ? ['e', 'w'] : undefined;

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-shape ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: build3DTransform(element),
        filter: shadowFilter,
      }}
      data-element-id={element.id}
      onMouseDown={handleMouseDown}
    >
      {renderShape()}
      {isSelected && !element.locked && (
        <>
          <ResizeHandles element={element} zoom={zoom} onResize={(updates) => { onUpdate(updates); onDragEnd?.(); }} restrictHandles={restrictHandles} />
          <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
        </>
      )}
    </div>
  );
}

function DraggableImage({ element, isSelected, zoom, onSelect, onClick, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd, onClick });

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-image ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: build3DTransform(element),
      }}
      data-element-id={element.id}
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

function DraggableAnnotation({ element, isSelected, zoom, onSelect, onClick, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd, onClick });

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
        transform: build3DTransform(element),
      }}
      data-element-id={element.id}
      onMouseDown={handleMouseDown}
    >
      {renderAnnotation()}
      {isSelected && !element.locked && (
        <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
      )}
    </div>
  );
}

function DraggableIcon({ element, isSelected, zoom, onSelect, onClick, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd, onClick });

  // Get Lucide icon component if available
  const LucideIcon = element.lucideIcon ? LucideIcons[element.lucideIcon] : null;

  return (
    <div
      ref={ref}
      className={`canvas-element canvas-icon ${isSelected ? 'selected' : ''} ${element.locked ? 'locked' : ''}`}
      style={{
        left: element.x,
        top: element.y,
        transform: build3DTransform(element),
      }}
      data-element-id={element.id}
      onMouseDown={handleMouseDown}
    >
      <div
        style={{
          width: element.width,
          height: element.height,
          color: element.color,
          opacity: element.opacity,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        {LucideIcon ? (
          <LucideIcon size={Math.min(element.width, element.height)} strokeWidth={2} />
        ) : element.svg ? (
          <div dangerouslySetInnerHTML={{ __html: element.svg }} style={{ width: '100%', height: '100%' }} />
        ) : null}
      </div>
      {isSelected && !element.locked && (
        <>
          <ResizeHandles element={element} zoom={zoom} onResize={(updates) => { onUpdate(updates); onDragEnd?.(); }} />
          <RotationHandle element={element} zoom={zoom} onRotate={(rotation) => { onUpdate({ rotation }); onDragEnd?.(); }} />
        </>
      )}
    </div>
  );
}

function DraggableDeviceFrame({ element, isSelected, zoom, onSelect, onClick, onUpdate, onDragEnd }) {
  const { ref, handleMouseDown } = useDraggable({ element, zoom, onUpdate, onSelect, onDragEnd, onClick });

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
        transform: build3DTransform(element),
      }}
      data-element-id={element.id}
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

const DraggableElement = memo(function DraggableElement({ element, isSelected, zoom, onSelect, onClick, onUpdate, onDragEnd }) {
  const commonProps = { element, isSelected, zoom, onSelect, onClick, onUpdate, onDragEnd };

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
}, (prev, next) => {
  return prev.element === next.element
    && prev.isSelected === next.isSelected
    && prev.zoom === next.zoom;
});

export default DraggableElement;
