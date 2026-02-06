import useEditorStore from '../../store/editorStore';
import { RectIcon, CircleIcon, ArrowIcon, BadgeIcon, TrashIcon } from '../icons/SidebarIcons';
import Panel from './Panel';
import RotationControls from './RotationControls';

export default function ShapesPanel() {
  const {
    elements, selectedElementId, addShape, updateElement,
    updateElementWithHistory, deleteElement, selectElement, saveState
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
          <button key={s.type} className="shape-btn" onClick={() => addShape(s.type)} title={s.label}>{s.icon}</button>
        ))}
      </div>

      {shapes.length > 0 && (
        <div className="element-list">
          {shapes.map((shape) => (
            <div key={shape.id} className={`element-item ${shape.id === selectedElementId ? 'active' : ''}`} onClick={() => selectElement(shape.id)}>
              <div className="element-item__icon" style={{ color: shape.fill }}>{shapeTypes.find(s => s.type === shape.shapeType)?.icon}</div>
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
              <input type="number" className="form-input" value={selectedShape.width} min="20" max="800" onChange={(e) => updateElement(selectedElementId, { width: parseInt(e.target.value) })} />
            </div>
            <div className="form-group form-group--half">
              <label className="form-label">Chiều cao</label>
              <input type="number" className="form-input" value={selectedShape.height} min="20" max="800" onChange={(e) => updateElement(selectedElementId, { height: parseInt(e.target.value) })} />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label">Kiểu tô</label>
            <div className="btn-group">
              <button className={`btn-group__item ${(selectedShape.fillType || 'solid') === 'solid' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { fillType: 'solid' })}>Màu đơn</button>
              <button className={`btn-group__item ${selectedShape.fillType === 'gradient' ? 'active' : ''}`} onClick={() => updateElementWithHistory(selectedElementId, { fillType: 'gradient' })}>Gradient</button>
            </div>
          </div>

          {(selectedShape.fillType || 'solid') === 'solid' && (
            <div className="form-group">
              <label className="form-label">Màu nền</label>
              <div className="color-picker">
                <input type="color" value={selectedShape.fill} onChange={(e) => updateElement(selectedElementId, { fill: e.target.value })} />
                <input type="text" className="form-input color-input" value={selectedShape.fill} onChange={(e) => { if (/^#[0-9A-Fa-f]{6}$/.test(e.target.value)) updateElement(selectedElementId, { fill: e.target.value }); }} />
              </div>
            </div>
          )}

          {selectedShape.fillType === 'gradient' && (
            <>
              <div className="form-group">
                <label className="form-label">Màu gradient</label>
                <div className="gradient-controls">
                  <div className="color-picker">
                    <input type="color" value={selectedShape.fillGradientStart || '#5C6AC4'} onChange={(e) => updateElement(selectedElementId, { fillGradientStart: e.target.value })} />
                    <span className="color-label">Bắt đầu</span>
                  </div>
                  <div className="color-picker">
                    <input type="color" value={selectedShape.fillGradientEnd || '#202E78'} onChange={(e) => updateElement(selectedElementId, { fillGradientEnd: e.target.value })} />
                    <span className="color-label">Kết thúc</span>
                  </div>
                </div>
              </div>
              <div className="form-group">
                <label className="form-label">Góc gradient</label>
                <input type="range" min="0" max="360" value={selectedShape.fillGradientAngle || 135} onChange={(e) => updateElement(selectedElementId, { fillGradientAngle: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
                <span className="range-value">{selectedShape.fillGradientAngle || 135}°</span>
              </div>
            </>
          )}

          <div className="form-group">
            <label className="form-label">Viền</label>
            <input type="range" min="0" max="10" value={selectedShape.strokeWidth} onChange={(e) => updateElement(selectedElementId, { strokeWidth: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
            <span className="range-value">{selectedShape.strokeWidth}px</span>
          </div>

          {selectedShape.strokeWidth > 0 && (
            <div className="form-group">
              <label className="form-label">Màu viền</label>
              <div className="color-picker">
                <input type="color" value={selectedShape.stroke} onChange={(e) => updateElement(selectedElementId, { stroke: e.target.value })} />
              </div>
            </div>
          )}

          {selectedShape.shapeType === 'rectangle' && (
            <div className="form-group">
              <label className="form-label">Bo góc</label>
              <input type="range" min="0" max="50" value={selectedShape.borderRadius} onChange={(e) => updateElement(selectedElementId, { borderRadius: parseInt(e.target.value) })} onMouseUp={() => saveState()} />
              <span className="range-value">{selectedShape.borderRadius}px</span>
            </div>
          )}

          {selectedShape.shapeType === 'badge' && (
            <div className="form-group">
              <label className="form-label">Số</label>
              <input type="text" className="form-input" value={selectedShape.text} maxLength={3} onChange={(e) => updateElement(selectedElementId, { text: e.target.value })} />
            </div>
          )}

          <div className="form-group">
            <label className="form-label">Độ trong suốt</label>
            <input type="range" min="0.1" max="1" step="0.1" value={selectedShape.opacity} onChange={(e) => updateElement(selectedElementId, { opacity: parseFloat(e.target.value) })} onMouseUp={() => saveState()} />
            <span className="range-value">{Math.round(selectedShape.opacity * 100)}%</span>
          </div>

          <RotationControls elementId={selectedElementId} rotation={selectedShape.rotation || 0} />

          <button className="btn btn--danger btn--block" onClick={() => deleteElement(selectedElementId)}>
            <TrashIcon /> Xóa hình dạng
          </button>
        </div>
      )}
    </Panel>
  );
}
