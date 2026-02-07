import { memo } from 'react';

const DeviceFrame = memo(function DeviceFrame({ type, scale, shadow, screenshot }) {
  const baseWidth = 1200 * (scale / 100);
  const baseHeight = 720 * (scale / 100);
  // Use drop-shadow filter instead of box-shadow to follow border-radius
  const shadowStyle = shadow > 0
    ? { filter: `drop-shadow(0 ${shadow / 3}px ${shadow / 2}px rgba(0,0,0,${Math.min(shadow / 150, 0.5)}))` }
    : {};

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
        <div className="laptop-hardware">
          <div className="laptop-screen-container">
            <div className="laptop-camera"></div>
            <div className="laptop-screen" style={{ width: baseWidth, height: baseHeight }}>
              {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
            </div>
          </div>
          <div className="laptop-base">
            <div className="laptop-trackpad"></div>
          </div>
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
    const phoneWidth = 300 * (scale / 100);
    const phoneHeight = 606 * (scale / 100);
    return (
      <div className="device-frame device-frame--iphone" style={shadowStyle}>
        <div className="iphone-side-buttons">
          <div className="iphone-button iphone-button--silent"></div>
          <div className="iphone-button iphone-button--volume-up"></div>
          <div className="iphone-button iphone-button--volume-down"></div>
        </div>
        <div className="iphone-power-button"></div>
        <div className="iphone-body">
          <div className="iphone-dynamic-island"></div>
          <div className="iphone-screen" style={{ width: phoneWidth, height: phoneHeight }}>
            {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
          </div>
          <div className="iphone-home-indicator"></div>
        </div>
      </div>
    );
  }

  if (type === 'android') {
    const phoneWidth = 280 * (scale / 100);
    const phoneHeight = 580 * (scale / 100);
    return (
      <div className="device-frame device-frame--android" style={shadowStyle}>
        <div className="android-side-buttons">
          <div className="android-button android-button--volume"></div>
          <div className="android-button android-button--power"></div>
        </div>
        <div className="android-body">
          <div className="android-camera-punch"></div>
          <div className="android-screen" style={{ width: phoneWidth, height: phoneHeight }}>
            {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'ipad') {
    const tabletWidth = 600 * (scale / 100);
    const tabletHeight = 450 * (scale / 100);
    return (
      <div className="device-frame device-frame--ipad" style={shadowStyle}>
        <div className="ipad-body">
          <div className="ipad-camera"></div>
          <div className="ipad-screen" style={{ width: tabletWidth, height: tabletHeight }}>
            {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
          </div>
        </div>
      </div>
    );
  }

  if (type === 'tablet') {
    const tabletWidth = 580 * (scale / 100);
    const tabletHeight = 420 * (scale / 100);
    return (
      <div className="device-frame device-frame--tablet" style={shadowStyle}>
        <div className="tablet-body">
          <div className="tablet-camera"></div>
          <div className="tablet-screen" style={{ width: tabletWidth, height: tabletHeight }}>
            {screenshot ? <img src={screenshot} alt="Screenshot" /> : placeholder}
          </div>
        </div>
      </div>
    );
  }

  return null;
});

export default DeviceFrame;
