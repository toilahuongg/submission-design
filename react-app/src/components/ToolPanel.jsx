import { useState, useRef } from 'react';
import useEditorStore from '../store/editorStore';
import TEMPLATES from '../data/templates';
import { RectIcon, CircleIcon, ArrowIcon, BadgeIcon, CalloutIcon, NumberIcon, HighlightIcon, UploadIcon, NoFrameIcon } from './icons/SidebarIcons';

const TOOL_TITLES = {
  text: 'Văn bản',
  shape: 'Hình dạng',
  device: 'Thiết bị',
  image: 'Hình ảnh',
  icon: 'Biểu tượng',
  annotation: 'Chú thích',
  templates: 'Mẫu thiết kế',
};

function TextToolContent() {
  const addText = useEditorStore((s) => s.addText);

  const presets = [
    { label: 'Tiêu đề', size: 64, weight: '700' },
    { label: 'Phụ đề', size: 36, weight: '500' },
    { label: 'Nội dung', size: 24, weight: '400' },
  ];

  return (
    <div className="tool-panel__body">
      <button className="btn btn--primary btn--block" onClick={addText}>
        Thêm văn bản
      </button>
      <div className="tool-panel__section">
        <span className="form-label">Kiểu nhanh</span>
        <div className="tool-panel__presets">
          {presets.map((p) => (
            <button
              key={p.label}
              className="tool-panel__preset-btn"
              onClick={() => {
                const { addElement, elements } = useEditorStore.getState();
                addElement({
                  id: 'text-' + Date.now(),
                  type: 'text',
                  content: p.label,
                  font: 'Instrument Sans',
                  size: p.size,
                  color: '#FFFFFF',
                  weight: p.weight,
                  textAlign: 'center',
                  letterSpacing: 0,
                  shadow: { enabled: false, color: '#000000', blur: 4, offsetX: 2, offsetY: 2 },
                  outline: { enabled: false, color: '#000000', width: 1 },
                  rotation: 0,
                  x: 800,
                  y: 100,
                  zIndex: elements.length,
                });
              }}
            >
              <span style={{ fontSize: p.size > 40 ? '1.25rem' : p.size > 28 ? '1rem' : '0.875rem', fontWeight: p.weight }}>
                {p.label}
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function ShapeToolContent() {
  const addShape = useEditorStore((s) => s.addShape);

  const shapeTypes = [
    { type: 'rectangle', icon: <RectIcon />, label: 'Hình chữ nhật' },
    { type: 'circle', icon: <CircleIcon />, label: 'Hình tròn' },
    { type: 'arrow', icon: <ArrowIcon />, label: 'Mũi tên' },
    { type: 'badge', icon: <BadgeIcon />, label: 'Badge' },
  ];

  return (
    <div className="tool-panel__body">
      <div className="tool-panel__grid tool-panel__grid--2col">
        {shapeTypes.map((s) => (
          <button key={s.type} className="tool-panel__grid-item" onClick={() => addShape(s.type)} title={s.label}>
            {s.icon}
            <span>{s.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function DeviceToolContent() {
  const addDevice = useEditorStore((s) => s.addDevice);

  const devices = [
    { type: 'browser', label: 'Trình duyệt', preview: 'mock-browser-mini' },
    { type: 'laptop', label: 'Laptop', preview: 'mock-laptop-mini' },
    { type: 'desktop', label: 'Desktop', preview: 'mock-desktop-mini' },
    { type: 'iphone', label: 'iPhone', preview: 'mock-iphone-mini' },
    { type: 'android', label: 'Android', preview: 'mock-android-mini' },
    { type: 'ipad', label: 'iPad', preview: 'mock-ipad-mini' },
    { type: 'tablet', label: 'Tablet', preview: 'mock-tablet-mini' },
    { type: 'none', label: 'Không khung', icon: <NoFrameIcon /> },
  ];

  return (
    <div className="tool-panel__body">
      <div className="device-grid">
        {devices.map((d) => (
          <button key={d.type} className="device-option" onClick={() => addDevice(d.type)}>
            <div className="device-preview">{d.icon || <div className={d.preview}></div>}</div>
            <span>{d.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function ImageToolContent() {
  const addImageOverlay = useEditorStore((s) => s.addImageOverlay);
  const inputRef = useRef(null);
  const [dragOver, setDragOver] = useState(false);
  const [imageUrl, setImageUrl] = useState('');

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

  const handleAddFromUrl = () => {
    if (!imageUrl.trim()) return;
    const img = new Image();
    img.crossOrigin = "Anonymous";
    img.onload = () => {
      const maxSize = 300;
      const ratio = Math.min(maxSize / img.width, maxSize / img.height, 1);
      addImageOverlay(imageUrl, img.width * ratio, img.height * ratio);
      setImageUrl('');
    };
    img.onerror = () => console.error("Failed to load image from URL");
    img.src = imageUrl;
  };

  return (
    <div className="tool-panel__body">
      <div className="form-group" style={{ marginBottom: '12px' }}>
        <div style={{ display: 'flex', gap: '8px' }}>
          <input
            type="text"
            className="form-input"
            placeholder="Dán link ảnh vào đây..."
            value={imageUrl}
            onChange={(e) => setImageUrl(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleAddFromUrl()}
          />
          <button className="btn btn--primary" onClick={handleAddFromUrl} style={{ padding: '0 12px', whiteSpace: 'nowrap' }}>
            Thêm
          </button>
        </div>
      </div>
      <div
        className={`upload-zone upload-zone--large ${dragOver ? 'dragover' : ''}`}
        onClick={() => inputRef.current?.click()}
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={(e) => { e.preventDefault(); setDragOver(false); handleUpload(e.dataTransfer.files[0]); }}
      >
        <UploadIcon />
        <span className="upload-text">Tải ảnh từ máy</span>
        <span className="upload-hint">PNG, JPG tối đa 10MB</span>
        <input ref={inputRef} type="file" accept="image/*" hidden onChange={(e) => handleUpload(e.target.files[0])} />
      </div>
    </div>
  );
}

function IconToolContent() {
  const { builtInIcons, addIcon } = useEditorStore();

  return (
    <div className="tool-panel__body">
      <div className="icons-grid">
        {builtInIcons.map((icon) => (
          <button key={icon.id} className="icon-item" onClick={() => addIcon(icon)} title={icon.name}>
            <div dangerouslySetInnerHTML={{ __html: icon.svg }} />
          </button>
        ))}
      </div>
    </div>
  );
}

function AnnotationToolContent() {
  const addAnnotation = useEditorStore((s) => s.addAnnotation);

  const annotationTypes = [
    { type: 'callout', icon: <CalloutIcon />, label: 'Callout' },
    { type: 'numbered-circle', icon: <NumberIcon />, label: 'Số thứ tự' },
    { type: 'highlight', icon: <HighlightIcon />, label: 'Highlight' },
  ];

  return (
    <div className="tool-panel__body">
      <div className="tool-panel__grid tool-panel__grid--3col">
        {annotationTypes.map((a) => (
          <button key={a.type} className="tool-panel__grid-item" onClick={() => addAnnotation(a.type)} title={a.label}>
            {a.icon}
            <span>{a.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
}

function TemplatesToolContent() {
  const applyTemplate = useEditorStore((s) => s.applyTemplate);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  return (
    <div className="tool-panel__body">
      <div className="template-grid">
        {TEMPLATES.map((template) => (
          <button
            key={template.id}
            className="template-card"
            onClick={() => {
              applyTemplate(template);
              setActiveTool('templates'); // close panel
            }}
          >
            <div
              className="template-card__preview"
              style={{ background: template.thumbnail }}
            >
              <span className="template-card__label">{template.name}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

const TOOL_CONTENT = {
  text: TextToolContent,
  shape: ShapeToolContent,
  device: DeviceToolContent,
  image: ImageToolContent,
  icon: IconToolContent,
  annotation: AnnotationToolContent,
  templates: TemplatesToolContent,
};

export default function ToolPanel() {
  const activeTool = useEditorStore((s) => s.activeTool);
  const setActiveTool = useEditorStore((s) => s.setActiveTool);

  if (!activeTool) return null;

  const ContentComponent = TOOL_CONTENT[activeTool];
  if (!ContentComponent) return null;

  return (
    <aside className="sidebar sidebar--left tool-panel">
      <div className="sidebar__header">
        <h2 className="sidebar__title">{TOOL_TITLES[activeTool]}</h2>
        <button className="btn btn--ghost btn--sm" onClick={() => setActiveTool(activeTool)} title="Đóng">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      </div>
      <div className="sidebar__content">
        <ContentComponent />
      </div>
    </aside>
  );
}
