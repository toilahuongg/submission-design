import { useState, useRef, useEffect } from 'react';
import useEditorStore from '../store/editorStore';

const ChevronIcon = ({ collapsed }) => (
  <svg
    className={`panel__chevron ${collapsed ? 'collapsed' : ''}`}
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M6 9l6 6 6-6" />
  </svg>
);

const PlusIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 5v14M5 12h14" />
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
  </svg>
);

const UploadIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4M17 8l-5-5-5 5M12 3v12" />
  </svg>
);

const NoFrameIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="10" />
    <path d="M4.93 4.93l14.14 14.14" />
  </svg>
);

const AlignLeftIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M3 12h12M3 18h18" />
  </svg>
);

const AlignCenterIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M6 12h12M3 18h18" />
  </svg>
);

const AlignRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M3 6h18M9 12h12M3 18h18" />
  </svg>
);

const RectIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="14" rx="2" />
  </svg>
);

const CircleIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
  </svg>
);

const ArrowIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M5 12h14M12 5l7 7-7 7" />
  </svg>
);

const BadgeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <text x="12" y="16" textAnchor="middle" fontSize="10" fill="currentColor">1</text>
  </svg>
);

const LayersIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5" />
  </svg>
);

const CalloutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="3" width="18" height="12" rx="2" />
    <path d="M8 15l4 6 4-6" />
  </svg>
);

const NumberIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <circle cx="12" cy="12" r="9" />
    <text x="12" y="16" textAnchor="middle" fontSize="12" fill="currentColor">1</text>
  </svg>
);

const HighlightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
    <rect x="3" y="5" width="18" height="14" rx="2" strokeDasharray="4 2" />
  </svg>
);

function Panel({ title, id, children, defaultOpen = true, autoExpand = false }) {
  const [collapsed, setCollapsed] = useState(!defaultOpen);

  useEffect(() => {
    if (autoExpand) {
      setCollapsed(false);
    }
  }, [autoExpand]);

  return (
    <section className="panel">
      <div className="panel__header" onClick={() => setCollapsed(!collapsed)}>
        <h3 className="panel__title">{title}</h3>
        <ChevronIcon collapsed={collapsed} />
      </div>
      <div className={`panel__body ${collapsed ? 'collapsed' : ''}`} id={id}>
        {children}
      </div>
    </section>
  );
}

function RotationControls({ elementId, rotation = 0 }) {
  const { updateElement, updateElementWithHistory } = useEditorStore();
  return (
    <div className="form-group">
      <label className="form-label">Xoay</label>
      <input
        type="range"
        min="0"
        max="360"
        value={rotation}
        onChange={(e) => updateElement(elementId, { rotation: parseInt(e.target.value) })}
        onMouseUp={() => updateElementWithHistory(elementId, { rotation })}
      />
      <span className="range-value">{rotation}°</span>
      <div className="rotation-quick-buttons">
        {[0, 90, 180, 270].map((deg) => (
          <button
            key={deg}
            className={`rotation-quick-btn ${rotation === deg ? 'active' : ''}`}
            onClick={() => updateElementWithHistory(elementId, { rotation: deg })}
          >
            {deg}°
          </button>
        ))}
      </div>
    </div>
  );
}

function BackgroundPanel() {
  const { background, setBackground, setBackgroundType, colorPresets, showToastMessage } = useEditorStore();
  const bgImageRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleColorChange = (e) => {
    setBackground({ color: e.target.value });
  };

  const handleGradientStartChange = (e) => {
    setBackground({ gradientStart: e.target.value });
  };

  const handleGradientEndChange = (e) => {
    setBackground({ gradientEnd: e.target.value });
  };

  const handleGradientAngleChange = (e) => {
    setBackground({ gradientAngle: parseInt(e.target.value) });
  };

  const handleImageUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setBackground({ image: e.target.result, type: 'image' });
        showToastMessage('Đã tải ảnh nền');
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Panel title="Nền" id="bgPanel">
      <div className="form-group">
        <label className="form-label">Kiểu nền</label>
        <div className="btn-group">
          {['solid', 'gradient', 'image'].map((type) => (
            <button
              key={type}
              className={`btn-group__item ${background.type === type ? 'active' : ''}`}
              onClick={() => setBackgroundType(type)}
            >
              {type === 'solid' ? 'Màu đơn' : type === 'gradient' ? 'Gradient' : 'Ảnh'}
            </button>
          ))}
        </div>
      </div>

      {background.type === 'solid' && (
        <div className="form-group">
          <label className="form-label">Màu nền</label>
          <div className="color-picker">
            <input
              type="color"
              value={background.color}
              onChange={handleColorChange}
            />
            <input
              type="text"
              className="form-input color-input"
              value={background.color}
              onChange={(e) => {
                if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                  setBackground({ color: e.target.value });
                }
              }}
            />
          </div>
        </div>
      )}

      {background.type === 'gradient' && (
        <>
          <div className="form-group">
            <label className="form-label">Kiểu gradient</label>
            <div className="btn-group">
              <button
                className={`btn-group__item ${background.gradientType === 'linear' ? 'active' : ''}`}
                onClick={() => setBackground({ gradientType: 'linear' })}
              >
                Tuyến tính
              </button>
              <button
                className={`btn-group__item ${background.gradientType === 'radial' ? 'active' : ''}`}
                onClick={() => setBackground({ gradientType: 'radial' })}
              >
                Tỏa tròn
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Màu gradient</label>
            <div className="gradient-controls">
              <div className="color-picker">
                <input
                  type="color"
                  value={background.gradientStart}
                  onChange={handleGradientStartChange}
                />
                <span className="color-label">Bắt đầu</span>
              </div>
              <div className="color-picker">
                <input
                  type="color"
                  value={background.gradientEnd}
                  onChange={handleGradientEndChange}
                />
                <span className="color-label">Kết thúc</span>
              </div>
            </div>
          </div>

          {background.gradientType === 'linear' && (
            <div className="form-group">
              <label className="form-label">Góc</label>
              <input
                type="range"
                min="0"
                max="360"
                value={background.gradientAngle}
                onChange={handleGradientAngleChange}
              />
              <span className="range-value">{background.gradientAngle}°</span>
            </div>
          )}

          {background.gradientType === 'radial' && (
            <div className="form-group">
              <label className="form-label">Vị trí tâm</label>
              <select
                className="form-select"
                value={background.radialPosition}
                onChange={(e) => setBackground({ radialPosition: e.target.value })}
              >
                <option value="center">Giữa</option>
                <option value="top">Trên</option>
                <option value="bottom">Dưới</option>
                <option value="left">Trái</option>
                <option value="right">Phải</option>
                <option value="top left">Trên trái</option>
                <option value="top right">Trên phải</option>
                <option value="bottom left">Dưới trái</option>
                <option value="bottom right">Dưới phải</option>
              </select>
            </div>
          )}
        </>
      )}

      {background.type === 'image' && (
        <>
          <div className="form-group">
            <label className="form-label">Ảnh nền</label>
            <div
              className={`upload-zone ${dragOver ? 'dragover' : ''}`}
              onClick={() => bgImageRef.current?.click()}
              onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
              onDragLeave={() => setDragOver(false)}
              onDrop={(e) => {
                e.preventDefault();
                setDragOver(false);
                handleImageUpload(e.dataTransfer.files[0]);
              }}
            >
              <UploadIcon />
              <span>Kéo thả hoặc click để tải ảnh</span>
              <input
                ref={bgImageRef}
                type="file"
                accept="image/*"
                hidden
                onChange={(e) => handleImageUpload(e.target.files[0])}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Làm mờ</label>
            <input
              type="range"
              min="0"
              max="20"
              value={background.blur}
              onChange={(e) => setBackground({ blur: parseInt(e.target.value) })}
            />
            <span className="range-value">{background.blur}px</span>
          </div>
        </>
      )}

      <div className="preset-colors">
        <span className="form-label">Màu gợi ý</span>
        <div className="color-swatches">
          {colorPresets.map((color) => (
            <button
              key={color}
              className={`swatch ${background.color === color ? 'active' : ''}`}
              style={{ background: color }}
              onClick={() => setBackground({ color, type: 'solid' })}
            />
          ))}
        </div>
      </div>
    </Panel>
  );
}

function DevicePanel() {
  const { addDevice, elements, selectedElementId, updateElement, deleteElement } = useEditorStore();

  const selectedElement = elements.find(el => el.id === selectedElementId);
  const isDeviceSelected = selectedElement?.type === 'device';

  const devices = [
    { type: 'none', label: 'Không khung', icon: <NoFrameIcon /> },
    { type: 'browser', label: 'Trình duyệt', preview: 'mock-browser-mini' },
    { type: 'laptop', label: 'Laptop', preview: 'mock-laptop-mini' },
    { type: 'desktop', label: 'Desktop', preview: 'mock-desktop-mini' },
    { type: 'iphone', label: 'iPhone', preview: 'mock-iphone-mini' },
    { type: 'android', label: 'Android', preview: 'mock-android-mini' },
    { type: 'ipad', label: 'iPad', preview: 'mock-ipad-mini' },
    { type: 'tablet', label: 'Tablet', preview: 'mock-tablet-mini' },
  ];

  return (
    <Panel title="Khung thiết bị" id="devicePanel" autoExpand={isDeviceSelected}>
      <div className="device-grid">
        {devices.map((d) => (
          <button
            key={d.type}
            className="device-option"
            onClick={() => addDevice(d.type)}
          >
            <div className="device-preview">
              {d.icon || <div className={d.preview}></div>}
            </div>
            <span>{d.label}</span>
          </button>
        ))}
      </div>

      {isDeviceSelected && (
        <>
          <div className="form-group">
            <label className="form-label">Tỷ lệ khung</label>
            <input
              type="range"
              min="50"
              max="100"
              value={selectedElement.scale || 85}
              onChange={(e) => updateElement(selectedElementId, { scale: parseInt(e.target.value) })}
            />
            <span className="range-value">{selectedElement.scale || 85}%</span>
          </div>
          <div className="form-group">
            <label className="form-label">Đổ bóng</label>
            <input
              type="range"
              min="0"
              max="100"
              value={selectedElement.shadow || 50}
              onChange={(e) => updateElement(selectedElementId, { shadow: parseInt(e.target.value) })}
            />
            <span className="range-value">{selectedElement.shadow || 50}%</span>
          </div>

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon />
            Xóa khung hình
          </button>
        </>
      )}
    </Panel>
  );
}

function ScreenshotPanel() {
  const { setScreenshot, showToastMessage, elements, selectedElementId } = useEditorStore();
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const selectedElement = elements.find(el => el.id === selectedElementId);
  const isDeviceSelected = selectedElement?.type === 'device';

  const handleUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        setScreenshot(e.target.result);
        if (isDeviceSelected) {
          showToastMessage('Đã cập nhật ảnh cho khung hình');
        } else {
          showToastMessage('Đã tạo khung hình mới với ảnh');
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Panel title="Ảnh chụp màn hình" id="screenshotPanel" autoExpand={isDeviceSelected}>
      <div
        className={`upload-zone upload-zone--large ${dragOver ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files[0]);
        }}
      >
        <UploadIcon />
        <span className="upload-text">
          {isDeviceSelected ? 'Cập nhật ảnh cho thiết bị' : 'Tải ảnh chụp màn hình'}
        </span>
        <span className="upload-hint">PNG, JPG tối đa 10MB</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </div>
    </Panel>
  );
}

function TextPanel() {
  const {
    elements,
    selectedElementId,
    addText,
    updateElement,
    updateElementWithHistory,
    deleteElement,
    selectElement,
    saveState
  } = useEditorStore();

  const texts = elements.filter(el => el.type === 'text');
  const selectedText = texts.find(t => t.id === selectedElementId);

  return (
    <Panel title="Văn bản" id="textPanel" autoExpand={!!selectedText}>
      <button className="btn btn--block btn--secondary" onClick={addText}>
        <PlusIcon />
        Thêm văn bản
      </button>

      <div className="text-list">
        {texts.map((text) => (
          <div
            key={text.id}
            className={`text-item ${text.id === selectedElementId ? 'active' : ''}`}
            onClick={() => selectElement(text.id)}
          >
            <div className="text-item__preview" style={{ color: text.color }}>T</div>
            <span className="text-item__name">{text.content || 'Văn bản trống'}</span>
          </div>
        ))}
      </div>

      {selectedText && (
        <div className="text-properties">
          <div className="form-group">
            <label className="form-label">Nội dung</label>
            <textarea
              className="form-input"
              value={selectedText.content}
              onChange={(e) => updateElement(selectedElementId, { content: e.target.value })}
              placeholder="Nhập văn bản..."
              rows={3}
              style={{ resize: 'vertical' }}
            />
          </div>

          <div className="form-row">
            <div className="form-group form-group--half">
              <label className="form-label">Font</label>
              <select
                className="form-select"
                value={selectedText.font}
                onChange={(e) => updateElementWithHistory(selectedElementId, { font: e.target.value })}
              >
                <option value="Instrument Sans">Instrument Sans</option>
                <option value="Playfair Display">Playfair Display</option>
                <option value="JetBrains Mono">JetBrains Mono</option>
                <option value="Inter">Inter</option>
                <option value="Roboto">Roboto</option>
                <option value="Montserrat">Montserrat</option>
                <option value="Open Sans">Open Sans</option>
                <option value="Poppins">Poppins</option>
                <option value="Lato">Lato</option>
                <option value="Raleway">Raleway</option>
                <option value="Nunito">Nunito</option>
                <option value="Source Sans Pro">Source Sans Pro</option>
                <option value="Ubuntu">Ubuntu</option>
                <option value="Arial">Arial</option>
                <option value="Georgia">Georgia</option>
              </select>
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Cỡ chữ</label>
              <input
                type="number"
                className="form-input"
                value={selectedText.size}
                min="12"
                max="200"
                onChange={(e) => updateElement(selectedElementId, { size: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Căn chỉnh</label>
            <div className="btn-group">
              <button
                className={`btn-group__item ${selectedText.textAlign === 'left' ? 'active' : ''}`}
                onClick={() => updateElementWithHistory(selectedElementId, { textAlign: 'left' })}
              >
                <AlignLeftIcon />
              </button>
              <button
                className={`btn-group__item ${selectedText.textAlign === 'center' ? 'active' : ''}`}
                onClick={() => updateElementWithHistory(selectedElementId, { textAlign: 'center' })}
              >
                <AlignCenterIcon />
              </button>
              <button
                className={`btn-group__item ${selectedText.textAlign === 'right' ? 'active' : ''}`}
                onClick={() => updateElementWithHistory(selectedElementId, { textAlign: 'right' })}
              >
                <AlignRightIcon />
              </button>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Màu chữ</label>
            <div className="color-picker">
              <input
                type="color"
                value={selectedText.color}
                onChange={(e) => updateElement(selectedElementId, { color: e.target.value })}
              />
              <input
                type="text"
                className="form-input color-input"
                value={selectedText.color}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    updateElement(selectedElementId, { color: e.target.value });
                  }
                }}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Độ đậm</label>
            <div className="btn-group">
              {[{ value: '400', label: 'Thường' }, { value: '600', label: 'Đậm' }, { value: '700', label: 'Rất đậm' }].map((w) => (
                <button
                  key={w.value}
                  className={`btn-group__item ${selectedText.weight === w.value ? 'active' : ''}`}
                  onClick={() => updateElementWithHistory(selectedElementId, { weight: w.value })}
                >
                  {w.label}
                </button>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Khoảng cách chữ</label>
            <input
              type="range"
              min="-5"
              max="20"
              value={selectedText.letterSpacing || 0}
              onChange={(e) => updateElement(selectedElementId, { letterSpacing: parseInt(e.target.value) })}
              onMouseUp={() => saveState()}
            />
            <span className="range-value">{selectedText.letterSpacing || 0}px</span>
          </div>

          <RotationControls elementId={selectedElementId} rotation={selectedText.rotation || 0} />

          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                checked={selectedText.shadow?.enabled || false}
                onChange={(e) => updateElementWithHistory(selectedElementId, {
                  shadow: { ...selectedText.shadow, enabled: e.target.checked }
                })}
              />
              Đổ bóng chữ
            </label>
            {selectedText.shadow?.enabled && (
              <div className="sub-controls">
                <div className="color-picker">
                  <input
                    type="color"
                    value={selectedText.shadow?.color || '#000000'}
                    onChange={(e) => updateElement(selectedElementId, {
                      shadow: { ...selectedText.shadow, color: e.target.value }
                    })}
                  />
                  <span className="color-label">Màu bóng</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Độ mờ</label>
                  <input
                    type="range"
                    min="0"
                    max="20"
                    value={selectedText.shadow?.blur || 4}
                    onChange={(e) => updateElement(selectedElementId, {
                      shadow: { ...selectedText.shadow, blur: parseInt(e.target.value) }
                    })}
                    onMouseUp={() => saveState()}
                  />
                </div>
              </div>
            )}
          </div>

          <div className="form-group">
            <label className="form-label">
              <input
                type="checkbox"
                checked={selectedText.outline?.enabled || false}
                onChange={(e) => updateElementWithHistory(selectedElementId, {
                  outline: { ...selectedText.outline, enabled: e.target.checked }
                })}
              />
              Viền chữ
            </label>
            {selectedText.outline?.enabled && (
              <div className="sub-controls">
                <div className="color-picker">
                  <input
                    type="color"
                    value={selectedText.outline?.color || '#000000'}
                    onChange={(e) => updateElement(selectedElementId, {
                      outline: { ...selectedText.outline, color: e.target.value }
                    })}
                  />
                  <span className="color-label">Màu viền</span>
                </div>
                <div className="form-group">
                  <label className="form-label">Độ dày</label>
                  <input
                    type="range"
                    min="1"
                    max="5"
                    value={selectedText.outline?.width || 1}
                    onChange={(e) => updateElement(selectedElementId, {
                      outline: { ...selectedText.outline, width: parseInt(e.target.value) }
                    })}
                    onMouseUp={() => saveState()}
                  />
                </div>
              </div>
            )}
          </div>

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon />
            Xóa văn bản
          </button>
        </div>
      )}
    </Panel>
  );
}

function ShapesPanel() {
  const {
    elements,
    selectedElementId,
    addShape,
    updateElement,
    updateElementWithHistory,
    deleteElement,
    selectElement,
    saveState
  } = useEditorStore();

  const shapes = elements.filter(el => el.type === 'shape');
  const selectedShape = shapes.find(s => s.id === selectedElementId);

  const shapeTypes = [
    { type: 'rectangle', icon: <RectIcon />, label: 'Hình chữ nhật' },
    { type: 'circle', icon: <CircleIcon />, label: 'Hình tròn' },
    { type: 'arrow', icon: <ArrowIcon />, label: 'Mũi tên' },
    { type: 'badge', icon: <BadgeIcon />, label: 'Badge' },
  ];

  return (
    <Panel title="Hình dạng" id="shapesPanel" defaultOpen={false} autoExpand={!!selectedShape}>
      <div className="shape-buttons">
        {shapeTypes.map((s) => (
          <button key={s.type} className="shape-btn" onClick={() => addShape(s.type)} title={s.label}>
            {s.icon}
          </button>
        ))}
      </div>

      {shapes.length > 0 && (
        <div className="element-list">
          {shapes.map((shape) => (
            <div
              key={shape.id}
              className={`element-item ${shape.id === selectedElementId ? 'active' : ''}`}
              onClick={() => selectElement(shape.id)}
            >
              <div className="element-item__icon" style={{ color: shape.fill }}>
                {shapeTypes.find(s => s.type === shape.shapeType)?.icon}
              </div>
              <span className="element-item__name">{shapeTypes.find(s => s.type === shape.shapeType)?.label}</span>
            </div>
          ))}
        </div>
      )}

      {selectedShape && (
        <div className="shape-properties">
          <div className="form-row">
            <div className="form-group form-group--half">
              <label className="form-label">Chiều rộng</label>
              <input
                type="number"
                className="form-input"
                value={selectedShape.width}
                min="20"
                max="800"
                onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Chiều cao</label>
              <input
                type="number"
                className="form-input"
                value={selectedShape.height}
                min="20"
                max="800"
                onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kiểu tô</label>
            <div className="btn-group">
              <button
                className={`btn-group__item ${(selectedShape.fillType || 'solid') === 'solid' ? 'active' : ''}`}
                onClick={() => updateElementWithHistory(selectedElementId, { fillType: 'solid' })}
              >
                Màu đơn
              </button>
              <button
                className={`btn-group__item ${selectedShape.fillType === 'gradient' ? 'active' : ''}`}
                onClick={() => updateElementWithHistory(selectedElementId, { fillType: 'gradient' })}
              >
                Gradient
              </button>
            </div>
          </div>

          {(selectedShape.fillType || 'solid') === 'solid' && (
            <div className="form-group">
              <label className="form-label">Màu nền</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={selectedShape.fill}
                  onChange={(e) => updateElement(selectedElementId, { fill: e.target.value })}
                />
                <input
                  type="text"
                  className="form-input color-input"
                  value={selectedShape.fill}
                  onChange={(e) => {
                    if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                      updateElement(selectedElementId, { fill: e.target.value });
                    }
                  }}
                />
              </div>
            </div>
          )}

          {selectedShape.fillType === 'gradient' && (
            <>
              <div className="form-group">
                <label className="form-label">Màu gradient</label>
                <div className="gradient-controls">
                  <div className="color-picker">
                    <input
                      type="color"
                      value={selectedShape.fillGradientStart || '#5C6AC4'}
                      onChange={(e) => updateElement(selectedElementId, { fillGradientStart: e.target.value })}
                    />
                    <span className="color-label">Bắt đầu</span>
                  </div>
                  <div className="color-picker">
                    <input
                      type="color"
                      value={selectedShape.fillGradientEnd || '#202E78'}
                      onChange={(e) => updateElement(selectedElementId, { fillGradientEnd: e.target.value })}
                    />
                    <span className="color-label">Kết thúc</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Góc gradient</label>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={selectedShape.fillGradientAngle || 135}
                  onChange={(e) => updateElement(selectedElementId, { fillGradientAngle: parseInt(e.target.value) })}
                  onMouseUp={() => saveState()}
                />
                <span className="range-value">{selectedShape.fillGradientAngle || 135}°</span>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Viền</label>
            <input
              type="range"
              min="0"
              max="10"
              value={selectedShape.strokeWidth}
              onChange={(e) => updateElement(selectedElementId, { strokeWidth: parseInt(e.target.value) })}
              onMouseUp={() => saveState()}
            />
            <span className="range-value">{selectedShape.strokeWidth}px</span>
          </div>

          {selectedShape.strokeWidth > 0 && (
            <div className="form-group">
              <label className="form-label">Màu viền</label>
              <div className="color-picker">
                <input
                  type="color"
                  value={selectedShape.stroke}
                  onChange={(e) => updateElement(selectedElementId, { stroke: e.target.value })}
                />
              </div>
            </div>
          )}

          {selectedShape.shapeType === 'rectangle' && (
            <div className="form-group">
              <label className="form-label">Bo góc</label>
              <input
                type="range"
                min="0"
                max="50"
                value={selectedShape.borderRadius}
                onChange={(e) => updateElement(selectedElementId, { borderRadius: parseInt(e.target.value) })}
                onMouseUp={() => saveState()}
              />
              <span className="range-value">{selectedShape.borderRadius}px</span>
            </div>
          )}

          {selectedShape.shapeType === 'badge' && (
            <div className="form-group">
              <label className="form-label">Số</label>
              <input
                type="text"
                className="form-input"
                value={selectedShape.text}
                maxLength={3}
                onChange={(e) => updateElement(selectedElementId, { text: e.target.value })}
              />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Độ trong suốt</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={selectedShape.opacity}
              onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })}
              onMouseUp={() => saveState()}
            />
            <span className="range-value">{Math.round(selectedShape.opacity * 100)}%</span>
          </div>

          <RotationControls elementId={selectedElementId} rotation={selectedShape.rotation || 0} />

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon />
            Xóa hình dạng
          </button>
        </div>
      )}
    </Panel>
  );
}

function ImagesPanel() {
  const {
    elements,
    selectedElementId,
    addImageOverlay,
    updateElement,
    deleteElement,
    selectElement,
    saveState
  } = useEditorStore();

  const images = elements.filter(el => el.type === 'image');
  const selectedImage = images.find(i => i.id === selectedElementId);
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);

  const handleUpload = (file) => {
    if (file && file.type.startsWith('image/')) {
      const reader = new FileReader();
      reader.onload = (e) => {
        const img = new Image();
        img.onload = () => {
          const maxSize = 300;
          const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
          addImageOverlay(e.target.result, img.width * ratio, img.height * ratio);
        };
        img.src = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <Panel title="Hình ảnh overlay" id="imagesPanel" defaultOpen={false}>
      <div
        className={`upload-zone ${dragOver ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setDragOver(false);
          handleUpload(e.dataTransfer.files[0]);
        }}
      >
        <UploadIcon />
        <span>Thêm logo / sticker</span>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          hidden
          onChange={(e) => handleUpload(e.target.files[0])}
        />
      </div>

      {images.length > 0 && (
        <div className="element-list">
          {images.map((image) => (
            <div
              key={image.id}
              className={`element-item ${image.id === selectedElementId ? 'active' : ''}`}
              onClick={() => selectElement(image.id)}
            >
              <img src={image.src} alt="" className="element-item__thumb" />
              <span className="element-item__name">Hình ảnh</span>
            </div>
          ))}
        </div>
      )}

      {selectedImage && (
        <div className="image-properties">
          <div className="form-row">
            <div className="form-group form-group--half">
              <label className="form-label">Chiều rộng</label>
              <input
                type="number"
                className="form-input"
                value={Math.round(selectedImage.width)}
                min="20"
                max="800"
                onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Chiều cao</label>
              <input
                type="number"
                className="form-input"
                value={Math.round(selectedImage.height)}
                min="20"
                max="800"
                onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Độ trong suốt</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={selectedImage.opacity}
              onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })}
              onMouseUp={() => saveState()}
            />
            <span className="range-value">{Math.round(selectedImage.opacity * 100)}%</span>
          </div>

          <RotationControls elementId={selectedElementId} rotation={selectedImage.rotation || 0} />

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon />
            Xóa hình ảnh
          </button>
        </div>
      )}
    </Panel>
  );
}

function AnnotationsPanel() {
  const {
    elements,
    selectedElementId,
    addAnnotation,
    updateElement,
    deleteElement,
    selectElement,
    saveState
  } = useEditorStore();

  const annotations = elements.filter(el => el.type === 'annotation');
  const selectedAnnotation = annotations.find(a => a.id === selectedElementId);

  const annotationTypes = [
    { type: 'callout', icon: <CalloutIcon />, label: 'Callout' },
    { type: 'numbered-circle', icon: <NumberIcon />, label: 'Số thứ tự' },
    { type: 'highlight', icon: <HighlightIcon />, label: 'Highlight' },
  ];

  return (
    <Panel title="Chú thích" id="annotationsPanel" defaultOpen={false}>
      <div className="shape-buttons">
        {annotationTypes.map((a) => (
          <button key={a.type} className="shape-btn" onClick={() => addAnnotation(a.type)} title={a.label}>
            {a.icon}
          </button>
        ))}
      </div>

      {annotations.length > 0 && (
        <div className="element-list">
          {annotations.map((annotation) => (
            <div
              key={annotation.id}
              className={`element-item ${annotation.id === selectedElementId ? 'active' : ''}`}
              onClick={() => selectElement(annotation.id)}
            >
              <div className="element-item__icon" style={{ color: annotation.fill }}>
                {annotationTypes.find(a => a.type === annotation.annotationType)?.icon}
              </div>
              <span className="element-item__name">
                {annotationTypes.find(a => a.type === annotation.annotationType)?.label}
              </span>
            </div>
          ))}
        </div>
      )}

      {selectedAnnotation && (
        <div className="annotation-properties">
          <div className="form-group">
            <label className="form-label">Màu nền</label>
            <div className="color-picker">
              <input
                type="color"
                value={selectedAnnotation.fill}
                onChange={(e) => updateElement(selectedElementId, { fill: e.target.value })}
              />
            </div>
          </div>

          {selectedAnnotation.annotationType === 'callout' && (
            <div className="form-group">
              <label className="form-label">Nội dung</label>
              <input
                type="text"
                className="form-input"
                value={selectedAnnotation.text}
                onChange={(e) => updateElement(selectedElementId, { text: e.target.value })}
              />
            </div>
          )}

          {selectedAnnotation.annotationType === 'numbered-circle' && (
            <>
              <div className="form-group">
                <label className="form-label">Số</label>
                <input
                  type="number"
                  className="form-input"
                  value={selectedAnnotation.number}
                  min="1"
                  max="99"
                  onChange={(e) => updateElement(selectedElementId, { number: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group">
                <label className="form-label">Kích thước</label>
                <input
                  type="range"
                  min="24"
                  max="80"
                  value={selectedAnnotation.size}
                  onChange={(e) => updateElement(selectedElementId, { size: parseInt(e.target.value) })}
                  onMouseUp={() => saveState()}
                />
                <span className="range-value">{selectedAnnotation.size}px</span>
              </div>
            </>
          )}

          {selectedAnnotation.annotationType === 'highlight' && (
            <div className="form-row">
              <div className="form-group form-group--half">
                <label className="form-label">Rộng</label>
                <input
                  type="number"
                  className="form-input"
                  value={selectedAnnotation.width}
                  onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })}
                />
              </div>
              <div className="form-group form-group--half">
                <label className="form-label">Cao</label>
                <input
                  type="number"
                  className="form-input"
                  value={selectedAnnotation.height}
                  onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })}
                />
              </div>
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Độ trong suốt</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={selectedAnnotation.opacity}
              onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })}
              onMouseUp={() => saveState()}
            />
            <span className="range-value">{Math.round(selectedAnnotation.opacity * 100)}%</span>
          </div>

          <RotationControls elementId={selectedElementId} rotation={selectedAnnotation.rotation || 0} />

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon />
            Xóa chú thích
          </button>
        </div>
      )}
    </Panel>
  );
}

function IconsPanel() {
  const {
    builtInIcons,
    elements,
    selectedElementId,
    addIcon,
    updateElement,
    deleteElement,
    selectElement,
    saveState
  } = useEditorStore();

  const icons = elements.filter(el => el.type === 'icon');
  const selectedIcon = icons.find(i => i.id === selectedElementId);

  return (
    <Panel title="Biểu tượng" id="iconsPanel" defaultOpen={false}>
      <div className="icons-grid">
        {builtInIcons.map((icon) => (
          <button
            key={icon.id}
            className="icon-item"
            onClick={() => addIcon(icon)}
            title={icon.name}
          >
            <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
          </button>
        ))}
      </div>

      {icons.length > 0 && (
        <div className="element-list" style={{ marginTop: 8 }}>
          {icons.map((icon) => (
            <div
              key={icon.id}
              className={`element-item ${icon.id === selectedElementId ? 'active' : ''}`}
              onClick={() => selectElement(icon.id)}
            >
              <div className="element-item__icon" dangerouslySetInnerHTML={{ __html: icon.svg }} />
              <span className="element-item__name">{icon.name}</span>
            </div>
          ))}
        </div>
      )}

      {selectedIcon && (
        <div className="icon-properties" style={{ marginTop: 12, paddingTop: 12, borderTop: '1px solid var(--border-subtle)' }}>
          <div className="form-group">
            <label className="form-label">Màu</label>
            <div className="color-picker">
              <input
                type="color"
                value={selectedIcon.color}
                onChange={(e) => updateElement(selectedElementId, { color: e.target.value })}
              />
              <input
                type="text"
                className="form-input color-input"
                value={selectedIcon.color}
                onChange={(e) => {
                  if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) {
                    updateElement(selectedElementId, { color: e.target.value });
                  }
                }}
              />
            </div>
          </div>

          <div className="form-row">
            <div className="form-group form-group--half">
              <label className="form-label">Rộng</label>
              <input
                type="number"
                className="form-input"
                value={selectedIcon.width}
                min="16"
                max="400"
                onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })}
              />
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Cao</label>
              <input
                type="number"
                className="form-input"
                value={selectedIcon.height}
                min="16"
                max="400"
                onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Độ trong suốt</label>
            <input
              type="range"
              min="0.1"
              max="1"
              step="0.1"
              value={selectedIcon.opacity}
              onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })}
              onMouseUp={() => saveState()}
            />
            <span className="range-value">{Math.round(selectedIcon.opacity * 100)}%</span>
          </div>

          <RotationControls elementId={selectedElementId} rotation={selectedIcon.rotation || 0} />

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon />
            Xóa biểu tượng
          </button>
        </div>
      )}
    </Panel>
  );
}

function AlignDistributePanel() {
  const { elements, alignElements, distributeElements } = useEditorStore();

  if (elements.length < 2) return null;

  return (
    <Panel title="Căn chỉnh & Phân bố" id="alignPanel" defaultOpen={false}>
      <div className="form-group">
        <label className="form-label">Căn chỉnh</label>
        <div className="align-buttons">
          <button className="align-btn" onClick={() => alignElements('left')} title="Căn trái">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="4" y1="2" x2="4" y2="22" /><rect x="8" y="6" width="12" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('center')} title="Căn giữa ngang">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="2" x2="12" y2="22" /><rect x="4" y="6" width="16" height="4" rx="1" /><rect x="6" y="14" width="12" height="4" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('right')} title="Căn phải">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="20" y1="2" x2="20" y2="22" /><rect x="4" y="6" width="12" height="4" rx="1" /><rect x="8" y="14" width="8" height="4" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('top')} title="Căn trên">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="4" x2="22" y2="4" /><rect x="6" y="8" width="4" height="12" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('middle')} title="Căn giữa dọc">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="12" x2="22" y2="12" /><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="6" width="4" height="12" rx="1" /></svg>
          </button>
          <button className="align-btn" onClick={() => alignElements('bottom')} title="Căn dưới">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="2" y1="20" x2="22" y2="20" /><rect x="6" y="4" width="4" height="12" rx="1" /><rect x="14" y="8" width="4" height="8" rx="1" /></svg>
          </button>
        </div>
      </div>
      {elements.length >= 3 && (
        <div className="form-group">
          <label className="form-label">Phân bố đều</label>
          <div className="align-buttons">
            <button className="align-btn align-btn--wide" onClick={() => distributeElements('horizontal')} title="Phân bố ngang">
              Ngang
            </button>
            <button className="align-btn align-btn--wide" onClick={() => distributeElements('vertical')} title="Phân bố dọc">
              Dọc
            </button>
          </div>
        </div>
      )}
    </Panel>
  );
}

function LayersPanel() {
  const {
    elements,
    selectedElementId,
    selectElement,
    deleteElement,
    bringToFront,
    sendToBack,
    moveLayerUp,
    moveLayerDown
  } = useEditorStore();

  const sortedElements = [...elements].sort((a, b) => b.zIndex - a.zIndex);

  const getElementIcon = (element) => {
    switch (element.type) {
      case 'text': return 'T';
      case 'shape': return <RectIcon />;
      case 'image': return <UploadIcon />;
      case 'annotation': return <LayersIcon />;
      case 'icon': return '★';
      default: return '?';
    }
  };

  const getElementLabel = (element) => {
    switch (element.type) {
      case 'text': return element.content?.substring(0, 15) || 'Văn bản';
      case 'shape': return element.shapeType === 'rectangle' ? 'Hình CN' :
        element.shapeType === 'circle' ? 'Hình tròn' :
          element.shapeType === 'arrow' ? 'Mũi tên' : 'Badge';
      case 'image': return 'Hình ảnh';
      case 'annotation': return element.annotationType === 'callout' ? 'Callout' :
        element.annotationType === 'numbered-circle' ? `Số ${element.number}` : 'Highlight';
      case 'icon': return element.name || 'Biểu tượng';
      default: return 'Element';
    }
  };

  if (elements.length === 0) {
    return (
      <Panel title="Lớp" id="layersPanel" defaultOpen={false}>
        <div className="empty-state">
          <LayersIcon />
          <span>Chưa có phần tử nào</span>
        </div>
      </Panel>
    );
  }

  return (
    <Panel title="Lớp" id="layersPanel" defaultOpen={false}>
      <div className="layers-list">
        {sortedElements.map((element) => (
          <div
            key={element.id}
            className={`layer-item ${element.id === selectedElementId ? 'active' : ''}`}
            onClick={() => selectElement(element.id)}
          >
            <div className="layer-item__icon">
              {getElementIcon(element)}
            </div>
            <span className="layer-item__name">{getElementLabel(element)}</span>
            <div className="layer-item__actions">
              <button
                className="layer-btn"
                onClick={(e) => { e.stopPropagation(); moveLayerUp(element.id); }}
                title="Lên trên"
              >
                ↑
              </button>
              <button
                className="layer-btn"
                onClick={(e) => { e.stopPropagation(); moveLayerDown(element.id); }}
                title="Xuống dưới"
              >
                ↓
              </button>
              <button
                className="layer-btn layer-btn--delete"
                onClick={(e) => { e.stopPropagation(); deleteElement(element.id); }}
                title="Xóa"
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {selectedElementId && (
        <div className="layer-actions">
          <button className="btn btn--block btn--secondary" onClick={() => bringToFront(selectedElementId)}>
            Đưa lên trên cùng
          </button>
          <button className="btn btn--block btn--secondary" onClick={() => sendToBack(selectedElementId)}>
            Đưa xuống dưới cùng
          </button>
        </div>
      )}
    </Panel>
  );
}

export default function PropertiesSidebar() {
  return (
    <aside className="sidebar sidebar--right">
      <div className="sidebar__header">
        <h2 className="sidebar__title">Thuộc tính</h2>
      </div>
      <div className="sidebar__content">
        <BackgroundPanel />
        <DevicePanel />
        <ScreenshotPanel />
        <TextPanel />
        <ShapesPanel />
        <ImagesPanel />
        <IconsPanel />
        <AnnotationsPanel />
        <AlignDistributePanel />
        <LayersPanel />
      </div>
    </aside>
  );
}
